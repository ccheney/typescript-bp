///<reference path='../../../typings/tsd.d.ts'/>

import HandlebarsHelpers from './utils/HandlebarsHelpers';
import App from './App';

HandlebarsHelpers.init();

const app:App = new App();
app.appendTo('body');    // Need to specify what area our code has control over.
                         // The App.js class extends Stage which has the appendTo method.
