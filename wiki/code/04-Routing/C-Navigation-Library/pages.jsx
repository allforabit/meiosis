/* global BeerDetailsPage, CoffeePage */

/* Home Page */

// eslint-disable-next-line no-unused-vars
const createHome = _navigator => _update => ({
  view: _model => (<div>Home Page</div>)
});

/* Coffee Page */

const coffees = [
  { id: "c1", description: "Coffee 1" },
  { id: "c2", description: "Coffee 2" }
];

const coffeeMap = coffees.reduce((result, next) => {
  result[next.id] = next;
  return result;
}, {});

const loadCoffees = () => new Promise(resolve =>
  setTimeout(() => resolve(coffees), 1));

const loadCoffee = params => new Promise(resolve =>
  setTimeout(() => resolve(coffeeMap[params.id]||"")), 1);

// eslint-disable-next-line no-unused-vars
const createCoffee = navigator => update => ({
  navigating: (params, url, navigate) => {
    loadCoffees().then(coffees => {
      const assignCoffees = { coffees };

      if (params && params.id) {
        loadCoffee(params).then(coffee => {
          navigate(Object.assign(assignCoffees, { coffee: coffee.description }));
        });
      }
      else {
        navigate(assignCoffees);
      }
    });
  },
  view: model => (
    <div>
      <p>Coffee Page</p>
      {model.coffees.map(coffee => <span key={coffee.id}>
        <a href={navigator.getUrl(CoffeePage, { id: coffee.id })}>{coffee.id}</a>
        {" "}
      </span>)}
      {model.coffee}
    </div>
  )
});

/* Beer Page */

const loadBeer = () => new Promise(resolve =>
  setTimeout(() => resolve(beerList), 1));

const beerList = [
  { id: "b1", title: "Beer 1" },
  { id: "b2", title: "Beer 2" }
];

// eslint-disable-next-line no-unused-vars
const createBeer = navigator => update => ({
  navigating: (params, url, navigate) => {
    loadBeer().then(beerList => {
      navigate({ beerList });
    });
  },
  view: model => (
    <div>
      <p>Beer Page</p>
      <ul>
        {model.beerList.map(beer =>
          <li key={beer.id}>
            <a href={navigator.getUrl(BeerDetailsPage, { id: beer.id })}
            >{beer.title}</a>
            {" "}
            <button className="btn btn-default btn-xs"
              onClick={() =>
                navigator.navigateTo(BeerDetailsPage, { id: beer.id })}>
              {beer.title}
            </button>
          </li>
        )}
      </ul>
    </div>
  )
});

// eslint-disable-next-line no-unused-vars
const createBeerDetails = _navigator =>  _update => ({
  navigating: (params, url, navigate) =>
    navigate({ beerId: params.id }),
  view: model => (<p>Details of beer {model.beerId}</p>)
});