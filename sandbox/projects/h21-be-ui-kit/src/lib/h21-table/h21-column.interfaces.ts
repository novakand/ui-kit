export interface IH21Column {
  caption: string;
  name: string;
  required: boolean;
  default: boolean;
  displayed: boolean;
  isSystem?: boolean;
  header?: string;
  controls?: string[];
}

export interface IH21Order {
  field: string;
  desc?: boolean;
}
