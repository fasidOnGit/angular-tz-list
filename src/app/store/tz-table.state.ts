import {IViewportChange} from '../tz-table/strategy/data-source-query';

export default class TzTableState<T = any> {
  allData: T[];
  visibleData: T[];
  recentChunk: {
    dataChunk: T[], viewportChange: IViewportChange
  };
  error?: Error;
  itemSize: number;
}

export const initializeState = (): TzTableState => {
  return {
    allData: [],
    visibleData: [],
    recentChunk: {
      dataChunk: [],
      viewportChange: {} as IViewportChange
    },
    error: undefined,
    itemSize: 50
  };
};
