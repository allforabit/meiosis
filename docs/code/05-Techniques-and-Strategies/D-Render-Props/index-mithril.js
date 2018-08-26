/* global m */

// https://reactjs.org/docs/render-props.html
const duck = {
  view: model =>
    m("span",
      { style: { position: "absolute", left: model.x + "px", top: model.y + "px" } },
      "DUCK")
};

const createPointer = (update, render) => {
  function handlePointerMove(event) {
    update(model => {
      model.x = event.clientX;
      model.y = event.clientY;
      return model;
    });
  }

  return {
    view: model => (
      m("div", { style: { height: "100px" }, onmousemove: handlePointerMove },
        /*
          Instead of providing a static representation of what Pointer renders, use the `render`
          parameter (just a plain function) to dynamically determine what to render.
        */
        render(model)
      )
    )
  };
};

// Create a Pointer with the duck as "what to render"
const createPointerTracker = update => createPointer(update, duck.view);

const createApp = update => {
  const pointerTracker = createPointerTracker(update);

  return {
    model: () => ({
      x: 395,
      y: 253
    }),
    view: pointerTracker.view
  };
};

const update = m.stream();
const app = createApp(update);
const models = m.stream.scan((model, func) => func(model),
  app.model(), update);

const element = document.getElementById("app");
models.map(model => m.render(element, app.view(model)));
