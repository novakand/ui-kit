import { IValidationRule } from '../interfaces/validation-rule.interface';

export class H21Validator {

  private rules: IValidationRule[] = [];

  public register(rule: string, predicate: () => boolean, message): void {
    this.rules.push({
      rule: rule,
      predicate: predicate,
      message: message,
    });
  }

  public invalid(rule: string): string {

    const result = this.rules.find((e) => e.rule === rule && !e.predicate());

    if (!result) {
      return '';
    }

    return result.message;
  }

  public getAllErrors(): string[] {
    return this.rules.filter((e) => !e.predicate()).map((e) => e.message);
  }

}
