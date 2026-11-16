# frontend notes

## React

React is a core library which provide two attachments:
1.react-dom (for web dev)
2.react-native (for app dev)

ways to create react app
1.`npx create-react-app nameOfTheApp` (we dont usually use it)
2.`npm create vite@latest` (for creating react app via vite bundler)

React create a SPA ie single page application. All the manipulation is done through that single page to create the whole frontend.

React creates its own DOM which is called as virtual DOM and when the project gets changed, react compares its virtual DOM with browser DOM and it updates the browser DOM with only changed elements.

React takes the single html document and creates a root with the help of virtual DOM and then it renders the whole react app inside that root

React scripts(a package) are responsible to inject js in that htlm document because at the end, that page is the one which gonna render on user browser.

In React any function that returns an ui element can be treated as component.
React custom component should start with a capital letter so that react would new that it is a custom component and not html regular component like `<div><div/>`

How React Renders It:

When React runs your code, the rendering process follows a clear flow:

Function Execution: React invokes your parent function component (App()).

Parsing Elements: It reads what App() returns, seeing standard HTML tags (`<h1>`) alongside custom component tags (`<chai />`).

Evaluating Components: When it hits `<chai />`, it runs the imported chai() function, evaluates the elements inside that function, and turns everything into a unified virtual DOM tree.

DOM Injection: Finally, React takes this tree and updates the actual browser DOM so the user can see the final rendered page.

React.strictMode is development specific only

Native JS dont understand this jsx syntax and if you gonna run it with native js runtime environment it will throw syntax error but because of bundler and

Babel is a JavaScript compiler (often called a transpiler).It takes modern or non-standard JavaScript code—like JSX, experimental features, or newer ES6+ syntax—and translates it down into older, highly compatible JavaScript

You write the code (App.js): You type JSX syntax like `<chai />` and `<h1>` into your code editor. At this exact moment, it is just text sitting on your hard drive.

The Bundler/Compiler steps in (Babel / Vite):

When you save or run your project, development tools like Vite or Webpack scan your code.

They hand the JSX parts over to Babel (or Vite's built-in compiler, esbuild).

The compiler looks at the XML tags, strips them out, and replaces them with standard JavaScript function calls (React.createElement(...)).

The Output Bundle: The compiler generates a bundle of clean, 100% valid JavaScript files containing zero JSX.

The JavaScript Interpreter (Browser):

The browser finally downloads and opens these plain JavaScript files.

The browser's JS Engine (like V8 in Chrome) reads the script. Because the JSX is completely gone and replaced by normal function calls, the engine happily executes the code without throwing any syntax errors.

this is what these bundles do when they build the react app and why these bundlers are mandatory and one more thing, the code in build file is 100% pure js which can be run on any js runtime like node.js or chrome v8 engine.

react take the div passed to it and when it renders using root.render, it takes your whole tree as which is passed as app and then it injects whole tree into that root div.
To enable this behaviour, there must be a script tag in root html document and it should connect to all the react javascript thing because whole this react app is bundled and then it goes to frontend and it runs there.

1. How React Manages Its Own DOM (The Virtual DOM)
Directly talking to the browser's real DOM (adding elements, changing styles, removing nodes) is slow and expensive. Every time you touch the real DOM, the browser has to recalculate layouts, geometry, and repaint pixels on the screen.

To fix this, React maintains a Virtual DOM in memory:

The Blueprint: The Virtual DOM is a lightweight, pure JavaScript object copy of the real DOM tree.

Fast Updates: When something changes in your app (like a user clicking a button), React doesn't touch the real browser DOM yet. Instead, it re-renders and updates its Virtual DOM tree in memory, which happens almost instantly because it's just manipulating plain JavaScript objects.

1. Why and How It Updates the Main DOM (Reconciliation & Diffing)
Once the Virtual DOM is updated, React figures out what actually changed on the screen using a process called Reconciliation:

The Diffing Algorithm: React compares the new Virtual DOM tree with a snapshot of the previous Virtual DOM tree. It finds the exact microscopic difference (e.g., "Ah, only this one text node inside the `<h1>` tag changed from 'chai' to 'hot chai'").

Surgical Updates: Instead of destroying and re-rendering the whole page or even the whole div, React issues a precise, surgical command to the real browser DOM to update only that specific changed element.

1. Why This Makes State Management Easy
Before React, managing UI state meant writing manual "DOM spaghetti code." If a user clicked a counter button, you had to write code that manually found the counter element in the HTML, read its text, parsed it into a number, added 1, and manually updated the HTML string. If you had 10 things depending on that counter, you had to manually update all 10 elements.

React changes the paradigm to "Data-Driven UI":

You only care about State (the data, like count = 0).

You tell React what the UI should look like based on that state using JSX (`<h1>Counter: {count}</h1>`).

When the state changes (via hooks like useState), React automatically handles the re-rendering and DOM updating for you behind the scenes. You never have to manually query or manipulate an HTML element again.

to inject js in JSX, use {}.

react components take props just like classname and you can use these props within the container.

react hooks:
useState ----- to manage state within react app
useEffect ----- to rerun a piece of code when its dependies have been changes
useCallback ----- it is used to cache a function between re-renders in react. it recache it when any of its dependies gets changed.
useRef ----- used to get reference of any of the elements

The Tradeoff Summary
Vanilla JS (Raw Speed & Control):

The Cost: Zero abstraction. You carry 100% of the cognitive and architectural load. You have to manually find DOM elements, write imperative update instructions, and manually sync your application's data flags with the screen. As an app grows, this manual bookkeeping becomes a maintenance nightmare and leads to out-of-sync UI bugs.

The Benefit: Zero runtime overhead. There is no virtual tree traversal, no diffing algorithm, and no framework scheduler eating up CPU cycles. It hits the metal instantly.

React (Developer Ergonomics & Predictability):

The Cost: Performance and memory overhead. React has to maintain an in-memory Virtual DOM / Fiber tree, run reconciliation diffs on state changes, and handle async scheduling/batching.

The Benefit: Complete state synchronization and declarative peace of mind. You manage pure data flags, and React reliably handles the underlying DOM operations for you, ensuring your UI never drifts out of sync with your state.

For most modern web applications, the tiny performance tax of React's reconciliation engine is a worthwhile trade to escape the absolute chaos of managing large-scale UI state manually in Vanilla JavaScript.

Initial Virtual DOM (Classic React): Originally, React relied strictly on a two-tree Virtual DOM comparison. Whenever state changed, React generated a complete, fresh Virtual DOM tree for the entire component subtree. It then ran a full structural diff algorithm (comparing old versus new trees node-by-node from top to bottom) to identify changes before batching updates and patching the real browser DOM.

The Bottleneck: This old process was strictly synchronous and recursive. Once React started diffing a large component tree, it could not pause or interrupt the work. If a component tree was deep or complex, this heavy recursive loop would lock up the main JavaScript thread, causing dropped frames, sluggish UI animations, and delayed user inputs.

The Fiber Architecture (Modern React): Introduced to solve this exact bottleneck, React Fiber broke the rendering engine into an asynchronous, incremental scheduler. Instead of one monolithic Virtual DOM tree, React built a Fiber node tree where every component and element acts as an independent unit of work (a linked-list structure).

Key Changes Introduced by Fiber:

Time Slicing / Interruptible Rendering: Fiber splits rendering work into small chunks. It can pause a low-priority render to let high-priority user actions (like typing or clicking) run smoothly, then resume background rendering where it left off.

Priority-Based Updates: Updates are assigned different priority levels (e.g., immediate user inputs vs. low-priority data fetches), allowing React to shuffle tasks dynamically.

Double Buffering: It maintains a current tree and a work-in-progress tree in memory, updating nodes incrementally behind the scenes before committing the final set of changes cleanly to the real DOM in a single burst.

When building web applications, Server-Side Rendering (SSR) and Client-Side Rendering (CSR) define where the HTML code of your website is generated before it appears on the user's screen.

Here is a clear breakdown of the differences, how they work, and their trade-offs:

1. Client-Side Rendering (CSR)
In Client-Side Rendering, the server sends a nearly empty HTML file to the browser (usually just a basic boilerplate with a single `<div id="root"></div>`) along with a massive bundle of JavaScript.

How it works:

The browser downloads the empty HTML shell.

The browser then downloads and executes the JavaScript code.

React (or another frontend library) runs in the browser, builds the UI components from scratch, and populates the DOM.

Pros:

Extremely fast page transitions after the initial load (making it feel like a snappy desktop application or Single Page Application).

Reduced server load, since the user's browser does the heavy lifting of rendering the UI.

Cons:

Slower Initial Load: The user sees a blank white screen or a loading spinner while the browser waits to download, parse, and execute all the JavaScript.

SEO Challenges: Web crawlers may struggle to index content properly if the page depends heavily on JavaScript execution to generate its content.

1. Server-Side Rendering (SSR)
In Server-Side Rendering, the server does all the heavy lifting before sending anything to the user.

How it works:

When a user requests a page, the server fetches the necessary data (like user profiles, database items, or product catalogs) and runs the framework code to generate the fully formed HTML string right there on the server.

The server sends the complete, ready-to-view HTML directly to the browser.

The browser immediately displays the page content to the user. Simultaneously, it downloads a smaller JavaScript package to attach event listeners (making buttons clickable, etc.—a process known as hydration).

Pros:

Lightning-Fast Initial Load: The user sees the fully rendered page almost instantly without waiting for JavaScript execution.

Great SEO: Search engine crawlers receive a fully populated HTML page instantly, making it ideal for blogs, e-commerce sites, and public-facing content.

Cons:

Higher Server Load: Every single page request requires server compute resources to build the HTML, which can increase hosting costs or slow down under massive traffic spikes.

Full Page Reloads / TTI Delays: Navigation can sometimes feel slower compared to a pure client-side app, and users might see a non-interactive page for a split second while JavaScript finishes hydrating.

The hydration process takes place in server side rendering when the HTML and CSS are on the screen, but the page is completely "dead" at this exact millisecond. It is just static pixels—buttons cannot be clicked yet, forms cannot be submitted, and state hooks (useState) are not active because JavaScript hasn't executed. The browser then downloads the JavaScript bundle in the background. Once downloaded, the React runtime runs across the existing DOM tree, matches the components to the static HTML nodes that the server already sent, and "hydrates" them by attaching all event listeners, state managers, and interactivity hooks.
Think of it like pouring water into a dried-up plant: the structure (HTML) is already there, but hydration brings it to life and makes it interactive.

We dont use a tag within react becuase it makes the page rerender which is not the case with react. React stays on the single page application and thats why we dont use a tag.

Navlink in react router dom provides you different utilities to use them with link component like isActive(which tells if the current link element is active or not)

In Tailwind, if you want to toggle between dark mode and light mode, you just need to add dark or remove it from html element classname attribute and then you need to style your elems accordingly  like dark:bg-grey-700 and all these styling will be activated when there will be a dark class in html element.

context api or redux toolkit in react serve a specific role ie they are used to store states globally and pass them to required components so that we dont need to do prop drilling.

In js, filter is a looping method that is used when you need to filter out some value from an array. It works on true statement ie it only filters out the value that doesnt satisfy the given condition.

Redux was introduced for state management and act as a single source of truth for states. It have better data flow than Context Api which came after Redux. Then comes the Redux Toolkit which includes all the middlewares that redux supported as extensions or add ons and the setup became so much easy for a redux project.
It also supports state preservation like when you fetch states, then they get preserved and nobody can accidently update them.

In react router dom, both link and navlink are used in place of a tag to stop the reloading of the page. Link in used for standard navigation like login page and home whereas Navlink is used for navbar navigation in which you need to show which page is active from the menu like home, contact us, about us and other. You can do it by changing the style of the text.

In React, state changes are detected using shallow comparision ie comparing the addresses of new and old values rather than comparing the values, so in case if you need to update an array, you need to fetch  that array, construct a new one from that and then pass that new array in state so that react can know that a state change has been performed. On the other hand, Redux-toolkit provides abstraction so that you can just push an extra element in that state and then redux handles all the state change under the hood same as we do in vanilla react.

## Context API

In React, context api is the builtin way to handle state management to avoid prop drilling.
In this, you first need to create a context using createCOntext, then you need to generate a provider using that context, then you need to wrap your whole app with that provider passing a value prop in that provider which should contain all the values that the children of that provider will need. You also can pass default values to the context but the values passed to value prop takes the priority because they overwrite the default values. Then you need useContext hook from react to use the context anywhere inside the provider component without prop drilling. You need to pass the created context inside the useContext hook like:
`const {value1, value2} = useContext(createdContext)`

## Redux-toolkit

Redux toolkit is not native to react but it is a standlone library for state management which is used in react project alongside a wiring library which is react-redux. For big project, RTK is more suitable for a react project than the builtin context api because it provides a lot more abstraction than the context api. For example, state persistance abstraction using Immer and many other. In other words, it makes the state management a lot more easier.
It works quite similar to context api. First you need to create a store which acts as the single source of truth for states. Then you need to create slices in which you pass an initial state of states, the reducer function and then you need to pass reducers to store so that the store can initialise itself.
The store initialise itself by calling each reducers, passing them undefined state and then reducers fallbacks to default initial state and returns it. This is how store gets initialised.
then you need to need to export each reducer separately also so that you can use them in components. Like context api, you need to pass wrap the whole app in provider and you need to pass it the store prop which takes created store as a value.
Then you can mutate the state using reducer by calling them inside dispatcher in whichever component you want.
You may also fetch the current state using selector like:
`const stateData = useSelector(state => state.data)`

Redux toolkit do not support async fucntion by default. Reducer must be a pure function which should not have any async functionality. To implement async functionality, redux toolkit provides createAsyncThunk function which works with extraReducer in slices.
extraReducers are different from normal reducers and they listens to other reducers of diffenent slices or createAsyncThunk functions and they act as an eventlisteners for these reducers and createAsyncThunk function using the builder callback that is passed to them.

## .env

When you create react project with react app, you need to start every env key with `REACT_APP_` like `REACT_APP_KEY=*` and you can access that key inside the app using process.env
But when you create a react app using vite then you need to replace REACT_APP_ with VITE_ and you can access it using import.meta.env

## main tag of html

The `<main>` HTML element represents the dominant or primary content of the `<body>` of a document or application. Its content area should consist of content that is directly related to, or expands upon, the central topic of a page or the central functionality of an application.

Key Characteristics & Best Practices
Uniqueness: The content inside a `<main>` element should be unique to the document. It should not contain content that is repeated across multiple pages, such as sidebars, navigation links, copyright notices, site logos, or search forms (unless the search form is the main function of the page, like a search results page).

Uniqueness Limit: There must be only one visible `<main>` element per document. It must not be a descendant of an `<article>`, `<aside>`, `<footer>`, `<header>`, or `<nav>` element.

Accessibility (Landmark Role): Screen readers and other assistive technologies use `<main>` as a primary landmark to help users quickly jump straight to the core content of the page, bypassing repetitive navigation menus.

React router dom link tag takes relative path (path relative to current url) in `to` arguement. Same goes for navlink tag.
Use Navigate from react router dom to redirect user on a route because link tag needs user interaction (ie click) to redirect user on some route but navigate doesnt need user interaction.

In react, if a state is associated with a component and it changes, then the whole component will be remounted. Thats why it is a best practice to make separate components as much as possible so that a minimal part should re-render.

Linting is the automated process of scanning your source code for programmatic errors, stylistic bugs, suspicious constructs, and deviations from formatting standards before the code is even run or built. A linter acts like an automated code reviewer, catching typos (like referencing an undeclared variable), unused imports, and syntax anti-patterns instantly as you type.

ESLint is the most popular open-source JavaScript linter. It statically analyzes your code to spot syntax issues and bad practices in both vanilla JavaScript and frameworks like React. Unlike traditional formatters (such as Prettier, which only care about where spaces, commas, and line breaks go), ESLint deeply inspects your code's logic and architecture.

Lint rules are the specific guidelines and constraints that ESLint enforces. Each rule targets a distinct type of issue or style choice.

A stateless API is an architectural design where the server does not store any session state or client context between incoming requests. Every single request made by a client must contain all the necessary information, authentication credentials, and parameters required for the server to understand.

How register Works Under the Hood
When you call register("email", { ...options }), it returns an object containing a set of event listeners, ref callbacks, and properties for that specific input field. For an email input, it typically returns an object that looks like this:

Why It Is Being Spread (...register(...))
Spreading the object ({...register("email")}) unpacks all of those returned properties and injects them directly into the `<Input/>` component as props.

Without spreading, React Hook Form wouldn't have a reference to the input element (ref), wouldn't capture its value, and wouldn't be able to listen to changes. Spreading wires up the input so that when handleSubmit(login) runs, it can automatically collect the values from "email" and "password" and pass them into your login handler function without you needing to manage useState hooks or onChange handlers manually for every single field.

Direct DOM Access (ref): When you pass {...register("email")} into the `<Input/>` component, React Hook Form attaches a native JavaScript ref directly to the underlying HTML `<input />` element. This lets it read the value straight from the DOM whenever the form is submitted, bypassing React state entirely during typing.

Internal Subscription Management: React Hook Form maintains its own internal JavaScript object (a ref behind the scenes) to track values, errors, and touched fields. When you type, native DOM events (input or change) fire on the input element. React Hook Form listens to these events via event listeners attached during registration, updating its internal registry without calling useState or causing the parent Login component to re-render.

Passing the Ref Down: For this to work cleanly across component boundaries, the custom `<Input/>` component must use React's forwardRef API. This allows the parent's register function to reach inside the child component and grab the actual native HTML `<input>` DOM node.

28.613420, 77.208310
28.614120, 77.209740
28.613080, 77.208920
28.614560, 77.209180
28.613770, 77.210010
28.614310, 77.208560
28.613250, 77.209430
28.614720, 77.209870
28.613910, 77.208140
28.614030, 77.209020

// where required bandwidth should be below 300 and max latency should be below 50

//react nodes from component reading

//js 101

In a traditional HTML website, clicking an `<a>` tag triggers a full page refresh, which forces the browser to re-request the HTML, CSS, and JavaScript from the server, resetting the application's state. `<Link>` intercepts this click event and uses HTML5 History API to change the URL smoothly without a reload.
