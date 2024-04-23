import { animate, group, state, style, transition, trigger } from '@angular/animations';

export const CompanyProfileCardAnimation: any = [
  trigger('slideUpDown', [
    state('up', style({ 'max-height': '1000px', opacity: '1', visibility: 'visible' })),
    state('down', style({ 'max-height': '0px', opacity: '0', visibility: 'hidden' })),
    transition('up => down', [group([
        animate('150ms ease-in-out', style({
          opacity: '0',
        })),
        animate('200ms ease-in-out', style({
          'max-height': '0px',
        })),
        animate('350ms ease-in-out', style({
          visibility: 'hidden',
        })),
      ],
    )]),
    transition('down => up', [group([
        animate('1ms ease-in-out', style({
          visibility: 'visible',
        })),
        animate('200ms ease-in-out', style({
          'max-height': '1000px',
        })),
        animate('400ms ease-in-out', style({
          opacity: '1',
        })),
      ],
    )]),
  ]),
];
