import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, EMPTY, Observable, of, Subscription, throwError} from 'rxjs';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TQueryFuncCallback} from './tz-table.component';
import {catchError, debounceTime, distinctUntilChanged, map, mergeMap, switchMap, tap} from 'rxjs/operators';


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
  private dataProcessingSubscription?: Subscription;


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
  private _loading: BehaviorSubject<boolean>;

  /**
   * Observable on the viewport change.
   */
  private readonly viewportChange: BehaviorSubject<IViewportChange>;
  coutner = 0;

  /**
   * Ctor.
   * @param queryFunc Query Func.
   * @param viewport Virtual viewport.
   * @param itemSize row height.
   * @param dataChunkSize limit.
   */
  constructor(
    private readonly queryFunc: TQueryFuncCallback<T>,
    private viewport: CdkVirtualScrollViewport,
    private readonly itemSize: number,
    private readonly dataChunkSize: number
  ) {
    super();
    this.allData = [];
    this.visibleData = new BehaviorSubject<T[]>([]);
    this.loadMoreData = true;
    this._loading = new BehaviorSubject<boolean>(false);
    this.viewportChange = new BehaviorSubject<IViewportChange>({scrollOffset: 0, viewportSize: this.itemSize * this.dataChunkSize});
    this.viewport.elementScrolled().subscribe((evt: Event) => {
      // tslint:disable-next-line:no-non-null-assertion
      const scrollElem = evt!.currentTarget as Element;
      this.viewportChange.next({scrollOffset: scrollElem.scrollTop, viewportSize: this.viewport.getViewportSize()});
    });
  }

  /**
   * Stream of data that should be rendered in the viewport.
   */
  public connect(collectionViewer: CollectionViewer): Observable<T[] | ReadonlyArray<T>> {
    this.reset();
    this.coutner++;
    if (this.coutner < 9) {
      this.dataProcessingSubscription = this.createDataPipeline().subscribe();
    }
    return this.visibleData;
  }

  /**
   * Gets called when the viewport destroys.
   */
  public disconnect(collectionViewer: CollectionViewer): void {
    if (this.dataProcessingSubscription) {
      this.dataProcessingSubscription.unsubscribe();
      this.dataProcessingSubscription = undefined;
    }
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
  private createDataPipeline(): Observable<T[]> {
    return this.viewportChange.pipe(
      distinctUntilChanged((a, b) => a.scrollOffset === b.scrollOffset && a.viewportSize === b.viewportSize)
    ).pipe(
      mergeMap(viewportChange => this.loadDataChunk(viewportChange)),
      tap(dataLoadResult => {
        if (dataLoadResult.dataChunk) {
          this.allData = this.allData.concat(dataLoadResult.dataChunk);
          this.viewport.setTotalContentSize(this.itemSize * this.allData.length);
        }
      }),
      map(dataLoadResult => {
        const itemsInViewport = Math.floor(dataLoadResult.viewportChange.viewportSize / this.itemSize);
        const startItemIndex = Math.floor(dataLoadResult.viewportChange.scrollOffset / this.itemSize);
        const endItemIndex = startItemIndex + itemsInViewport;
        const slicedData = this.allData.slice(startItemIndex, endItemIndex);

        const currentOffset = this.itemSize * startItemIndex;
        this.viewport.setRenderedContentOffset(currentOffset);
        this.viewport.setRenderedRange({start: startItemIndex, end: endItemIndex});
        this.visibleData.next(slicedData);

        return slicedData;
      })
    );
  }

  /**
   * Loads data in chunks.
   * @param viewportChange Viewport change info.
   * @return Chunk data with its appropriate chained viewport change.
   */
  private loadDataChunk(viewportChange: IViewportChange): Observable<{viewportChange: IViewportChange, dataChunk: T[]}> {
    const itemsInViewport = Math.floor(viewportChange.viewportSize / this.itemSize);
    const startItemIndex = Math.floor(viewportChange.scrollOffset / this.itemSize);
    let result: Observable<T[]>;
    console.log(startItemIndex + itemsInViewport + 3, this.allData.length);
    if (this._loading.value || startItemIndex + itemsInViewport + 3 <= this.allData.length || !this.loadMoreData) {
      result = of([]);
    } else {
      console.log(startItemIndex + itemsInViewport + 3, this.allData.length);
      this._loading.next(true);
      const loadStart = this.allData.length;
      const limit = startItemIndex + itemsInViewport - this.allData.length;
      let chunksToLoad = Math.ceil(limit / this.dataChunkSize);
      if (limit % this.dataChunkSize === 0 || chunksToLoad === 0) {
        chunksToLoad++;
      }
      result = this.queryFunc(
        {limit: chunksToLoad * this.dataChunkSize, cursor: this.allData[this.allData.length - 1]}
      ).pipe(
        map(data => {
          let loadedItems: T[] = data as T[];

          if (!data) {
            loadedItems = [];
          }
          if (loadedItems.length < limit) {
            this.loadMoreData = false;
          }
          this._loading.next(false);
          return loadedItems;
        }),
        catchError(err => {
          this._loading.next(false);
          return throwError(err);
        })
      );
    }
    return result.pipe(
      map(dataChunk => ({viewportChange, dataChunk}))
    );
  }
}
