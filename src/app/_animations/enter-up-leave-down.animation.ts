import { transition, trigger, style, animate } from '@angular/animations';

export const enterUpLeaveDownAnimation =
    trigger('enterUpLeaveDownAnimation', [
        transition(':enter', [
            style({ opacity: 0, transform: 'translateY(100%)' }),
            animate('.2s ease-in', style({ opacity: 1, transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            animate('.2s ease-out', style({ opacity: 0, transform: 'translateY(100%)' }))
        ])
    ]);
