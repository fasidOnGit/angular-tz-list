/**
 * Table column model.
 */
export interface ITzTableColumn {
  title: string;
  label: string;
  property: string;
  templateRef?: string;
  flexWidth?: number;
  valueTransformer?: (value: any, property: string) => any;
}
