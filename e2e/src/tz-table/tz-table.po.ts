import {browser, by, element, ElementArrayFinder} from 'protractor';

export class TzTablePo {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-tz-table .table-heading span')).getText() as Promise<string>;
  }

  getColumnHeader(): ElementArrayFinder {
    return element.all(by.css('app-tz-table .table-header span'));
  }
  getRowCount(): Promise<number> {
    return element.all(by.css('app-tz-table mat-table mat-row')).count() as Promise<number>;
  }
}
