/*global m*/

// -- Utility code

var nestUpdate = function(update, prop) {
  return function(func) {
    update(function(model) {
      model[prop] = func(model[prop]);
      return model;
    });
  };
};

var nest = function(create, update, prop) {
  var component = create(nestUpdate(update, prop));
  var result = Object.assign({}, component);
  if (component.model) {
    result.model = function() {
      var initialModel = {};
      initialModel[prop] = component.model();
      return initialModel;
    };
  }
  if (component.view) {
    result.view = function(model) {
      return component.view(model[prop]);
    };
  }
  return result;
};

// -- Application code

var convert = function(value, to) {
  if (to === "C") {
    return Math.round( (value - 32) / 9 * 5 );
  }
  else {
    return Math.round( value * 9 / 5 + 32 );
  }
};

var createTemperature = function(label, init) {
  return function(update) {
    var increase = function(amount) {
      return function(_event) {
        update(function(model) {
          model.value += amount;
          return model;
        });
      };
    };
    var changeUnits = function(_event) {
      update(function(model) {
        var newUnits = model.units === "C" ? "F" : "C";
        model.value = convert(model.value, newUnits);
        model.units = newUnits;
        return model;
      });
    };

    var model = function() {
      return Object.assign({ value: 22, units: "C" }, init);
    };

    var view = function(model) {
      return m("div.temperature", [
        label, " Temperature: ", model.value, m.trust("&deg;"), model.units,
        m("div",
          m("button", { onclick: increase( 1) }, "Increase"),
          m("button", { onclick: increase(-1) }, "Decrease")
        ),
        m("div",
          m("button", { onclick: changeUnits }, "Change Units")
        )
      ]);
    };
    return { model: model, view: view };
  };
};

var createTemperaturePair = function(update) {
  var air = nest(createTemperature("Air"), update, "air");
  var water = nest(createTemperature("Water", { value: 84, units: "F" }),
    update, "water");

  var model = function() {
    return Object.assign(air.model(), water.model());
  };

  var view = function(model) {
    return [
      air.view(model),
      water.view(model)
    ];
  };
  return { model: model, view: view };
};

var createHumidity = function(label, init) {
  return function(update) {
    var increase = function(model, amount) {
      return function(_event) {
        update(function(model) {
          model.value += amount;
          return model;
        });
      };
    };

    var model = function() {
      return Object.assign({ value: 40 }, init);
    };

    var view = function(model) {
      return m("div.humidity", [
        label, " Humidity: ", model.value, "%",
        m("div",
          m("button", { onclick: increase(model, 1) }, "Increase"),
          m("button", { onclick: increase(model,-1) }, "Decrease")
        ),
      ]);
    };
    return { model: model, view: view };
  };
};

var createHumidityPair = function(update) {
  var indoor = nest(createHumidity("Indoor"), update, "indoor");
  var outdoor = nest(createHumidity("Outdoor", { value: 60 }), update, "outdoor");

  var model = function() {
    return Object.assign(indoor.model(), outdoor.model());
  };

  var view = function(model) {
    return [
      indoor.view(model),
      outdoor.view(model)
    ];
  };
  return { model: model, view: view };
};

var createApp = function(update) {
  var temperatures = nest(createTemperaturePair, update, "temperatures");
  var humidities = nest(createHumidityPair, update, "humidities");

  var model = function() {
    return Object.assign(temperatures.model(), humidities.model());
  };

  var view = function(model) {
    return [
      temperatures.view(model),
      humidities.view(model)
    ];
  };
  return { model: model, view: view };
};

// -- Meiosis pattern setup code

var update = m.stream();
var app = createApp(update);

var models = m.stream.scan(function(model, func) {
  return func(model);
}, app.model(), update);

var element = document.getElementById("app");

models.map(function(model) {
  m.render(element, app.view(model));
});
