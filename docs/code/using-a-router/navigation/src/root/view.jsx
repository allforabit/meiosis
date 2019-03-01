import React, { Component } from "react";
import { fold } from "static-tagged-union";

import { Home } from "../home";
import { Login } from "../login";
import { Settings } from "../settings";
import { Tea } from "../tea";
import { Coffee } from "../coffee";
import { Beer } from "../beer";

import { Route } from "routing-common/src/root";

const componentMap = fold({
  Loading: () => () => (<div>Loading, please wait...</div>),
  Home: () => Home,
  Login: () => Login,
  Settings: () => Settings,
  Tea: () => Tea,
  Coffee: () => Coffee,
  Beer: () => Beer
});

export class Root extends Component {
  render() {
    const { state, actions } = this.props;
    const routeIndex = 0;

    const Component = componentMap(state.routeCurrent[routeIndex]);
    const isActive = tab => tab === Component ? "active" : "";

    return (
      <div>
        <nav className="navbar navbar-default">
          <ul className="nav navbar-nav">
            <li className={isActive(Home)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Home()])}>Home</a>
            </li>
            <li className={isActive(Login)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Login()])}>Login</a>
            </li>
            <li className={isActive(Settings)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Settings()])}>Settings</a>
            </li>
            <li className={isActive(Tea)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Tea()])}>Tea</a>
            </li>
            <li className={isActive(Coffee)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Coffee(), Route.Beverages()])}>Coffee</a>
            </li>
            <li className={isActive(Beer)}>
              <a href="javascript://"
                onClick={() => actions.navigateTo([Route.Beer(), Route.Beverages()])}>Beer</a>
            </li>
          </ul>
        </nav>
        <Component state={state} actions={actions} routeIndex={routeIndex} />
        {/* Show or hide the Please Wait modal. See public/css/style.css */}
        <div style={{visibility: state.pleaseWait ? "visible" : "hidden"}}>
          <div className="modal">
            <div className="box">
              <div>Loading, please wait...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}