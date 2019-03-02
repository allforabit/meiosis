import { bifold, fold } from "static-tagged-union";

import { teas } from "../teaDetails";
import { Loaded, Route } from "../root";
import { Tpipe, contains, onChange } from "../util";

export const tea = {
  service: (states, update) => {
    onChange(states, ["routeCurrent"], state => Tpipe(
      state.routeCurrent,
      contains(Route.Tea()),
      bifold(
        () => {
          update({ teas: Loaded.N() });
        },
        () => {
          fold({
            N: () => {
              setTimeout(() => {
                update({ teas: Loaded.Y(teas) });
              }, 500);
            }
          })(state.teas);
        }
      )
    ));
  }
};
