import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import App from "./App";
import PrivateRoute from "./module/util/PrivateRoute";
import RLoginLayout from "./module/user/RLoginPage";
import {Route, Switch} from "react-router";

ReactDOM.render((
    <BrowserRouter>
        <div>
            <Switch>
                <Route path="/login">
                    <RLoginLayout/>
                </Route>
                <PrivateRoute path="/">
                    <App/>
                </PrivateRoute>
            </Switch>
        </div>
    </BrowserRouter>
), document.getElementById('root'));
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
