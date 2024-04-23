import { animate, state, style, transition, trigger } from '@angular/animations';

export const CompanyAddressEditAnimation: any = [
  trigger('toggleSlide', [
    state('void', style({ transform: 'translateX(100%)' })),
    state('enter', style({ transform: 'translateX(0)' })),
    state('leave', style({ transform: 'translateX(100%)' })),
    transition('* => *', animate('120ms linear')),
  ]),
];
