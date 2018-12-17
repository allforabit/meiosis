# [Meiosis](https://meiosis.js.org) Tutorial

[Table of Contents](toc.html)

## 01 - Hello World

The first thing that we will do is render something onto the page - a "Hello, world" message,
of course. With React, this is accomplished using `ReactDOM.render`. When calling this function, we
must pass two parameters:

1. The DOM element into which we want to render, and
1. The React component that we want to render.

A React component is a class that extends `React.Component` and that has a `render` method.
That method must return a virtual DOM node (or _vnode_ for short). We can use JSX to describe the
HTML structure of what we want to render and produce a vnode.

### Our First Example

The DOM element into which we want to render could be `document.body`. However, I will use an
HTML file with an element inside of it. The element that has the `app` id and can be retrieved
using `document.getElementById("app")`. The reason I am using an HTML file is that this enables you
to render other things on the page, and have your app (or multiple apps) occupy specific places on
the page.

To produce the vnode for our message, we can simply use `<h1>Hello, world</h1>`.

Here is the code to render the message onto the page:

@flems react/01-hello-world.jsx,app.html,app.css react,react-dom

Notice that the component produces the view, and `app.html` contains the `element` into which we render.
These are the two arguments that we pass to `ReactDOM.render`.

![The Render Function](01-hello-world-react-01.svg)

### Exercises

Edit the code above and try out these exercises. You can see the output on the right, so you
can confirm that your code works as expected.

1. Change the `h1` tag to something else, and change the message.
1. In `app.html`, add something before and after the `id` element, and confirm that they are
displayed before and after the message that you are rendering.
1. Change the `element` into which to render, to `document.body`. Notice that your message
now overwrites anything that you had in the `app.html` file.

When you are ready, move on to the next lesson: [02 - Render Method](02-render-method-react.html).

[Table of Contents](toc.html)

-----

[Meiosis](https://meiosis.js.org) is developed by [@foxdonut00](http://twitter.com/foxdonut00) / [foxdonut](https://github.com/foxdonut) and is released under the MIT license.
