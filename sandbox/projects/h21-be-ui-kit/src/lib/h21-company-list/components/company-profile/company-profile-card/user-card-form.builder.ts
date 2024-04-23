import { FormControl, FormGroup, Validators } from '@angular/forms';

// services
import { Utils } from '../../../../../services/utils';

// enums
import { Patterns } from './patterns.enum';

// interfaces
import { ICompanyProfile } from '../../../interfaces';

export class CompanyProfileFormBuilder {

  public static build(entity: ICompanyProfile, editable: boolean): FormGroup {
    return new FormGroup({
      email: new FormControl(entity.email, [Validators.pattern(Utils.emailRegexp)]),
      invoiceEmail: new FormControl(entity.invoiceEmail, [Validators.pattern(Utils.emailRegexp)]),
      voucherEmail: new FormControl(entity.voucherEmail, [Validators.pattern(Utils.emailRegexp)]),
      name: new FormControl(entity.name, Validators.required),
      shortName: new FormControl(entity.shortName, Validators.required),
      description: new FormControl(entity.description),
      phone: new FormControl(entity.phone, Validators.pattern(Utils.phoneRegexp)),
      fax: new FormControl(entity.fax),
      homePage: new FormControl(entity.homePage),
      vatNumber: new FormControl(entity.vatNumber, Validators.pattern(new RegExp(Patterns.vatNumber))),
      registerNumber: new FormControl(entity.registerNumber, [
        Validators.required,
        Validators.pattern(new RegExp(Patterns.registerNumber)),
      ]),
      inn: new FormControl(entity.inn, [
        Validators.required,
        Validators.pattern(new RegExp(Patterns.inn)),
      ]),
      kpp: new FormControl(entity.kpp, [
        Validators.required,
        Validators.pattern(new RegExp(Patterns.kpp)),
      ]),
      ogrn: new FormControl(entity.ogrn, [
        Validators.required,
        Validators.pattern(new RegExp(Patterns.ogrn)),
      ]),
      iataTids: new FormControl(entity.iataTids),
      licenseNumber: new FormControl(entity.licenseNumber, Validators.required),
      typeId: new FormControl({ value: entity.typeId, disabled: !editable }, Validators.required),
      parent: new FormControl({ value: entity.parent, disabled: !editable }),
      countryCode: new FormControl({ value: entity.countryCode, disabled: !editable }, Validators.required),
    });
  }

}
