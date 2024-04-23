import { Component } from '@angular/core';

const ELEMENT_DATA: ITableAgents[] = [
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
  { name: 'John Smith', agency: 'BCD Travel', createdby: 'John Doe', change: '07.25.2018', status: 'Active' },
];

@Component({
  selector: 'h21-table-agents',
  templateUrl: './h21-table-agents.component.html',
  styleUrls: ['./h21-table-agents.component.scss'],
})
export class H21TableAgentsComponent {

  public displayedColumns: string[] = ['name', 'agency', 'createdby', 'change', 'status', 'action'];
  public dataSource = ELEMENT_DATA;

}

export interface ITableAgents {
  name: string;
  agency: string;
  createdby: string;
  change: string;
  status: string;
}
