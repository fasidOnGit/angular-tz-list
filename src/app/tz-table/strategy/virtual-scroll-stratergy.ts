import {CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy} from '@angular/cdk/scrolling';
import {Injectable} from '@angular/core';
/**
 * The row height in the data grid.
 */
const ROW_HEIGHT = 50;

/**
 * Min buffer height in pixels for the data grid.
 */
const MIN_BUFFER_PX = 1000;

/**
 * Max buffer height in pixels for the data grid.
 */
const MAX_BUFFER_PX = 2000;

/**
 * Virtual Scroll Strategy.
 */
@Injectable()
export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(ROW_HEIGHT, MIN_BUFFER_PX, MAX_BUFFER_PX);
  }

  /**
   * Attaches this scroll strategy to a viewport.
   * @param viewport The viewport to attach this strategy to.
   */
  public attach(viewport: CdkVirtualScrollViewport): void {
    this.onDataLengthChanged();
  }
}
