import 'babel-polyfill'; // eslint-disable-line
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'rxr-react';
import { blueprint, logger } from 'rxr';

import styles from './index.css'; // eslint-disable-line

import App from './components/App';

// blueprint of our app
import appBlueprint from './appBlueprint';
// functions for our app
import appFunctions from './funcs';

// we setup our app
const app = blueprint(appBlueprint, { functions: appFunctions });

logger(app.monitorS);

render(
  <Provider stateS={ app.stateS }>
    <App />
  </Provider>, document.getElementById('index')
);
