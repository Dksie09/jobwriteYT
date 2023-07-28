# Jobwrite

## Getting Started

To start using, install everything using:

```bash

$ npm install
$ npm start

```

Then open your browser and go to: [http://localhost:3000](http://localhost:3000)

## Appwrite

Head over to [appwrite.io](https://appwrite.io) to get started

- Change the file `.env.example` to `.env`
- Update the environment variables with your **Appwrite Cloud Endpoint** and **Project ID**

## Libs/Tools

- [Create React App](https://create-react-app.dev/) for setting up the development environment. This template was created using `$ npx create-react-app my-app`

- [react-router-dom](https://www.npmjs.com/package/react-router-dom) for client-side routing.

- [pink](https://github.com/appwrite/pink) for cohesive and visually pleasing user interface, backed up with [tailwind](https://tailwindcss.com/docs/guides/create-react-app)

- [uuid](https://www.npmjs.com/package/uuid) for generating unique document IDs.

## Breaking down `src`

- appwrite
  - appwrite.js: file for interacting with the Appwrite API.
- components
  - assets
    - image.png: image added in the landing page
  - AllJobs.jsx: Display all the jobs along with filter options.
  - CompanyCard.jsx: Representing a card for displaying company information.
  - Dashboard.jsx: Representing dashboard that browses matching jobs.
  - Failure.jsx: User is redirected here, when failed to authenticate
  - FalseSession.jsx: for handling false sessions.
  - Feedback.jsx: for collecting user feedback.
  - Header.jsx: Representing the application header.
  - HomePage.jsx: user is redirected here after signup, gets/ updates user's github information.
  - Landing.jsx: first page of the app.
  - Navbar.jsx: a side navigation bar.
  - Success.jsx: User is redirected here, when successfully authenticated
- App.js: The main JavaScript file containing all the routing logic.
- App.test.js: Test file for testing the functionality of the App component.
- index.css: CSS file for styling the root HTML file (index.html).
- index.js: The entry point JavaScript file that renders the app into the DOM.
- reportWebVitals.js: A file for reporting web performance metrics.
- setupTests.js: A file for setting up testing frameworks and configurations.

### Reach out

> Im always open to suggestions and such, so feel free to make an `issue` or `PR` if you have something you want to add or change. You can refer to the [contributing document](https://duckshie.notion.site/Contributing-356ae14d96e143548474a2ad10978412?pvs=4) for more information on how to contribute.

### Social Media

- [Twitter](https://twitter.com/duckwhocodes)
- [Github](https://github.com/Dksie09)
- [Email](mailto:dakshiegoel@gmail.com)

### License

> See [LICENSE](LICENSE) for more information.
