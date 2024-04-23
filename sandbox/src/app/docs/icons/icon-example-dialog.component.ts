import { MAT_DIALOG_DATA, MatDialogRef, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/prism';

declare var Prism;

@Component({
  selector: 'h21-icon-example-dialog',
  templateUrl: './icon-example-dialog.component.html',
})
export class IconExampleDialogComponent implements OnInit {

  public title: String;
  public iconName: String;
  public confSize: String = '';
  public confColor: String = '';
  public confCodeSample: String = '';

  public isCustomIcon = false;
  public includeInButton = false;

  constructor(public sanitizer: DomSanitizer,
              public iconReg: MatIconRegistry,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<IconExampleDialogComponent>,
  ) {

    this.iconName = data.iconName;
    this.isCustomIcon = data.isCustomIcon;

    this.iconReg.addSvgIcon('h21_flight_land_blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-blue-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_land_green',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-green-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_land_red',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-land-red-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-blue-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_green',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-green-icon.svg'));
    this.iconReg.addSvgIcon('h21_flight_takeoff_red',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-flight-takeoff-red-icon.svg'));

    this.iconReg.addSvgIcon('h21_baggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-baggage-blue.svg'));
    this.iconReg.addSvgIcon('h21_no_baggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-baggage-gray.svg'));
    this.iconReg.addSvgIcon('h21_luggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-luggage-blue.svg'));
    this.iconReg.addSvgIcon('h21_no_luggage',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-no-luggage-gray.svg'));
    this.iconReg.addSvgIcon('h21_night',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-night-blue.svg'));
    this.iconReg.addSvgIcon('h21_back_to_list',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/h21-back-to-list-gray.svg'));
  }

  public ngOnInit() {
    this.updateCodeSample();
  }

  public updateCodeSample() {
    this.confCodeSample = this.highlightCode(this.getCodeSample());
  }

  public getCodeSample(): String {
    return this.includeInButton ?
    `<button mat-icon-button${this.confColor && !this.isCustomIcon ? ` color="${this.confColor}"` :
      ''}${this.confSize ? ` class="${this.confSize}"` : ''}>\n<mat-icon${this.isCustomIcon ? ` svgIcon="${this.iconName}"` :
      ''}>${!this.isCustomIcon ? this.iconName : ''}</mat-icon>
    \n</button>` :
    `<mat-icon${this.confColor && !this.isCustomIcon ? ` color="${this.confColor}"` : ''}${this.confSize ?
      ` class="${this.confSize}"` : ''}${this.isCustomIcon ? ` svgIcon="${this.iconName}"` : ''}>${!this.isCustomIcon ? this.iconName : ''}
    </mat-icon>`;
  }

  public highlightCode(code: String): String {
    return Prism.highlight(code, Prism.languages.html);
  }

  public close() {
    this.dialogRef.close();
  }

}

