import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ITzTableColumn} from './tz-table/tz-table-column.interface';
import {TQueryFuncCallback} from './tz-table/tz-table.component';
import {TzTransactionService} from './tz-transaction.service';
import {formatDate} from '@angular/common';

/**
 * Model for Transaction.
 */
export interface ITzTransacton {
  type: string;
  volume: number;
  time: number;
  sender: number;
  row_id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'angular-tz-list';
  columns: ITzTableColumn[];
  loadDataQuery: TQueryFuncCallback<ITzTransacton>;

  constructor(
    private readonly tzTransactionService: TzTransactionService,
  ) {
    this.columns = [
      {
        title: 'type',
        label: 'Type',
        property: 'type',
        flexWidth: 20
      },
      {
        title: 'amount',
        label: 'Amount XTZ ( USD )',
        property: 'volume',
        valueTransformer: ((value, property) => {
          return value[property] * 2.33; // 1 XTZ to USD
        }),
        flexWidth: 35
      },
      {
        title: 'date',
        label: 'Date',
        property: 'time',
        valueTransformer: (value, property) => {
          return formatDate(value[property], 'MMM d y, h:mm', 'en-US');
        }
      },
      {
        title: 'address',
        label: 'Address',
        property: 'sender',
        valueTransformer: ((value, property) => {
          const val = value[property] as string;
          // Yes, we can do the same with css :after and ellipsis., But hey! I kinda chose this :)
          return `${val.slice(0, 2)}...${val.slice(val.length - 6, val.length - 1)}`;
        })
      }
    ];
    this.loadDataQuery = this.loadData();
  }

  loadData(): TQueryFuncCallback<ITzTransacton> {
    return ({limit, cursor}) => {
      return this.tzTransactionService.getTransaction(
        {columns: ['row_id', 'time' , 'type' , 'sender', 'volume'], limit, cursor: cursor?.row_id}
      );
    };
  }
}
