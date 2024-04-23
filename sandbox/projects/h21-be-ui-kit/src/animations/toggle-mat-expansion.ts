import { animate, state, style, transition, trigger } from '@angular/animations';

import { AnimationState } from '../enums/animation-state';

export const ToggleMatExpansionAnimation: any =
    trigger('toggleMatExpansion', [
        state(`${AnimationState.COLLAPSED}, ${AnimationState.VOID}`,
            style({
                height: '0px',
                overflow: 'hidden',
                visibility: 'hidden',
                opacity: 0,
            })),
        state(AnimationState.EXPANDED,
            style({
                height: '*',
                overflow: 'hidden',
                visibility: 'visible',
                opacity: 1,
            })),
        transition('expanded <=> collapsed',
            animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]);
