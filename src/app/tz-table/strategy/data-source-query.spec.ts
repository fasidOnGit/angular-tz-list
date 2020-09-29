/* tslint:disable:no-string-literal */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TzTableComponent} from '../tz-table.component';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {DataSourceQuery} from './data-source-query';
import {ITzTransacton} from '../../app.component';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {GetItems, ViewportChange} from '../../store/actions';
import {MemoizedSelector} from '@ngrx/store';
import TzTableState from '../../store/tz-table.state';

describe('DataSourceQuery', () => {
  let component: TzTableComponent;
  let fixture: ComponentFixture<TzTableComponent>;
  let dataSource: DataSourceQuery<ITzTransacton>;
  const tzTransaction: ITzTransacton = {
    type: 'transaction',
    time: Date.now(),
    sender: 123,
    row_id: '123654789',
    volume: 987
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ TzTableComponent ],
      providers: [
        {
          provide: Window,
          useFactory : () => ({
            innerHeight: 111
          })
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const rows = jasmine.createSpy().and.returnValue(hot('^--(a|)', {a: tzTransaction}));
    fixture = TestBed.createComponent(TzTableComponent);
    component = fixture.componentInstance;
    dataSource = new DataSourceQuery<ITzTransacton>(
      rows,
      {
        elementScrolled: jasmine.createSpy().and.returnValue(hot('^--a', {a: {currentTarget: {scrollTop: 0}}})),
        getViewportSize: jasmine.createSpy().and.returnValue(550),
        setTotalContentSize: jasmine.createSpy(),
        setRenderedContentOffset: jasmine.createSpy(),
        setRenderedRange: jasmine.createSpy(),
        scrollToOffset: jasmine.createSpy()
      } as any,
      50, 10, 550,
      component['store']
    );
    fixture.detectChanges();
  });

  it('dataSource, instantiated', () => {
    getTestScheduler().flush();
    expect(dataSource).toBeDefined();
    expect(dataSource['viewport'].getViewportSize).toHaveBeenCalled();
  });

  // it('#createDataPipeline, should dispatch action when viewport change is emitted', () => {
  //   spyOn(dataSource as any, 'dispatchLoadActions');
  //   dataSource['viewportChange'] = hot('^--a', {scrollOffset: 0, viewportSize: 550}) as any;
  //   expect(
  //     dataSource['createDataPipeline']()
  //   ).toBeObservable(
  //     cold('---a', {a: undefined})
  //   );
  // });

  it('#dispatchLoadActions, if canLoadMore then dispatch getitems', () => {
    spyOn(dataSource, 'canLoadMore').and.returnValue(true);
    spyOn(dataSource['store'], 'dispatch');
    dataSource['dispatchLoadActions']({scrollOffset: 0, viewportSize: 550});
    expect(dataSource['store'].dispatch).toHaveBeenCalledWith(
      new GetItems(
        {
          limit: 20, cursor: undefined, queryFunc: jasmine.any(Function), viewportChange: { scrollOffset: 0, viewportSize: 550 }
        } as any
      )
    );
  });

  it('#dispatchLoadActions, if canLoadMore is false then dispatch ViewportChange', () => {
    spyOn(dataSource, 'canLoadMore').and.returnValue(false);
    spyOn(dataSource['store'], 'dispatch');
    const viewportChange = {scrollOffset: 0, viewportSize: 550};
    dataSource['dispatchLoadActions'](viewportChange);
    expect(dataSource['store'].dispatch).toHaveBeenCalledWith(
     new ViewportChange(viewportChange)
    );
  });

  it('#connect', () => {
    spyOn(dataSource, 'reset');
    const state = {
      transaction: {
        allData: [],
        recentChunk: {
          viewportChange: {
            viewportSize: 500,
            scrollOffset: 0
          },
          dataChunk: []
        },
        visibleData: [],
        error: undefined,
        itemSize: 50
      } as TzTableState
    };
    spyOn(dataSource as any, 'createDataPipeline').and.returnValue(cold('-a', {a: undefined}));
    dataSource['store'].select = jasmine.createSpy().and.callFake((cb) => {
      const data = cb(state);
      switch (data) {
        case state.transaction.allData:
          return hot('^--a', {a: []});
        case state.transaction.error:
          return hot('^--a', {a: undefined});
        case state.transaction:
        default:
          return hot('^--a', {a: state.transaction});
      }
    });
    expect(dataSource.connect({} as any)).toBeObservable(
      cold('---a', {a: state.transaction.visibleData})
    );
    getTestScheduler().flush();
    expect(dataSource['viewport'].setRenderedRange).toHaveBeenCalled();
    expect(dataSource['viewport'].setRenderedContentOffset).toHaveBeenCalled();
    expect(dataSource['viewport'].setTotalContentSize).toHaveBeenCalled();
  });
});
