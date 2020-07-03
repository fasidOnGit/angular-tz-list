import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TzTableComponent} from './tz-table.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTableModule} from '@angular/material/table';
import {ObserversModule} from '@angular/cdk/observers';


@NgModule({
  declarations: [TzTableComponent],
  exports: [
    TzTableComponent
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatTableModule,
    ObserversModule
  ]
})
export class TzTableModule {
}
