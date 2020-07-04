import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TzTableComponent} from './tz-table.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTableModule} from '@angular/material/table';
import {ObserversModule} from '@angular/cdk/observers';
import {FlexModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [TzTableComponent],
  exports: [
    TzTableComponent
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatTableModule,
    ObserversModule,
    FlexModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: Window,
      useValue: window
    }
  ]
})
export class TzTableModule {
}
