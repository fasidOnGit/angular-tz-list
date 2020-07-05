import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ActionsUnion, ActionTypes, LoadFailure, LoadItems} from './actions';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';

@Injectable()
export class TzTableEffects {
  constructor(
    private actions$: Actions<ActionsUnion>
  ) {
  }

  @Effect()
  loadTransaction$ = this.actions$.pipe(
    ofType(ActionTypes.LoadItems),
    mergeMap(({payload: {limit, cursor, queryFunc, viewportChange}}) => {
      return queryFunc({limit, cursor}).pipe(
        map(dataChunk => new LoadItems({dataChunk, viewportChange})),
        catchError((err) => of(new LoadFailure(err))),
      );
    })
  );
}
