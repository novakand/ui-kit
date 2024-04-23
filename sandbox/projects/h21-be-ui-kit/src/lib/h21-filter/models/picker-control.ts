export class PickerControl {

  public value: unknown;
  public key: string;
  public label: string;
  public required: boolean;
  public controlType: string;
  public selectValue: string;

  constructor(options?: Partial<PickerControl>) {
    Object.assign(this, options);
  }

}
