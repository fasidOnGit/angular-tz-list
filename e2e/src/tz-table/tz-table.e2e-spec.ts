import {browser, logging} from 'protractor';
import {TzTablePo} from './tz-table.po';

describe('TzTable', () => {
  let page: TzTablePo;

  beforeEach(() => {
    page = new TzTablePo();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Recent Transactions');
  });
  it('should load 10 rows on load', async () => {
    page.navigateTo();
    browser.sleep(2000);
    expect(page.getRowCount()).toEqual(10);
  });

  it('should display table column headers', async () => {
    page.navigateTo();
    const column = ['Type', 'Amount XTZ (USD)', 'Date', 'Address'];
    for (let i = 0; i < column.length; i++) {
       expect(await page.getColumnHeader().get(i).getText()).toEqual(column[i]);
     }
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    console.log(logs);
    expect(logs).not.toEqual(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
