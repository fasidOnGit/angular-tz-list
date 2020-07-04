import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ITzTableColumn} from './tz-table/tz-table-column.interface';
import {TQueryFuncCallback} from './tz-table/tz-table.component';
import {TzTransactionService} from './tz-transaction.service';

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
    private readonly tzTransactionService: TzTransactionService
  ) {
    this.columns = [
      {
        title: 'type',
        label: 'Type',
        property: 'type'
      },
      {
        title: 'amount',
        label: 'Amount XTZ (USD)',
        property: 'volume'
      },
      {
        title: 'date',
        label: 'Date',
        property: 'time'
      },
      {
        title: 'address',
        label: 'Address',
        property: 'sender'
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
