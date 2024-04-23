export interface IValidationRule {
  rule: string;
  message: string;
  predicate(): boolean;
}
