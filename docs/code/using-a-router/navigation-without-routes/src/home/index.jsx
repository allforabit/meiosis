import React, { Component } from "react";

import { NavigateTo, fold } from "../util";

export const home = {
  // FIXME: build up a fold object for RoutePage, with defaults
  service: ({ state, update }) => {
    NavigateTo.map(navigateTo =>
      fold({
        Home: () => update({
          route: navigateTo,
          navigateTo: NavigateTo.N()
        })
      })(navigateTo)
    )(state.navigateTo);
  }
};

export class Home extends Component {
  render() {
    return (<div>Home Page</div>);
  }
}
