import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TzTableModule} from './tz-table/tz-table.module';
import {MatCardModule} from '@angular/material/card';
import {FlexModule} from '@angular/flex-layout';
import {TzTransactionService} from './tz-transaction.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {StorageModule} from './store/storage.module';
import {HttpMockRequestInterceptor} from './mock/http-mock-request.interceptor';
import {environment} from '../environments/environment';
const interceptors = [];
if (environment.mock) {
  interceptors.push({
    provide: HTTP_INTERCEPTORS,
      useClass: HttpMockRequestInterceptor,
    multi: true
  });
}
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
    FlexModule,
    StorageModule
  ],
  providers: [
    TzTransactionService,
    ...interceptors
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
