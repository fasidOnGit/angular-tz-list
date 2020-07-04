import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TzTableModule} from './tz-table/tz-table.module';
import {MatCardModule} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {TzTransactionService} from './tz-transaction.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TzTableModule,
    MatCardModule,
    HttpClientModule,
    FlexModule
  ],
  providers: [
    TzTransactionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
