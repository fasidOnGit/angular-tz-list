/**
 * Table column model.
 */
export interface ITzTableColumn {
  title: string;
  label: string;
  property: string;
  templateRef?: string;
  valueTransformer?: (value: any, property: string) => any;
}
