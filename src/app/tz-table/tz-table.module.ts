import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TzTableComponent} from './tz-table.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatTableModule} from '@angular/material/table';
import {ObserversModule} from '@angular/cdk/observers';
import {FlexModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ValueTransformerPipe } from './value-transformer/value-transformer.pipe';
import { TzTableCustomColumnComponent } from './tz-table-custom-column/tz-table-custom-column.component';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [TzTableComponent, ValueTransformerPipe, TzTableCustomColumnComponent],
  exports: [
    TzTableComponent,
    TzTableCustomColumnComponent,
    ValueTransformerPipe
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatTableModule,
    ObserversModule,
    FlexModule,
    MatProgressSpinnerModule,
    MatIconModule
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
