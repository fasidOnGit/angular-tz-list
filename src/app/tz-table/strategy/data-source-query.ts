import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TQueryFuncCallback} from '../tz-table.component';
import {distinctUntilChanged, map, mapTo, switchMap, take, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import TzTableState from '../../store/tz-table.state';
import {GetItems, SetItemSize, ViewportChange} from '../../store/actions';

/**
 * The remaining number of items to start loading the next chunk.
 * In other words: when user scrolls down the table and there are 3 or less remaining below
 * then, start loading the new data chunk.
 */
const SCROLLING_LOAD_ITEMS_THRESHOLD = 3;

/**
 * Defines viewport change information.
 */
export interface IViewportChange {
  /**
   * Scroll offset in pixels.
   */
  scrollOffset: number;

  /**
   * Viewport size (vertical) in pixels.
   */
  viewportSize: number;
}


/**
 * Data Source query,
 * @author Kader Fasid(fasidmpm@gmail.com)
 */
export class DataSourceQuery<T> extends DataSource<T> {

  /**
   * get visible data on view port.
   */
  public get renderedData(): Observable<T[]> {
    return this.visibleData;
  }

  /**
   * Indicator for loading.
   */
  public get loading(): Observable<boolean> {
    return this._loading;
  }

  /**
   * Currently displayed processed data.
   */
  private readonly visibleData: BehaviorSubject<T[]>;

  /**
   * Keep subscription over data processing pipeline.
   */
  private dataProcessingSubscription: Subscription[];


  /**
   * Cached data.
   * Design note: we are loading data by chunks and collecting in this member array. Essentially this means
   * that we do not have a recycling strategy.
   */
  private allData: T[];

  /**
   * Indicates that there's possibly more data available.
   */
  private loadMoreData: boolean;

  /**
   * Emits loading state.
   */
    // tslint:disable-next-line:variable-name
  private readonly _loading: BehaviorSubject<boolean>;

  /**
   * Observable on the viewport change.
   */
  private viewportChange: BehaviorSubject<IViewportChange>;

  /**
   * Ctor.
   * @param queryFunc Query Func.
   * @param viewport Virtual viewport.
   * @param itemSize row height.
   * @param dataChunkSize limit.
   * @param minViewPortHeight Initial viewport height.
   * @param store Store.
   */
  constructor(
    private readonly queryFunc: TQueryFuncCallback<T>,
    private viewport: CdkVirtualScrollViewport,
    private readonly itemSize: number,
    private readonly dataChunkSize: number,
    minViewPortHeight: number,
    private store: Store<{ transaction: TzTableState }>
  ) {
    super();
    this.dataProcessingSubscription = [];
    this.store.dispatch(new SetItemSize(this.itemSize));
    this.allData = [];
    this.visibleData = new BehaviorSubject<T[]>([]);
    this.loadMoreData = true;
    this._loading = new BehaviorSubject<boolean>(false);
    this.viewportChange = new BehaviorSubject<IViewportChange>({scrollOffset: 0, viewportSize: minViewPortHeight});
    this.viewport.elementScrolled().subscribe((evt: Event) => {
      // tslint:disable-next-line:no-non-null-assertion
      const scrollElem = evt!.currentTarget as Element;
      this.viewportChange.next({scrollOffset: scrollElem.scrollTop, viewportSize: this.viewport.getViewportSize()});
    });
  }

  /**
   * Calcuates items in viewport.
   * @param viewportChange Viewport change
   * @param itemSize size of each item in table.
   */
  public static calculateItemsInViewport(viewportChange: IViewportChange, itemSize: number): {
    itemsInViewport: number, startItemIndex: number, endItemIndex: number
  } {
    const itemsInViewport =  Math.floor(viewportChange.viewportSize / itemSize);
    const startItemIndex = Math.floor(viewportChange.scrollOffset / itemSize);
    return {
      itemsInViewport, startItemIndex,
      endItemIndex: itemsInViewport + startItemIndex
    };
  }

  /**
   * Stream of data that should be rendered in the viewport.
   */
  public connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
    this.reset();
    this.dataProcessingSubscription.push(
      this.createDataPipeline().subscribe(),
      this.store.select(state => state.transaction.allData).pipe(
        switchMap(() => this.store.select(state => state.transaction).pipe(take(1)))
      ).subscribe(
        ({recentChunk}) => {
          const {
            itemsInViewport, startItemIndex
          } = DataSourceQuery.calculateItemsInViewport(recentChunk.viewportChange, this.itemSize);
          const limit = startItemIndex + itemsInViewport - this.allData.length;
          let loadedItems: T[] = recentChunk.dataChunk as T[];

          if (!recentChunk.dataChunk) {
            loadedItems = [];
          }
          if (loadedItems.length < limit) {
            this.loadMoreData = false;
          }
          this._loading.next(false);
        }
      ),
      this.store.select(state => state.transaction.error).subscribe(err => {
        this._loading.next(false);
        console.error(err);
      })
    );
    return this.store.select(state => state.transaction).pipe(
      tap(
        ({recentChunk: dataLoadResult, allData}) => {
          const {
            endItemIndex, startItemIndex
          } = DataSourceQuery.calculateItemsInViewport(dataLoadResult.viewportChange, this.itemSize);

          this.allData = allData;
          this.viewport.setTotalContentSize(this.itemSize * allData.length);

          const currentOffset = this.itemSize * startItemIndex;
          this.viewport.setRenderedContentOffset(currentOffset);
          this.viewport.setRenderedRange({start: startItemIndex, end: endItemIndex});
        }
      ),
      map(({visibleData}) => visibleData)
    );
  }

  /**
   * Gets called when the viewport destroys.
   */
  public disconnect(collectionViewer: CollectionViewer): void {
    this.dataProcessingSubscription.forEach(x => x.unsubscribe());
    this.dataProcessingSubscription = [];
  }
  /**
   * Resets data and view.
   */
  public reset(): void {
    this.allData = [];
    this.loadMoreData = true;
    this.viewport.scrollToOffset(0);
    this.viewport.setTotalContentSize(0);
  }

  /**
   * Sets up the pipeline for data processing.
   * @returns Visible data observable
   */
  private createDataPipeline(): Observable<void> {
    return this.viewportChange.pipe(
      distinctUntilChanged((a, b) => a.scrollOffset === b.scrollOffset && a.viewportSize === b.viewportSize)
    ).pipe(
      tap(viewportChange => this.dispatchLoadActions(viewportChange)),
      mapTo(undefined)
    );
  }

  /**
   * Loads data in chunks.
   * @param viewportChange Viewport change info.
   * @return Chunk data with its appropriate chained viewport change.
   */
  private dispatchLoadActions(viewportChange: IViewportChange): void {
    const {
      itemsInViewport, startItemIndex
    } = DataSourceQuery.calculateItemsInViewport(viewportChange, this.itemSize);
    if (
      this.canLoadMore(startItemIndex + itemsInViewport)
    ) {
      this._loading.next(true);
      const limit = startItemIndex + itemsInViewport - this.allData.length;
      let chunksToLoad = Math.ceil(limit / this.dataChunkSize);
      if (limit % this.dataChunkSize === 0 || chunksToLoad === 0) {
        chunksToLoad++;
      }
      this.store.dispatch(
        new GetItems<T>(
          {
            limit: chunksToLoad * this.dataChunkSize,
            cursor: this.allData[this.allData.length - 1],
            queryFunc: this.queryFunc,
            viewportChange
          }
        )
      );
    } else {
      this.store.dispatch(new ViewportChange(viewportChange));
    }
  }

  /**
   * Indicator should fetch more data.
   * @param endItemIndex End item index.
   */
  public canLoadMore(endItemIndex: number): boolean {
    return !this._loading.value && this.loadMoreData && endItemIndex  + SCROLLING_LOAD_ITEMS_THRESHOLD >= this.allData.length;
  }
}
