import TzTableState, {initializeState} from './tz-table.state';
import {ActionsUnion, ActionTypes} from './actions';
import {DataSourceQuery} from '../tz-table/strategy/data-source-query';

export const initialState = initializeState();

export function TzTransactionReducer(state = initialState, action: ActionsUnion): TzTableState {
  switch (action.type) {
    case ActionTypes.LoadSuccess:
      const newState = {
        ...state,
        allData: [...state.allData, ...action.payload.dataChunk],
        recentChunk: {...action.payload},
        error: undefined
      } as TzTableState;
      if (action.payload.dataChunk.length > 0) {
        const {
          endItemIndex, startItemIndex
        } = DataSourceQuery.calculateItemsInViewport(newState.recentChunk.viewportChange, newState.itemSize);
        newState.visibleData = newState.allData.slice(startItemIndex, endItemIndex);
      }
      return newState;
    case ActionTypes.ViewportChange:
      return {
        ...state, recentChunk: {dataChunk: [], viewportChange: action.payload}
      } as TzTableState;
    case ActionTypes.LoadFailure:
      return {
        ...state, ...action.payload
      };
    default:
      return state;
  }
}
