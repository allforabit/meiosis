/* global m, O, $ */
const get = (object, path, defaultValue) =>
  object == null
    ? defaultValue
    : path.length === 1
      ? object[path[0]]
      : get(object[path[0]], path.slice(1));

const nestPatch = (object, path) => ({
  [path[0]]: path.length === 1
    ? O(object)
    : O(nestPatch(object, path.slice(1)))
});

const nestUpdate = (update, path) => patch =>
  update(nestPatch(patch, path));

const nest = (create, update, path) => {
  const component = create(nestUpdate(update, path));
  const result = O({}, component);
  if (component.model) {
    result.model = () => nestPatch(component.model(), path);
  }
  if (component.view) {
    result.view = model => component.view(get(model, path));
  }
  return result;
};

const nestComponent = (create, update, path) => {
  const component = create(nestUpdate(update, path));
  const result = O({}, component);

  if (component.model) {
    result.model = () => _.set(path, component.model(), {});
  }
  if (component.view) {
    result.view = vnode => component.view(
      _.merge(vnode, { attrs: { model: get(path, vnode.attrs.model) } })
    );
  }
  return result;
};

const createEntry = update => {
  const actions = {
    editEntryValue: evt => update(_.set("value", evt.target.value))
  };

  return {
    model: () => ({
      value: ""
    }),

    view: model =>
      m("div",
        m("span", { style: { "margin-right": "8px" } }, "Entry number:"),
        m("input[type=text][size=2]", { value: model.value, oninput: actions.editEntryValue })
      )
  };
};

const createDateField = update => ({
  model: () => ({
    value: ""
  }),

  oninit: vnode => {
    vnode.state.actions = {
      editDateValue: evt => update(_.set("value", evt.target.value))
    };
  },

  oncreate: vnode => {
    const $datepicker = $(vnode.dom).find(".dateField");

    $datepicker
      .datepicker({ autoHide: true })
      .on("pick.datepicker", _evt =>
        update(_.set("value", $datepicker.datepicker("getDate", true)))
      );
  },

  view: vnode => {
    const model = vnode.attrs.model;
    const actions = vnode.state.actions;

    return (
      m("div", { style: { "margin-top": "8px" } },
        m("span", { style: { "margin-right": "8px" } }, "Date:"),
        m("input[type=text][size=10].dateField", { value: model.value,
          oninput: actions.editDateValue })
      )
    );
  },

  onremove: vnode => {
    $(vnode.dom).find(".dateField").datepicker("destroy");
  }
});

const createTemperature = label => update => {
  const actions = {
    increase: value => evt => {
      evt.preventDefault();
      update(_.update("value", _.add(value)));
    },
    changeUnits: evt => {
      evt.preventDefault();
      update(model => {
        if (model.units === "C") {
          model.units = "F";
          model.value = Math.round( model.value * 9 / 5 + 32 );
        }
        else {
          model.units = "C";
          model.value = Math.round( (model.value - 32) / 9 * 5 );
        }
        return model;
      });
    }
  };

  return {
    model: () => ({
      label,
      value: 20,
      units: "C"
    }),

    view: model =>
      m("div.row", { style: { "margin-top": "8px" } },
        m("div.col-md-3",
          m("span", model.label, " Temperature: ", model.value, m.trust("&deg;"), model.units)
        ),
        m("div.col-md-6",
          m("button.btn.btn-sm.btn-default", { onclick: actions.increase(1) }, "Increase"), " ",
          m("button.btn.btn-sm.btn-default", { onclick: actions.increase(-1) }, "Decrease"), " ",
          m("button.btn.btn-sm.btn-info", { onclick: actions.changeUnits }, "Change Units")
        )
      )
  };
};

const createApp = update => {
  const displayTemperature = temperature => temperature.label + ": " +
    temperature.value + "\xB0" + temperature.units;

  const actions = {
    save: evt => {
      evt.preventDefault();
      update(model => {
        model.saved = " Entry #" + model.entry.value +
          " on " + model.date.value + ":" +
          " Temperatures: " +
          displayTemperature(model.temperature.air) + " " +
          displayTemperature(model.temperature.water);

        model.entry.value = "";
        model.date.value = "";

        return model;
      });
    }
  };

  const entry = nest(createEntry, update, "entry");
  const DateField = nest(createDateField, update, "date", true);
  const air = nest(createTemperature("Air"), update, "temperature.air");
  const water = nest(createTemperature("Water"), update, ["temperature", "water"]);

  return {
    model: () => _.mergeAll([
      { saved: "" },
      entry.model(),
      DateField.model(),
      air.model(),
      water.model()
    ]),

    view: model =>
      m("form",
        entry.view(model),
        m(DateField, { model }),
        air.view(model),
        water.view(model),
        m("div",
          m("button.btn.btn-primary", { onclick: actions.save }, "Save"),
          m("span", model.saved)
        )
      )
  };
};

const update = m.stream();
const app = createApp(update);
const models = m.stream.scan((model, func) => func(model),
  app.model(), update);

const element = document.getElementById("app");
models.map(model => m.render(element, app.view(model)));
