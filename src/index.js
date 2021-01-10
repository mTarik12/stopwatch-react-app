import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import constants from './constants';
import { actions$, stopwatch$ } from './stopwatchObservable'

let clickedOnce = false;
const onWaitClick = () => {
    if (clickedOnce) {
        actions$.next(constants.WAIT);
        clickedOnce = false;
    } else {
        clickedOnce = true;
        setTimeout(() => {
            clickedOnce = false;
        }, constants.DOUBLE_CLICK_TIMEOUT);
    };
};

const getFormattedStopWatch = stopWatch => stopWatch ? {
    hr: stopWatch.hr >= 10 ? stopWatch.hr : '0' + stopWatch.hr,
    min: stopWatch.min >= 10 ? stopWatch.min : '0' + stopWatch.min,
    sec: stopWatch.sec >= 10 ? stopWatch.sec : '0' + stopWatch.sec,
    ms: stopWatch.ms >= 10 ? stopWatch.ms : '0' + stopWatch.ms,
} : {};

const App = () => {

    const [stopwatchState, setStopwatchState] = useState();
    useEffect(() => {
        const stopwatchSub = stopwatch$.subscribe(setStopwatchState);
        return () => {
            stopwatchSub.unsubscribe();
        };
    }, []);

    const formattedStopWatch = getFormattedStopWatch(stopwatchState);

    return <>
        {stopwatchState &&
            <div className="display">{`${formattedStopWatch.hr}:${formattedStopWatch.min}:${formattedStopWatch.sec}:${formattedStopWatch.ms}`}
            </div>}
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