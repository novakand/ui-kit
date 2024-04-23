import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  ViewChild
} from '@angular/core';

// services
import { CompanyService } from '../../../services/company.service';

// tokens & refs
import { COMPANY_CONTACT_DIALOG_DATA } from './company-contact-edit.tokens';
import { CompanyContactEditRef } from './company-contact-edit-ref';

// interfaces
import { ICompanyContact } from '../../../interfaces';

// animation
import { CompanyContactEditAnimation } from '../../../../../animations/company-contact-edit';
import { Utils } from '../../../../../services';

@Component({
  selector: 'h21-company-contact-edit',
  templateUrl: './company-contact-edit.component.html',
  animations: CompanyContactEditAnimation,
})
export class CompanyContactEditComponent implements AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public actionInProgress = true;
  public entity: ICompanyContact = {};
  public entityForm: FormGroup;
  public editable = true;

  @ViewChild('container') private _container: ElementRef;

  constructor(public dialogRef: CompanyContactEditRef,
              private _companyService: CompanyService,
              @Inject(COMPANY_CONTACT_DIALOG_DATA) public params: ICompanyContact,
  ) {
    this.entityToForm();
    this.init();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public init(): void {
    this._companyService
      .contactGetEntity(this.params.id)
      .subscribe((e) => {
        this.entity = e;
        if (!this.params.id) {
          this.entity.companyId = this.params.companyId;
        }
        this.entityToForm();
        this.actionInProgress = false;
      });
  }

  public entityToForm(): void {
    this.entityForm = new FormGroup({
      email: new FormControl(this.entity.email, [Validators.pattern(Utils.emailRegexp)]),
      firstName: new FormControl(this.entity.firstName, Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])),
      lastName: new FormControl(this.entity.lastName, Validators.compose([Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)])),
      phone: new FormControl(this.entity.phone, Validators.pattern(Utils.phoneRegexp)),
      position: new FormControl(this.entity.position),
    });
  }

  public formToEntity() {
    Object.keys(this.entityForm.controls).forEach((key) => {
      this.entity[key] = this.entityForm.controls[key].value;
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

    this.formToEntity();
    this._companyService.contactPostEntity(this.entity)
      .subscribe((entity) => {
        this.dialogRef.close(entity);
        this.actionInProgress = false;
      }, () => {
        this.actionInProgress = false;
      });
  }

  public close(): void {
    this.dialogRef.close();
  }

}
