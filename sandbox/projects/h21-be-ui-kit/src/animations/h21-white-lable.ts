import { animate, state, style, transition, trigger } from '@angular/animations';

export const WhiteLabelAnimation: any = [
  trigger('toggleSlide', [
    state('void', style({ transform: 'translateX(100%)' })),
    state('enter', style({ transform: 'translateX(0)' })),
    state('leave', style({ transform: 'translateX(100%)' })),
    transition('* => *', animate('120ms linear')),
  ]),
  trigger('toggleVisibility', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('120ms', style({ opacity: 1 })),
      ],
    ),
    transition(':leave', [
        style({ opacity: 1 }),
        animate('120ms', style({ opacity: 0 })),
      ],
    ),
  ]),
];
