# About
<p align='center'>
<img src='/Screen Shot 2020-04-22 at 7.46.05 PM.png' width='600' alt='Build errors'>
</p>
Carmend is a web application built to help customers to find local body shops to fix their cars. It uses Google Maps API to match customers with local car shops with in 10 miles of distance. Car shops who signed up can provide diagnosis and quote for a specific job. Carmend helps car owners to find the best deals without steping out of their house.

# Demo Video
https://drive.google.com/file/d/1d_adhsSM6AyhBN_5CTOoCbqKEWxGCu6h/view?usp=sharing

# Try it Yourself
http://carmend.herokuapp.com

# React Installation and Operation

Create React apps with no build configuration.

- [Creating an App](#creating-an-app) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.

Create React App works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/facebook/create-react-app/issues/new).<br>
If you have questions or need help, please ask in our [Spectrum](https://spectrum.chat/create-react-app) community.

## Quick Overview

```sh
npx create-react-app my-app
cd my-app
npm start
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `npm run build`.

<p align='center'>
<img src='https://cdn.jsdelivr.net/gh/facebook/create-react-app@27b42ac7efa018f2541153ab30d63180f5fa39e0/screencast.svg' width='600' alt='npm start'>
</p>

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

Create a project, and you’re good to go.

## Creating an App

**You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

To create a new app, you may choose one of the following methods:

### npx

```sh
npx create-react-app my-app
```

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) is a package runner tool that comes with npm 5.2+ and higher, see [instructions for older npm versions](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f))_

### npm

```sh
npm init react-app my-app
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```sh
yarn create react-app my-app
```

_`yarn create` is available in Yarn 0.25+_

It will create a directory called `my-app` inside the current folder.<br>
Inside that directory, it will generate the initial project structure and install the transitive dependencies:

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
```

No configuration or complicated folder structures, only the files you need to build your app.<br>
Once the installation is done, you can open your project folder:

```sh
cd my-app
```

Inside the newly created project, you can run some built-in commands:

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

<p align='center'>
<img src='https://cdn.jsdelivr.net/gh/marionebl/create-react-app@9f6282671c54f0874afd37a72f6689727b562498/screencast-error.svg' width='600' alt='Build errors'>
</p>

### `npm test` or `yarn test`

Runs the test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing.](https://facebook.github.io/create-react-app/docs/running-tests)

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

You can find detailed instructions on using Create React App and many tips in [its documentation](https://facebook.github.io/create-react-app/).

# Firebase Configuration
    1. Create a Google Firebase project, enable authentication, realtime database, storage, and cloud function.
    2. Push the function in folder /function to Firebase cloud function. This cloud function works returns a url for the image once it is uploaded to storage. 
    3. Set up Google cloud to allow Firebase to send request to Google cloud. 
       (Note: Although they both are Google's product, you need to give Firebase permission in Google Cloud).
    4. Bonus: If you want you own Google Maps API key, you can get it from Google Maps platform website and replace the key in the code.
    
-----

# Github Link 
https://github.com/josephzhaoballer/CARMEND-1


# Building Carmend on Mac
1. Download Carmend zip file from github.
2. Save zip file on desktop.
3. Unzip the zip file.
4. Open a terminal, type the command "cd" and drag the folder to the terminal. 
    - [![Screen-Shot-2019-11-23-at-12-16-22-AM.png](https://i.postimg.cc/PJb3nk67/Screen-Shot-2019-11-23-at-12-16-22-AM.png)](https://postimg.cc/7J6MSjr1)
5. Install the node modules by typing the command "npm install."
6. After installation of the node modules, type the command "npm start."
7. A new webpage with a local host address will pop up in a browser. 

