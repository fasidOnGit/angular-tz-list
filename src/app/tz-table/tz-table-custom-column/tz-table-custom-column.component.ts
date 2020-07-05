import {Component, ContentChild, Input, TemplateRef} from '@angular/core';

/**
 * A simp[le custom column component.
 * to be used to add custom content in TzTable
 * @author Kader Fasid (fasidmpm@gmail.com)
 */
@Component({
  selector: 'app-tz-table-custom-column',
  template: '',
})
export class TzTableCustomColumnComponent {
  /**
   * The title of the custom column.
   */
  @Input() public title!: string;
  /**
   * An arbitrary template, rendered in the column.
   */
  @ContentChild(TemplateRef, {static: true}) public template!: TemplateRef<any>;
}
