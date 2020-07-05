import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {TzTransactionReducer} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {TzTableEffects} from './effects';

/**
 * Store.
 * @author Kader Fasid (kader.fasid@gmail.com)
 */
@NgModule({
  imports: [
    StoreModule.forRoot({transaction: TzTransactionReducer}),
    EffectsModule.forRoot([TzTableEffects])
  ]
})
export class StorageModule {
}
