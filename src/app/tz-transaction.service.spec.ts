/* tslint:disable:no-string-literal */
import {TzTransactionService} from './tz-transaction.service';
import {cold, hot} from 'jasmine-marbles';
import {HttpParams} from '@angular/common/http';

describe('TzTransactionService', () => {
  it('#getTransaction, should transform the api response into array of objects', () => {
    const columns = ['row_id', 'volume', 'sender', 'address', 'time'];
    const limit = 10;
    const cursor = '123654';
    const response = [
      ['121212', 12313123, 'fakeSender', 'Fake Address', 55225522],
      ['121215', 12313122, 'fakeSender1', 'Fake Address1', 65435155],
    ];
    const service = new TzTransactionService(
      {
        get: jasmine.createSpy().and.returnValue(hot('^--(a|)', {a: response}))
      } as any
    );
    const transformed = response.map(each => {
      const obj = {} as any;
      columns.forEach((col, i) => {
        obj[col] = each[i];
      });
      return obj;
    });
    const fromObject = {
      receiver: 'tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo',
      type: 'transaction',
      limit: limit.toString(),
      columns: columns.join(','),
      'cursor.lte': cursor
    };
    const params = new HttpParams({fromObject});
    expect(
      service.getTransaction({columns, cursor, limit})
    ).toBeObservable(
      cold('---(a|)', {a: transformed})
    );
    expect(
      service['http'].get
    ).toHaveBeenCalledWith(
      'https://api.tzstats.com/tables/op',
      { params }
    );
  });
});
