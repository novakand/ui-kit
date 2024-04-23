export interface IColumn {
  caption: string;
  name: string;
  required?: boolean;
  default?: boolean;
  displayed?: boolean;
  isSystem?: boolean;
  header?: string;
  controls?: string[];
}
