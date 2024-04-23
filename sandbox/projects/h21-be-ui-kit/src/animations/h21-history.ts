import { animate, state, style, transition, trigger } from '@angular/animations';

export const HistoryExpandDetailAnimation: any = [
  trigger('detailExpand', [
    state('void', style({ height: '0px', minHeight: '0', display: 'none' })),
    state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
    state('expanded', style({ height: '*' })),
    transition('* => *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    transition('void => *', animate('0ms')),
  ]),
];

export const HistoryExpandProgressVisibilityAniamtion: any = [
  trigger('progressVisibility', [
    state('void', style({ opacity: 0 })),
    state('enter', style({ opacity: 1 })),
    state('leave', style({ opacity: 0 })),
    transition('* => *', animate('125ms')),
  ]),
];
