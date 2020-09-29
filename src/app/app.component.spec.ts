/* tslint:disable:no-string-literal */
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {AppComponent, ITzTransacton} from './app.component';
import {TzTransactionService} from './tz-transaction.service';
import {cold, hot} from 'jasmine-marbles';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
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
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: TzTransactionService,
          useFactory: () => ({
            getTransaction: jasmine.createSpy().and.returnValue(hot('^--(a|)', {a: tzTransaction}))
          })
        },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(component.columns).toEqual([
      {
        title: 'type',
        label: 'Type',
        property: 'type'
      },
      {
        title: 'amount',
        label: 'Amount XTZ ( USD )',
        property: 'volume',
        valueTransformer: jasmine.any(Function),
        flexWidth: 38
      },
      {
        title: 'date',
        label: 'Date',
        property: 'time',
        valueTransformer: jasmine.any(Function)
      },
      {
        title: 'address',
        label: 'Address',
        property: 'sender',
        valueTransformer: jasmine.any(Function),
        flexWidth: 15
      }
    ]);
  });
  it('#loadData', () => {
    expect(
      component.loadDataQuery({limit: 10, cursor: tzTransaction})
    ).toBeObservable(cold('---(a|)', {a: tzTransaction}));
  });
});
