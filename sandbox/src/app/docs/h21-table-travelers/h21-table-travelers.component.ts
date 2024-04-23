import { Component } from '@angular/core';

const ELEMENT_DATA: ITableTravelers[] = [
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', agency: 'Raptim', agent: 'Jane Doe', branch: 'Raptim office Denmark', status: 'Active' },
];

@Component({
  selector: 'h21-table-travelers',
  templateUrl: './h21-table-travelers.component.html',
  styleUrls: ['./h21-table-travelers.component.scss'],
})
export class H21TableTravelersComponent {

  public displayedColumns: string[] = ['avatar', 'name', 'agency', 'branch', 'agent', 'status', 'action'];
  public dataSource = ELEMENT_DATA;

}

export interface ITableTravelers {
  avatar: string;
  name: string;
  agency: string;
  branch: string;
  agent: string;
  status: string;
}

