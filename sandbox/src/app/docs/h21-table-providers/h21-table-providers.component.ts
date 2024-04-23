import { Component } from '@angular/core';

const ELEMENT_DATA: ITableProviders[] = [
  { name: 'Travelport', type: 'GDS', createdby: 'John Doe', change: '07.25.18', status: 'Active' },
  { name: 'Travelport Profiles', type: 'Profiles', createdby: 'Jane Doe', change: '07.25.18', status: 'Active' },
  { name: 'Holiday Taxis', type: 'Transfer', createdby: 'James Doe', change: '08.25.18', status: 'Active' },
];

@Component({
  selector: 'h21-table-providers',
  templateUrl: './h21-table-providers.component.html',
  styleUrls: ['./h21-table-providers.component.scss'],
})
export class H21TableProvidersComponent {

  public displayedColumns: string[] = ['name', 'type', 'createdby', 'change', 'status', 'action'];
  public dataSource = ELEMENT_DATA;

}

export interface ITableProviders {
  name: string;
  type: string;
  createdby: string;
  change: string;
  status: string;
}
