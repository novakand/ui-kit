import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// services
import { SysadminVocabularyService } from '../../../../../services/sysadmin-vocabulary.service';
import { H21DefaultDialogService } from '../../../../dialogs/h21-default-dialog.service';
import { ReferencesService } from '../../../../../services/references.service';
import { CompanyService } from '../../../services/company.service';

// tokens & refs
import { COMPANY_ADDRESS_EDIT_DIALOG_DATA } from './company-address-edit.tokens';
import { CompanyAddressEditRef } from './company-address-edit-ref';

// interfaces
import { ICompanyAddress } from '../../../interfaces/company-address.interface';

// animation
import { CompanyAddressEditAnimation } from '../../../../../animations/company-address-edit';

@Component({
  selector: 'h21-company-address-edit',
  templateUrl: './company-address-edit.component.html',
  animations: CompanyAddressEditAnimation,
})
export class CompanyAddressEditComponent implements OnDestroy, AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public actionInProgress = true;
  public entity: ICompanyAddress = {};
  public entityForm: FormGroup;
  public editable = false;
  public countries: any[];
  public cities: any[];

  @ViewChild('container') private _container: ElementRef;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private _references: ReferencesService,
              private _companyService: CompanyService,
              public dialogRef: CompanyAddressEditRef,
              public vocabulary: SysadminVocabularyService,
              @Inject(COMPANY_ADDRESS_EDIT_DIALOG_DATA) public params: ICompanyAddress,
  ) {
    this.editable = !this.params.devIsReadonly;
    this.entityToForm();
    this.init();

    this._references.getCountriesByOrder([{ field: 'name', desc: false }])
      .pipe(takeUntil(this.destroy$))
      .subscribe((e) => this.countries = e);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public trackByFn(index) {
    return index;
  }

  public init(): void {
    this._companyService.addressGetEntity(this.params.id)
      .subscribe((e) => {
        this.entity = e;
        this.entityToForm();
        if (!this.params.id) {
          this.entity.companyId = this.params.companyId;
        } else {
          this.countrySelected();
        }
        this.actionInProgress = false;
      });
  }

  public entityToForm(): void {
    this.entityForm = new FormGroup({
      countryCode: new FormControl(this.entity.countryCode, Validators.required),
      cityCode: new FormControl(this.entity.cityCode),
      address: new FormControl(this.entity.address, Validators.required),
      typeId: new FormControl(this.entity.typeId, Validators.required),
      zip: new FormControl(this.entity.zip, Validators.required),
      id: new FormControl(this.entity.id),
    });
  }

  public onAnimationStart(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public onAnimationDone(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public save(): void {
    this.entityForm.updateValueAndValidity();
    Object.values(this.entityForm.controls)
      .forEach((e) => e.markAsTouched());

    if (this.entityForm.invalid) {
      return;
    }

    if (this.actionInProgress) {
      return;
    }

    this.actionInProgress = true;
    this._companyService.addressPostEntity({ ...this.entityForm.value, ...{ companyId: this.entity.companyId } })
      .subscribe({
        next: (entity) => {
          this.dialogRef.close(entity);
          this.actionInProgress = false;
        },
        error: () => {
          this.actionInProgress = false;
        },
      });
  }

  public countrySelected(): void {
    const country = this.entityForm.controls.countryCode;
    const city = this.entityForm.controls.cityCode;

    if (!country.value) {
      city.setValue(null);
      this.cities = [];
    } else {
      this._references.getCountryCities(country.value)
        .subscribe({
          next: (e) => {
            this.cities = e.sort((n1, n2) => n1.name > n2.name ? 1 : -1);
            const cityIndex = this.cities.findIndex((item) => {
              return city.value === item.code;
            });
            if (!city || cityIndex === -1) {
              city.setValue(null);
              city.markAsUntouched();
            }
          },
        });
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

}
