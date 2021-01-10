import { of, interval, concat, Subject, merge, empty } from "rxjs";
import {
    scan,
    startWith,
    share,
    filter,
    mapTo,
    switchMap
} from "rxjs/operators";
import stopWatchCore from './stopWatchCore';
import constants from './constants';


export const actions$ = new Subject();
const start$ = actions$.pipe(
    filter((action) => action === constants.START),
    mapTo(constants.START)
);
const wait$ = actions$.pipe(
    filter((action) => action === constants.WAIT),
    mapTo(constants.WAIT)
);

const stop$ = actions$.pipe(
    filter((action) => action === constants.STOP),
    mapTo(constants.STOP)
);

const reset$ = actions$.pipe(
    filter((action) => action === constants.RESET),
    mapTo(constants.RESET)
);

const interval$ = interval(10).pipe(mapTo(1));

const COUNTDOWN_INIT_VALUE = { hr: 0, min: 0, sec: 0, ms: 0 };
export const stopwatch$ = merge(start$, wait$, stop$, reset$)
    .pipe(
        startWith(constants.INIT),
        switchMap((val) => {
            if (val === constants.WAIT) {
                return empty();
            } else if (val === constants.START) {
                return interval$;
            } else if (val === constants.INIT || val === constants.STOP) {
                return of(false);
            } else if (val === constants.RESET) {
                return concat(of(false), interval$);
            }
        }),
        scan(
            (acc, curr) => {
                if (!curr) {
                    return { hr: 0, min: 0, sec: 0, ms: 0 };
                };
                return { ...stopWatchCore(acc) };
            },
            COUNTDOWN_INIT_VALUE
        ))
    .pipe(share());