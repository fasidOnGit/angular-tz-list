import TzTableState, {initializeState} from './tz-table.state';
import {ActionsUnion, ActionTypes} from './actions';

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
        const itemsInViewport = Math.floor(newState.recentChunk.viewportChange.viewportSize / newState.itemSize);
        const startItemIndex = Math.floor(newState.recentChunk.viewportChange.scrollOffset / newState.itemSize);
        const endItemIndex = startItemIndex + itemsInViewport;
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
