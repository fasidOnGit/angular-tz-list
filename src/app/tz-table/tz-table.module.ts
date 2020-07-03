import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TzTableComponent} from './tz-table.component';


@NgModule({
  declarations: [TzTableComponent],
  exports: [
    TzTableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TzTableModule {
}
