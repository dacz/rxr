import 'babel-polyfill'; // eslint-disable-line
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'rxr-react';
import { createState, createLoggerStream, startLogging, messageStreamsMonitorS } from 'rxr';

import styles from './index.css'; // eslint-disable-line

import App from './components/App';

import reducerS from './reducers';

const initialState = {
  clients:        { data: [], ts: 0, status: undefined },
  filter:         '',
  selectedClient: '',
};

const stateS = createState(reducerS, initialState);

const loggerStreamS = createLoggerStream(stateS, messageStreamsMonitorS);
startLogging(loggerStreamS);

render(
  <Provider stateS={ stateS }>
    <App />
  </Provider>, document.getElementById('index')
);
