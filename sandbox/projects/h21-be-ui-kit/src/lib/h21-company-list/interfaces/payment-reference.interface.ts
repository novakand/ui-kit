import { INamedEntity } from '../../../interfaces';

export interface IPaymentReference extends INamedEntity {
  companyPaymentMethodId?: number;
  cardReferenceId?: number;
  name?: string;
  value?: string;
  substituteParameterId?: number;
  substituteParameterName?: string;
  isOptional?: boolean;
  id?: number;
}
