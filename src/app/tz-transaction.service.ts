import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ITzTransacton} from './app.component';
import {map} from 'rxjs/operators';

/**
 * Response from transaction.
 */
export type IRestTransactionResponse = Array<[number, number, number, string, number]>;

@Injectable({
  providedIn: 'root'
})
export class TzTransactionService {
  private static HOST_URL = 'https://api.tzstats.com/tables/op';
  constructor(
    private http: HttpClient
  ) {
  }

  getTransaction({columns, limit, cursor}: {columns: string[], limit: number, cursor?: string}): Observable<ITzTransacton[]> {
    const fromObject = {
      receiver: 'tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo',
      type: 'transaction',
      limit: limit.toString(),
      columns: columns.join(',')
    };
    if (cursor) {
      fromObject['cursor.lte'] = cursor;
    }
    const params = new HttpParams({fromObject});
    return this.http.get<IRestTransactionResponse>(TzTransactionService.HOST_URL, {params}).pipe(
      map(data => {
        return data.map((each) => {
          const obj = {} as ITzTransacton;
          columns.forEach((col, i) => {
            obj[col] = each[i];
          });
          return obj;
        });
      })
    );
  }
}
