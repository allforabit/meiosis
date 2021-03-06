import m from "mithril";
import { always as K } from "ramda";

import { Beverages } from "../beverages";
import { Beverage } from "../beverage";
import { Route } from "../routes";

const componentMap = Route.fold({
  Beer: K(Beverages),
  BeerDetails: K(Beverage),
  BeerBrewer: K(Beverage)
});

export const Beer = {
  view: ({ attrs: { state, actions } }) => {
    const Component = componentMap(state.route);

    return m(
      "div",
      m("div", "Beer Page"),
      m(Component, {
        state,
        actions,
        beverageRoute: Route.of.BeerDetails,
        parentRoute: Route.of.Beer,
        brewerRoute: Route.of.BeerBrewer
      })
    );
  }
};
