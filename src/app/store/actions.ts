import {Action} from '@ngrx/store';
import {TQueryFuncCallback} from '../tz-table/tz-table.component';
import {IViewportChange} from '../tz-table/strategy/data-source-query';

export enum ActionTypes {
  LoadItems = '[Items] Load items from server',
  LoadSuccess = '[Items] Load success',
  ViewportChange = '[Items] Viewport change but do not require server fetch',
  LoadFailure = '[Items] Failure in fetching items from the server',
  SetItemSize = '[Items] Set Item Size in Table'
}

export class GetItems<T = any> implements Action {
  readonly type = ActionTypes.LoadItems;
  constructor(public payload: {limit: number; cursor: T, queryFunc: TQueryFuncCallback<T>, viewportChange: IViewportChange}) {
  }
}

export class LoadItems<T = any> implements Action {
  readonly type = ActionTypes.LoadSuccess;
  constructor(public payload: { dataChunk: T[], viewportChange: IViewportChange }) {
  }
}

export class ViewportChange<T = any> implements Action {
  readonly type = ActionTypes.ViewportChange;
  constructor(public payload: IViewportChange) {
  }
}

export class LoadFailure implements Action {
  readonly type = ActionTypes.LoadFailure;
  constructor(public payload: Error) {
  }
}

export class SetItemSize implements Action {
  readonly type = ActionTypes.SetItemSize;
  constructor(public payload: number) {
  }
}
export type ActionsUnion = GetItems | LoadItems | ViewportChange | LoadFailure | SetItemSize;
