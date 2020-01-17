"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function springAccelerationForState(state) {
    return (-state.tension * state.x) - (state.friction * state.v);
}
function springEvaluateStateWithDerivative(initialState, dt, derivative) {
    const state = {
        x: initialState.x + derivative.dx * dt,
        v: initialState.v + derivative.dv * dt,
        tension: initialState.tension,
        friction: initialState.friction,
    };
    return {
        dx: state.v,
        dv: springAccelerationForState(state),
    };
}
function springIntegrateState(state, dt) {
    const a = {
        dx: state.v,
        dv: springAccelerationForState(state),
    }, b = springEvaluateStateWithDerivative(state, dt * 0.5, a), c = springEvaluateStateWithDerivative(state, dt * 0.5, b), d = springEvaluateStateWithDerivative(state, dt, c), dxdt = 1 / 6 * (a.dx + 2 * (b.dx + c.dx) + d.dx), dvdt = 1 / 6 * (a.dv + 2 * (b.dv + c.dv) + d.dv);
    state.x = state.x + dxdt * dt;
    state.v = state.v + dvdt * dt;
    return state;
}
function generateSpringRK4(tension, friction, duration) {
    const initState = {
        x: -1,
        v: 0,
        tension: parseFloat(tension) || 500,
        friction: parseFloat(friction) || 20,
    }, path = [0], tolerance = 1 / 10000, DT = 16 / 1000, haveDuration = duration != null;
    let timeLapsed = 0, dt, lastState;
    if (haveDuration) {
        timeLapsed = generateSpringRK4(initState.tension, initState.friction);
        dt = timeLapsed / duration * DT;
    }
    else {
        dt = DT;
    }
    while (true) {
        lastState = springIntegrateState(lastState || initState, dt);
        path.push(1 + lastState.x);
        timeLapsed += 16;
        if (!(Math.abs(lastState.x) > tolerance && Math.abs(lastState.v) > tolerance)) {
            break;
        }
    }
    return !haveDuration ? timeLapsed : (percentComplete, startValue, endValue) => {
        if (percentComplete === 0) {
            return startValue;
        }
        if (percentComplete === 1) {
            return endValue;
        }
        return startValue + path[Math.floor(percentComplete * (path.length - 1))] * (endValue - startValue);
    };
}
exports.generateSpringRK4 = generateSpringRK4;
