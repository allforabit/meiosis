import m from "mithril";
import { always as K } from "ramda";
import { run } from "stags";

import { Home } from "../home";
import { Login } from "../login";
import { Settings } from "../settings";
import { Tea } from "../tea";
import { Coffee } from "../coffee";
import { Beer } from "../beer";
import { Route } from "../routes";
import { router } from "../router";
import { Data } from "../util";

const componentMap = Route.fold({
  Home: K(Home),
  Login: K(Login),
  Settings: K(Settings),
  Tea: K(Tea),
  TeaDetails: K(Tea),
  Coffee: K(Coffee),
  CoffeeDetails: K(Coffee),
  CoffeeBrewer: K(Coffee),
  Beer: K(Beer),
  BeerDetails: K(Beer),
  BeerBrewer: K(Beer)
});

export const Root = {
  view: ({ attrs: { state, actions } }) => {
    const Component = componentMap(state.route);
    const isActive = tab => (tab === Component ? ".active" : "");

    return m(
      "div",
      m(
        "nav.navbar.navbar-default",
        m(
          "ul.nav.navbar-nav",
          m("li" + isActive(Home), m("a", { href: router.toPath(Route.of.Home()) }, "Home")),
          m("li" + isActive(Login), m("a", { href: router.toPath(Route.of.Login()) }, "Login")),
          m(
            "li" + isActive(Settings),
            m("a", { href: router.toPath(Route.of.Settings()) }, "Settings")
          ),
          m("li" + isActive(Tea), m("a", { href: router.toPath(Route.of.Tea()) }, "Tea")),
          m("li" + isActive(Coffee), m("a", { href: router.toPath(Route.of.Coffee()) }, "Coffee")),
          m("li" + isActive(Beer), m("a", { href: router.toPath(Route.of.Beer()) }, "Beer"))
        )
      ),
      m(Component, { state, actions }),
      /* Show or hide the Please Wait modal. See public/css/style.css */
      m(
        "div",
        {
          style: { visibility: run(state.beverages, Data.getLoadingWith("hidden", K("visible"))) }
        },
        m("div.simpleModal", m("div.simpleBox", m("div", "Loading, please wait...")))
      )
    );
  }
};
