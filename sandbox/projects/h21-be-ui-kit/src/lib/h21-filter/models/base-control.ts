import { PickerControl } from './picker-control';

export class BaseControl {

  public value: unknown;
  public key: string;
  public label: string;
  public required: boolean;
  public controlType: string;
  public multiple: boolean;
  public selectValue: string;
  public list: unknown[] = [];
  public range: {
    title: string;
    pickers: PickerControl[];
  };

  constructor(options?: Partial<BaseControl>) {
    Object.assign(this, options);
  }

}
