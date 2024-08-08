# Pokedex Search Interface


## Table of Contents
- [Project Setup](#project-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Compiling LESS](#compiling-less)
  - [Watching LESS Files](#watching-less-files)
  - [Linting](#linting)
  - [Building the Application](#building-the-application)
  - [Running the Application Locally](#running-the-application-locally)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [API](#api)
- [Project URL](#project-url)
- [License](#license)
- [Author](#author)


## Project Setup

### Prerequisites
- Node.js (version 20.x or later)
- Yarn package manager

### Installation
To set up the project, first ensure you have Node.js and Yarn installed. Then, run:
```sh
yarn install
```

#### Compiling LESS
To compile LESS files into CSS, run:

```sh
yarn less
```

#### Watching LESS Files
To watch for changes in LESS files and compile them automatically, run:
```sh
yarn less:watch
```

#### Linting
To run ESLint and check for syntax and style issues in your JavaScript files, use:

```sh
npx eslint src/js
```

#### Building the Application
To build the application (lint JavaScript and compile LESS files), run:

```sh
yarn build
```

#### Running the Application Locally
To run the application locally, use:

```sh
yarn dev
```
The script will start the Vite development server. Check the console output for the URL to open in your browser.


## Usage
This application allows users to search and filter different Pokemon using various criteria such as type, color, and gender.


## Technologies Used
- Language: Javascript
- Styling: LESS
- Linting: ESLint (Airbnb Base Configuration)
- API: [PokeAPI](https://pokeapi.co/)
- Build Tools: Vite, Yarn


## API
This application uses the [PokeAPI](https://pokeapi.co/) to fetch data about Pokemon. Below are some of the key endpoints used:

- **GET /type**: Fetches the list of Pokemon types.
- **GET /type/{type-id}**: Fetches the Pokemon of a specific type.
- **GET /pokemon-color**: Fetches the list of Pokemon colors.
- **GET /pokemon-color/{color-id}**: Fetches the Pokemon of a specific color.
- **GET /gender**: Fetches the list of Pokemon genders.
- **GET /gender/{gender-id}**: Fetches the Pokemon of a specific gender.
- **GET /pokedex/national**: Fetches the national Pokedex entries.


## Project URL
You can view the live project [here](https://pokedex-frontend-topaz.vercel.app/).

## Author
Pol Reig
[polreigbroto@gmail.com](polreigbroto@gmail.com)


## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License - see the LICENSE file for details.