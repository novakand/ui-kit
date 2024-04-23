import { Inject, Injectable } from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';

// enum
import { Application } from '../../../enums/application.enum';
import { Patterns } from '../components/company-profile/company-profile-card/patterns.enum';

// models
import { ControlValidator } from '../models/control-validator.model';

// interfaces
import { ICoreEnvironment } from '../../../interfaces/core-environment.interface';

import { CORE_ENVIRONMENT } from '../core-environment.token';

@Injectable()
export class CompanyProfileCardFormValidatorService {

  private _validateControllKeys = {
    inn: 'inn',
    kpp: 'kpp',
    ogrn: 'ogrn',
    licenseNumber: 'licenseNumber',
    registerNumber: 'registerNumber',
    vatNumber: 'vatNumber',
  };

  constructor(@Inject(CORE_ENVIRONMENT) public core: ICoreEnvironment) { }

  /**
   * Обнавляем валидацию контроллов
   * @param isRussia Выбрана страна Россия
   * @param isChina Выбрана страна Китай
   * @param isOtherCountry Выбрана страна, отличная от России и Китая
   * @param clearIfChanged Была ли смена страны
   * @param controls Контроллы для валидации
   */
  public updateValidation(isRussia: boolean,
    isChina: boolean,
    isOtherCountry: boolean,
    clearIfChanged: boolean,
    controls: { [key: string]: AbstractControl }): void {
    const isOtherOffice: boolean = isOtherCountry
      && [Application.ADMIN_OFFICE, Application.BACK_OFFICE].includes(this.core.application);
    Object.keys(this._validateControllKeys).forEach((key: string) => {
      let setValidator = false;

      switch (key) {
        case this._validateControllKeys.inn:
        case this._validateControllKeys.kpp:
        case this._validateControllKeys.ogrn:
          setValidator = isRussia;
          break;
        case this._validateControllKeys.licenseNumber:
          setValidator = isChina;
          break;
        case this._validateControllKeys.registerNumber:
        case this._validateControllKeys.vatNumber:
          setValidator = isOtherOffice;
          break;
      }

      const controlValidator = new ControlValidator(controls[key], Patterns[key], setValidator, clearIfChanged);
      this._updateControlValidation(controlValidator);
    });
  }

  /**
   * Устанавливаем валидацию для контролла
   * @param obj объект информации о валидации
   */
  private _updateControlValidation(obj: ControlValidator): void {
    obj.control.clearValidators();
    if (obj.setValidator) {
      obj.control.setValidators([Validators.required, Validators.pattern(obj.pattern)]);
    } else {
      obj.pattern && obj.control.setValidators([Validators.pattern(obj.pattern)]);
      obj.clearIfChanged && obj.control.setValue(null);
    }
    obj.control.updateValueAndValidity();
  }

}
