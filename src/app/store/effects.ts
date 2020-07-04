import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ActionsUnion, ActionTypes} from './actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';

@Injectable()
export class TzTransactionEffects {
  constructor(
    private actions$: Actions<ActionsUnion>
  ) {
  }

  @Effect()
  loadTransaction$ = this.actions$.pipe(
    ofType(ActionTypes.LoadItems),
    mergeMap(({payload: {limit, cursor, queryFunc}}) => {
      return queryFunc({limit, cursor}).pipe(
        map(transactions => ({
          type: ActionTypes.LoadSuccess, payload: transactions
        })),
        catchError(() => EMPTY)
      );
    })
  );
}
