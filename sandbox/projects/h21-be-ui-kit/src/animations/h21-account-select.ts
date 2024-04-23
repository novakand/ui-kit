import { animate, state, style, transition, trigger } from '@angular/animations';

export const AccountSelectAnimation: any = [
  trigger('toggleVisibility', [
    state('void', style({ transform: 'translateX(800px)' })),
    state('enter', style({ transform: 'translateX(0)' })),
    state('leave', style({ transform: 'translateX(800px)' })),
    transition('* => *', animate('120ms')),
  ]),
];
