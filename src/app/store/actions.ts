import {Action} from '@ngrx/store';
import {ITzTransacton} from '../app.component';
import {TQueryFuncCallback} from '../tz-table/tz-table.component';

export enum ActionTypes {
  LoadItems = '[Items] Load items from server',
  LoadSuccess = '[Items] Load success',
  VisibleItems = '[Items] Visible items in the viewport'
}

export class GetItems implements Action {
  readonly type = ActionTypes.LoadItems;
  constructor(public payload: {limit: number; cursor: ITzTransacton, queryFunc: TQueryFuncCallback<ITzTransacton>}) {
  }
}

export class LoadItems implements Action {
  readonly type = ActionTypes.LoadSuccess;
  constructor(public payload: ITzTransacton[]) {
  }
}

export class VisibleItems implements Action {
  readonly type = ActionTypes.VisibleItems;
  constructor(public payload: ITzTransacton[]) {
  }
}

export type ActionsUnion = GetItems | LoadItems | VisibleItems;
