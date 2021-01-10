import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { of, interval, concat, Subject, merge, empty } from "rxjs";
import {
    scan,
    startWith,
    share,
    filter,
    mapTo,
    switchMap
} from "rxjs/operators";
import "./styles.css";
import constants from './constants';

const actions$ = new Subject();
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

const interval$ = interval(1000);

const COUNTDOWN_INIT_VALUE = { sec: 0, min: 0 };
const stopwatch$ = merge(start$, wait$, stop$, reset$)
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
                    return { sec: 0, min: 0 };
                };

                if (acc.sec === 9) {
                    return { sec: 0, min: ++acc.min };
                } else {
                    return { ...acc, sec: ++acc.sec };
                };
            },
            COUNTDOWN_INIT_VALUE
        )
    )
    .pipe(share());

function App() {
    const [stopwatchState, setStopwatchState] = useState();
    useEffect(() => {
        const stopwatchSub = stopwatch$.subscribe(setStopwatchState);
        return () => {
            stopwatchSub.unsubscribe();
        };
    }, []);

    let clickedOnce = false;
    function onWaitClick() {
        if (clickedOnce) {
            actions$.next(constants.WAIT);
            clickedOnce = false;
        } else {
            clickedOnce = true;
            setTimeout(() => {
                clickedOnce = false;
            }, constants.DOUBLE_CLICK_TIMEOUT);
        }
    }

    return <>
        {/* //TODO make stopwatch format user friendly */}
        <div className="display">{JSON.stringify(stopwatchState)}</div>
        <button className="start" onClick={() => actions$.next(constants.START)}>
            Start
      </button>
        <button className="wait" onClick={onWaitClick}>
            Wait
      </button>
        <button className="stop" onClick={() => actions$.next(constants.STOP)}>
            Stop
      </button>
        <button className="stop" onClick={() => actions$.next(constants.RESET)}>
            Reset
      </button>
    </>
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);