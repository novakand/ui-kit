import { MatDialog } from '@angular/material';
import { Component } from '@angular/core';

import { IconExampleDialogComponent } from './icon-example-dialog.component';

@Component({
  selector: 'h21-icons-docs',
  templateUrl: './icons-docs.component.html',
})
export class IconsDocsComponent {

  public allH21Icons = [
    'h21_flight_land_blue',
    'h21_flight_land_green',
    'h21_flight_land_red',
    'h21_flight_takeoff_blue',
    'h21_flight_takeoff_green',
    'h21_flight_takeoff_red',
    'h21_baggage',
    'h21_no_baggage',
    'h21_luggage',
    'h21_no_luggage',
    'h21_night',
  ];

  public allMatIcons = [
    'attach_money',
    'cancel',
    'check_circle',
    'close',
    'flight_land',
    'flight_takeoff',
    'history',
    'info',
    'menu',
    'person',
    'search',
    'supervisor_account',
    'swap_horiz',
    'today',
  ];

  public title = 'Icons';
  public matIcons = this.allMatIcons;
  public h21Icons = this.allH21Icons;

  constructor(public dialog: MatDialog) { }

  public openDialog(iconName: String, isCustomIcon: boolean): void {
    this.dialog.open(IconExampleDialogComponent, {
      width: '800px',
      data: { iconName: iconName, isCustomIcon: isCustomIcon },
    });
  }

  public trackByFn(index) {
    return index;
  }

}
