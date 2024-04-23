import { MatDialogConfig } from '@angular/material/dialog/typings/dialog-config';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Injectable, TemplateRef } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

// components
import { H21ConfirmDialogComponent } from './h21-confirm-dialog/h21-confirm-dialog.component';
import { H21MessageDialogComponent } from './h21-message-dialog/h21-message-dialog.component';
import { H21AlertDialogComponent } from './h21-alert-dialog/h21-alert-dialog.component';
import { H21ErrorDialogComponent } from './h21-error-dialog/h21-error-dialog.component';

// types
import { AlertType } from './enums/alert-type';
import { IconType } from './enums/icon-type';

@Injectable()
export class H21DefaultDialogService {

  constructor(private dialog: MatDialog) { }

  public error(title: string, content: string): MatDialogRef<H21ErrorDialogComponent> {
    return this.customDefaultDialog(H21ErrorDialogComponent, { title, content });
  }

  public message(title: string, content: string, iconType: IconType = null): MatDialogRef<H21MessageDialogComponent> {
    return this.customDefaultDialog(H21MessageDialogComponent, { title, content, iconType });
  }

  public alert(content: string, closeText: string, alertType: AlertType): MatDialogRef<H21AlertDialogComponent> {
    return this.customAlertDialog(H21AlertDialogComponent, { content, closeText, alertType });
  }

  public confirm(title: string, content: string): MatDialogRef<H21ConfirmDialogComponent> {
    return this.customDefaultDialog(H21ConfirmDialogComponent, { title, content });
  }

  public customDialog<T, D = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: MatDialogConfig<D>): MatDialogRef<T> {
    return this.dialog.open(componentOrTemplateRef, config);
  }

  public customDefaultDialog<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: object): MatDialogRef<T> {
    return this.dialog.open(componentOrTemplateRef, this._getDefaultParams(config));
  }

  public customAlertDialog<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: object): MatDialogRef<T> {
    return this.dialog.open(componentOrTemplateRef, this._getAlertDialogParams(config));
  }

  private _getDefaultParams<T = object>(data: T): MatDialogConfig<T> {
    return {
      data,
      disableClose: true,
      minWidth: '400px',
      maxWidth: '600px',
      backdropClass: 'h21-message-dialog_backdrop',
      panelClass: 'h21-message-dialog_panel',
      position: {
        top: '60px',
      },
    };
  }

  private _getAlertDialogParams<T = object>(data: T): MatDialogConfig<T> {
    return {
      data,
      disableClose: true,
      minWidth: '200px',
      maxWidth: '300px',
      hasBackdrop: false,
      panelClass: 'h21-alert-dialog_panel',
      position: {
        bottom: '20px',
        left: '20px',
      },
    };
  }

}
