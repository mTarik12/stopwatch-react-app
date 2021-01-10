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

const App = () => {
    
    const [stopwatchState, setStopwatchState] = useState();
    useEffect(() => {
        const stopwatchSub = stopwatch$.subscribe(setStopwatchState);
        return () => {
            stopwatchSub.unsubscribe();
        };
    }, []);

    return <>
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