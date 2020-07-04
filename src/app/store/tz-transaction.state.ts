import {ITzTransacton} from '../app.component';

export default class TzTransactionState {
  allData: ITzTransacton[];
  visibleData: ITzTransacton[];
}

export const initializeState = (): TzTransactionState => {
  return { allData: [], visibleData: []};
};
