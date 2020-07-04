import TzTransactionState, {initializeState} from './tz-transaction.state';
import {ActionsUnion, ActionTypes} from './actions';

export const initialState = initializeState();

export function TzTransactionReducer(state = initialState, action: ActionsUnion): TzTransactionState {
  switch (action.type) {
    case ActionTypes.LoadSuccess:
      return {
        ...state,
        allData: [...state.allData, ...action.payload]
      } as TzTransactionState;
    case ActionTypes.VisibleItems:
      return {
        ...state, visibleData: action.payload
      } as TzTransactionState;
    default:
      return state;
  }
}
