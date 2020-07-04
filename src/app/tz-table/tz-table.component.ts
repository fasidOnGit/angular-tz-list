import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY} from '@angular/cdk/scrolling';
import {DataSource} from '@angular/cdk/collections';
import {ITzTableColumn} from './tz-table-column.interface';
import {DataSourceQuery} from './data-source-query';
import {CustomVirtualScrollStrategy} from './virtual-scroll-stratergy';

export type TQueryFuncCallback<T> = (params: {
  limit: number, cursor: T
}) => Observable<T[]>;

@Component({
  selector: 'app-tz-table',
  templateUrl: './tz-table.component.html',
  styleUrls: ['./tz-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy}]
})
export class TzTableComponent implements OnInit, AfterViewInit {
  offset: number;

  /**
   * Input: rows or query function (data source).
   * We can set up (bind) the following data sources:
   * DataSource<T> - A custom data source that extends DataSource.
   * of type TQueryFuncCallback will result in binding to the DataSourceQuery<T> instance.
   */
  @Input()
  public get rows(): TQueryFuncCallback<unknown> | DataSource<unknown> {
    return this._rows;
  }
  public set rows(value: TQueryFuncCallback<unknown> | DataSource<unknown>) {
    this._rows = value;
    if (this.isInitialized) {
      this.setupDataSource();
    }
  }

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {
    this.displayedColumns = [];
    this.columns = [];
    this.chunkSize = 10;
    this.isInitialized = false;
    this.itemSize = 50;
  }
  @Input()
  public columns: ITzTableColumn[];

  /**
   * List of column names to be displayed in table.
   */
  public displayedColumns: string[];

  /**
   * Data Source.
   */
  public dataSource: DataSource<unknown>;

  /**
   * Virtual scroll viewport instance.
   */
  @ViewChild(CdkVirtualScrollViewport, {static: false})
  public viewport!: CdkVirtualScrollViewport;

  /**
   * The size of the items to fetch per chunk.
   */
  @Input()
  public chunkSize: number;
  /**
   * Each item size.
   */
  public itemSize: number;
  /**
   * Rows instance.
   */
    // tslint:disable-next-line:variable-name
  private _rows: TQueryFuncCallback<unknown> | DataSource<unknown>;

  /**
   * Indicator if the table is initialized.
   */
  private isInitialized: boolean;


  /**
   * Type guard for data source objects.
   * @param arg An object.
   * @returns true if the object is a data source.
   */
  private static isDataSource(arg: any): arg is DataSource<unknown> {
    return arg.connect
      && arg.disconnect
      && arg.renderedData;
  }

  /**
   * On Init hook.
   */
  public ngOnInit(): void {
    this.displayedColumns = this.columns.map(({title}) => title);
  }

  /**
   * After view init hook.
   */
  public ngAfterViewInit(): void {
    this.setupDataSource();
    this.isInitialized = true;
  }

  /**
   * Sets up data source.
   */
  private setupDataSource(): void {
    if (this._rows) {
      if (TzTableComponent.isDataSource(this._rows)) {
        this.dataSource = this._rows as DataSource<unknown>;
      } else {
        this.dataSource = new DataSourceQuery(
          this._rows as TQueryFuncCallback<unknown>,
          this.viewport,
          this.itemSize,
          this.chunkSize
        );
      }
      this.cdr.markForCheck();
    }
  }

}
