import { animate, state, style, transition, trigger } from '@angular/animations';

export const ToggleYScaleAnimation: any =
  trigger('toggleYScale', [
    state('void', style({ opacity: 0, transform: 'scaleY(0)' })),
    state('enter', style({ opacity: 1, transform: 'none' })),
    state('leave', style({ opacity: 0, transform: 'scaleY(0)' })),
    transition('* => *', animate('120ms linear')),
  ]);
