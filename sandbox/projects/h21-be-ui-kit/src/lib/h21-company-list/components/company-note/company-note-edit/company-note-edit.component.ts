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
import { COMPANY_NOTE_EDIT_DIALOG_DATA } from './company-note-edit.tokens';
import { CompanyNoteEditRef } from './company-note-edit-ref';

// interfaces
import { ICompanyNote } from '../../../interfaces/company-note.interface';

// animation
import { CompanyNoteEditAnimation } from '../../../../../animations/company-note-edit';

@Component({
  selector: 'h21-company-note-edit',
  templateUrl: './company-note-edit.component.html',
  animations: CompanyNoteEditAnimation,
})
export class CompanyNoteEditComponent implements AfterViewInit {

  public animationState: 'void' | 'enter' | 'leave' = 'enter';
  public animationStateChanged = new EventEmitter<AnimationEvent>();
  public actionInProgress = true;
  public entity: ICompanyNote = {};
  public form: FormGroup;
  public editable = true;
  public viewOnly: boolean;

  @ViewChild('container') private _container: ElementRef;

  constructor(public dialogRef: CompanyNoteEditRef,
              private _companyService: CompanyService,
              @Inject(COMPANY_NOTE_EDIT_DIALOG_DATA) public params: ICompanyNote,
  ) {
    this._buildForm();
    this.init();
    this.viewOnly = this.params.viewOnly;
    this.params.viewOnly && this.form.get('note').disable();
  }

  public ngAfterViewInit() {
    this._container.nativeElement.focus();
  }

  public init(): void {
    this._companyService
      .noteGetEntity(this.params.id)
      .subscribe({
        next: (e) => {
          this.entity = e;
          if (!this.params.id) {
            this.entity.companyId = this.params.companyId;
          }
          this.form.patchValue(this.entity);
          this.actionInProgress = false;
        },
      });
  }

  public onAnimation(event: AnimationEvent): void {
    this.animationStateChanged.emit(event);
  }

  public startExitAnimation(): void {
    this.animationState = 'leave';
  }

  public save(): void {
    this.form.updateValueAndValidity();
    Object.values(this.form.controls)
      .forEach((e) => e.markAsTouched());

    if (this.form.invalid || this.actionInProgress) {
      return;
    }

    this.actionInProgress = true;
    this._companyService.notePostEntity(this.form.value)
      .subscribe((entity) => {
        this.dialogRef.close(entity);
        this.actionInProgress = false;
      }, () => { this.actionInProgress = false; });
  }

  public close(): void {
    this.dialogRef.close();
  }

  private _buildForm(): void {
    this.form = new FormGroup({
      note: new FormControl(null, Validators.required),
      companyId: new FormControl(),
      createUserName: new FormControl(),
      id: new FormControl(),
    });
  }

}
