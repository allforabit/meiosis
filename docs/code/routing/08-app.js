/** @jsx m */
/* global Meiosis, MeiosisRouting */
import m from "mithril@2.0.0-rc.4";
import Stream from "mithril@2.0.0-rc.4/stream/stream.mjs";
import merge from "mergerino@0.4.0";

import { Route, router } from "./08-routes";

const { Routing } = MeiosisRouting.state;

import {
  Home,
  Login,
  Settings,
  Tea,
  Coffee,
  Beer,
  NotFound
} from "./08-components";

import {
  loginService,
  settingsService,
  routeService,
  teaService,
  teaDetailService,
  coffeeService,
  beerService,
  beverageService,
  brewerService
} from "./08-services";

const componentMap = {
  Home,
  Login,
  Settings,
  Tea,
  Coffee,
  Beer,
  NotFound
};

const Root = {
  view: ({ attrs: { state, actions } }) => {
    const routing = Routing(state.route);
    const Component = componentMap[routing.localSegment.id];
    const isActive = tab => tab === Component;

    return (
      <div className="container">
        <div className="columns">
          <div className="column col-6">
            <div>
              {isActive(Home) && <span>&rarr;</span>}
              <a href={router.toPath([Route.Home()])}>
                Home
              </a>
            </div>
            <div>
              {isActive(Login) && <span>&rarr;</span>}
              <a href={router.toPath([Route.Login()])}>
                Login
              </a>
            </div>
            <div>
              {isActive(Settings) && <span>&rarr;</span>}
              <a href={router.toPath([Route.Settings()])}>
                Settings
              </a>
            </div>
          </div>
          <div className="column col-6">
            <div>
              {isActive(Tea) && <span>&rarr;</span>}
              <a href={router.toPath([Route.Tea()])}>Tea</a>
            </div>
            <div>
              {isActive(Coffee) && <span>&rarr;</span>}
              <a
                href={router.toPath([
                  Route.Coffee(),
                  Route.Beverages()
                ])}
              >
                Coffee
              </a>
            </div>
            <div>
              {isActive(Beer) && <span>&rarr;</span>}
              <a
                href={router.toPath([
                  Route.Beer({ type: "ale" }),
                  Route.Beverages()
                ])}
              >
                Beer
              </a>
            </div>
          </div>
        </div>
        <hr />

        <div style={{ paddingLeft: ".4rem" }}>
          <Component
            state={state}
            actions={actions}
            routing={routing}
          />
        </div>

        {/* Show or hide the Please Wait modal.
          See public/css/style.css */}
        <div
          style={{
            visibility: state.pleaseWait
              ? "visible"
              : "hidden"
          }}
        >
          <div className="simpleModal">
            <div className="simpleBox">
              <div>Loading, please wait...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const App = {
  view: ({ attrs: { state, actions } }) =>
    m(Root, { state, actions })
};

const app = {
  Initial: () => ({ route: [Route.Home()] }),
  Actions: update => ({
    navigateTo: route => update({ route }),

    username: value =>
      update({ login: { username: value } }),
    password: value =>
      update({ login: { password: value } }),

    login: (username, returnTo) =>
      update([
        { user: username },
        { route: [returnTo || Route.Home()] }
      ]),

    logout: () =>
      update([{ user: null }, { route: [Route.Home()] }])
  }),
  services: [
    teaService,
    teaDetailService,
    /*
    coffeeService,
    beerService,
    beverageService,
    brewerService,*/
    loginService,
    settingsService /*,
    routeService*/
  ]
};

Meiosis.mergerino
  .setup({ stream: Stream, merge, app })
  .then(({ states, actions }) => {
    m.route(
      document.getElementById("app"),
      "/",
      router.MithrilRoutes({ states, actions, App })
    );

    states.map(() => m.redraw());

    states.map(state =>
      router.locationBarSync(state.route)
    );

    const locationValue = document.getElementById(
      "locationValue"
    );

    states.map(state => {
      if (document.getElementById("consoleLog").checked) {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(state));
      }

      locationValue.value = location.hash;
    });

    document
      .getElementById("setLocation")
      .addEventListener("click", () => {
        location.hash = locationValue.value;
      });
  });