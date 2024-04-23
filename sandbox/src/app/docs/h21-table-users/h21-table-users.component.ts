import { Component } from '@angular/core';

const ELEMENT_DATA: ITableUsers[] = [
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
  {
    avatar: 'https://pbs.twimg.com/profile_images/669103856106668033/UF3cgUk4_400x400.jpg',
    name: 'Jeff Bezos', email: 'bezos@amazon.com', create: '25.07.18', change: '25.07.18', status: 'Active' },
];

@Component({
  selector: 'h21-table-users',
  templateUrl: './h21-table-users.component.html',
  styleUrls: ['./h21-table-users.component.scss'],
})
export class H21TableUsersComponent {

  public displayedColumns: string[] = ['avatar', 'name', 'create', 'change', 'status', 'action'];
  public dataSource = ELEMENT_DATA;

}

export interface ITableUsers {
  avatar: string;
  name: string;
  email: string;
  create: string;
  change: string;
  status: string;
}
