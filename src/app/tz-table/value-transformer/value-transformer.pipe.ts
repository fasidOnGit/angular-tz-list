import { Pipe, PipeTransform } from '@angular/core';
import {ITzTableColumn} from '../tz-table-column.interface';

/**
 * Value transformer for TzTableComponent.
 * Allows the user to specify a valueTransformer callback as part of column definition.
 * @author Kader Fasid (kader.fasid@gmail.com)
 */
@Pipe({
  name: 'valueTransformer'
})
export class ValueTransformerPipe implements PipeTransform {

  /**
   * PipeTransform.
   */
  public transform(value: any, column: ITzTableColumn): any {
    let tranformed: any = value;
    if (column && column.property && column.valueTransformer) {
      tranformed = column.valueTransformer(value, column.property);
    }
    return tranformed;
  }

}
