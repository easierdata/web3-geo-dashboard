[![web3GeoDashboardDeploy](https://github.com/easierdata/web3-geo-dashboard/actions/workflows/main_branch.yml/badge.svg)](https://github.com/easierdata/web3-geo-dashboard/actions/workflows/main_branch.yml)
![Formatting](https://img.shields.io/badge/formatting-prettier-56b3b4.svg)
![Linting](https://img.shields.io/badge/linting-eslint-4c32bf.svg)
![UnitTesting](https://img.shields.io/badge/unit%20testing-vitest-ffce27.svg)
[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://badges.mit-license.org)

## Prerequisites

An access token is needed to access the Mapbox web service resources with scope permissions enabled for `styles:tiles` and `styles:read`.

1. Create a `.env` file in the project root with the following variables:

```shell
VITE_MAPBOX_TOKEN=<access token>
```

> NOTE: Details on creating tokens can be found [here](https://docs.mapbox.com/api/accounts/tokens/).

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```shell
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```shell
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Contributing

### Step 1

- **Option 1**

  - 🍴 Fork this repo!

- **Option 2**

  - 👯 Clone to your local machine using:
    `git clone https://github.com/easierdata/web3-geo-dashboard`

### Step 2

- **HACK AWAY!** 🔨🔨🔨

### Step 3

- 🔃 Create a new pull request using:
  `<a href="https://github.com/easierdata/web3-geo-dashboard/compare" rel="noopener noreferrer" target="_blank">`
  `https://github.com/easierdata/web3-geo-dashboard/compare</a>`.

## Pre-commit Hooks

When running `npm install` the `prepare` script runs to install husky pre-commit hooks into `./husky/pre-commit`. Currently the hook automatically formats the code using prettier, then checks the code for linting issues. If there is a linting issue, it doesn't try to fix it. Instead, the commit fails with an error message.

If you want to make sure the pre-commit hooks are working, do the following

1. Stage some badly linted/formatted code
2. run `npx lint-staged`
   If there were only formatting issues, the hook will format your code and silently add it to the commit. If there were linting issues, the commit should fail.

## Testing and Coverage

Tests are located in `/test` and are using Vitetest. Please write at least one test per component. This way, we can do broad refactorings and find out very quickly what is broken.

```shell
npm run test
npm run coverage
```
