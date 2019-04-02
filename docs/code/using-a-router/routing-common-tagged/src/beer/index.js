import { contains, fold } from "static-tagged-union";

import { beers } from "../beverage";
import { Loaded, Route } from "../routes";
import { T, Tpipe } from "../util";

export const beer = {
  service: (state, update) =>
    Tpipe(
      state.route,
      contains(Route.Beer()),
      fold({
        Y: () => T(state.beers, fold({
          N: () => {
            if (!state.pleaseWait) { // FIXME
              update({ pleaseWait: true });
            }

            setTimeout(() => update({
              pleaseWait: false,
              beers: Loaded.Y(beers)
            }), 1000);
          }
        })),
        N: () => T(state.beers, fold({
          Y: () => update({ beers: Loaded.N() })
        }))
      })
    )
};