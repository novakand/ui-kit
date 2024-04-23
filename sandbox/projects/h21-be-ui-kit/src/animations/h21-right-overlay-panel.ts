import { animate, state, style, transition, trigger } from '@angular/animations';

export const RightOverlayPanelAnimation: any = [
  trigger('toggleVisibility', [
    state('void', style({ transform: 'translateX(550px)' })),
    state('enter', style({ transform: 'translateX(0)' })),
    state('leave', style({ transform: 'translateX(550px)' })),
    transition('* => *', animate('120ms')),
  ]),
];
