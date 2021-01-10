const incMs = timer => {
    const max_ms = 99;
    if (timer.ms === max_ms) {
        timer.ms = 0;
        timer.sec = ++timer.sec;
    } else {
        timer.ms = ++timer.ms;
    };
    return timer;
};
const incSec = timer => {
    const max_sec = 60;
    if (timer.sec === max_sec) {
        timer.sec = 0;
        timer.min = ++timer.min;
    }
    return timer;
};
const incMin = timer => {
    const max_min = 60;
    if (timer.min === max_min) {
        timer.min = 0;
        timer.hr = ++timer.hr;
    }
    return timer;
};

export default timer => incMin(incSec(incMs(timer)));