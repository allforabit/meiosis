import React from "react";
import { fold } from "static-tagged-union";

import { Beverages } from "../beverages";
import { Beverage } from "../beverage";

const componentMap = fold({
  Beverages: () => Beverages,
  Beverage: () => Beverage
});

export const Coffee = ({ state, actions, routeIndex }) => {
  const Component = componentMap(state.routeCurrent[routeIndex + 1]);

  return (
    <div>
      <div>Coffee Page</div>
      <Component state={state} actions={actions} routeIndex={routeIndex + 1} />
    </div>
  );
};