import m from "mithril";
import Stream from "mithril/stream";
import merge from "mergerino";
import { bifold } from "stags";

import { createApp, App } from "./app";
import { router } from "./router";
import { K } from "./util";

// Only for using Meiosis Tracer in development.
import meiosisTracer from "meiosis-tracer";

const app = createApp(router.initialRoute);

const navigateTo = Stream();
const update = Stream();
const states = Stream.scan(merge, app.initial, update);
const actions = app.Actions(update);

// Only for using Meiosis Tracer in development.
meiosisTracer({
  selector: "#tracer",
  rows: 30,
  streams: [{ stream: states, label: "states" }]
});

m.mount(document.getElementById("app"), { view: () => m(App, { state: states(), actions }) });

states.map(() => m.redraw());

router.start({ navigateTo });

navigateTo
  .map(app.validateRoute(states))
  .map(app.onRouteChange(states))
  .map(bifold(K(null), update))
  .map(() => router.locationBarSync(states().route));
