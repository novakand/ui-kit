export enum Patterns {
  'inn' = '^([0-9]{10})$',
  'kpp' = '^([0-9]{9})$',
  'ogrn' = '^([0-9]{13}|[0-9]{15})$',
  'registerNumber' = '^([a-zA-Z0-9]+ ?_?[a-zA-Z0-9]+)*$',
  'vatNumber' = '^([a-zA-Z0-9]+ ?_?[a-zA-Z0-9]+)*$',
}
