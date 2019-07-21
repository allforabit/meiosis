/* global React, ReactDOM, flyd, O */

const routingAccept = state => {
  const [leave, arrive] =
    state.pageId !== state.previousPageId
      ? [state.previousPageId, state.pageId]
      : [null, null];

  return {
    previousPageId: state.pageId,
    leave,
    arrive
  };
};

const dataService = ({ state, actions }) => {
  if (state.arrive === "DataPage") {
    actions.loadData();
  } else if (state.leave === "DataPage") {
    actions.unloadData();
  }
};

const aboutService = ({ state, actions }) => {
  if (state.arrive === "AboutPage") {
    actions.loadAbout();
  } else if (state.leave === "AboutPage") {
    actions.unloadAbout();
  }
};

const app = {
  Initial: () => ({
    pageId: "HomePage"
  }),
  Actions: update => ({
    navigateTo: pageId => update({ pageId }),
    loadData: () => {
      update({ data: "Loading, please wait..." });
      setTimeout(
        () => update({ data: "The data has been loaded." }),
        1500
      );
    },
    unloadData: () => {
      update({ data: null });
    },
    loadAbout: () => {
      update({ about: "Loading, please wait..." });
      setTimeout(
        () =>
          update({ about: "About data has been loaded." }),
        1500
      );
    },
    unloadAbout: () => {
      update({ about: null });
    }
  }),
  acceptors: [routingAccept],
  services: [dataService, aboutService]
};

// -- Pages

class HomePage extends React.Component {
  render() {
    return (
      <div>
        Navigate to a page by clicking on the items above.
      </div>
    );
  }
}

class DataPage extends React.Component {
  render() {
    const { state } = this.props;
    return <div>{state.data}</div>;
  }
}

class AboutPage extends React.Component {
  render() {
    const { state } = this.props;
    return <div>{state.about}</div>;
  }
}

const pages = {
  HomePage,
  DataPage,
  AboutPage
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.navigateTo = pageId => () =>
      this.props.actions.navigateTo(pageId);
    this.state = this.props.states();
  }

  componentDidMount() {
    const setState = this.setState.bind(this);
    this.props.states.map(state => {
      setState(state);
    });
  }

  render() {
    const state = this.state;
    const { actions } = this.props;
    const active = pageId =>
      state.pageId === pageId ? " active" : "";
    const Component = pages[state.pageId];

    return (
      <div>
        <ul className="tab">
          <li className={"tab-item" + active("HomePage")}>
            <a
              href="#"
              onClick={this.navigateTo("HomePage")}
            >
              Home
            </a>
          </li>
          <li className={"tab-item" + active("DataPage")}>
            <a
              href="#"
              onClick={this.navigateTo("DataPage")}
            >
              Data
            </a>
          </li>
          <li className={"tab-item" + active("AboutPage")}>
            <a
              href="#"
              onClick={this.navigateTo("AboutPage")}
            >
              About
            </a>
          </li>
        </ul>
        <Component state={state} actions={actions} />
      </div>
    );
  }
}

// -- Meiosis pattern setup code

const update = flyd.stream();
const actions = app.Actions(update);

const accept = state =>
  app.acceptors.reduce(
    (updatedState, acceptor) =>
      O(updatedState, acceptor(updatedState)),
    state
  );

const states = flyd.scan(
  (state, patch) => accept(O(state, patch)),
  accept(app.Initial()),
  update
);

states.map(state =>
  app.services.forEach(service =>
    service({ state, update, actions })
  )
);

ReactDOM.render(
  <App states={states} actions={actions} />,
  document.getElementById("app")
);

let counter = 0;
states.map(state => {
  // eslint-disable-next-line no-console
  console.log(++counter, JSON.stringify(state, null, 2));
});