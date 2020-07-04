import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {TzTransactionReducer} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {TzTransactionEffects} from './effects';

/**
 * Store.
 * @author Kader Fasid (kader.fasid@gmail.com)
 */
@NgModule({
  imports: [
    StoreModule.forRoot({transaction: TzTransactionReducer}),
    EffectsModule.forRoot([TzTransactionEffects])
  ]
})
export class StorageModule {
}
