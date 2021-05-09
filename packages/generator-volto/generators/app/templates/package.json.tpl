{
  "name": "<%= projectName %>",
  "description": "<%= projectDescription %>",
  "license": "MIT",
  "version": "1.0.0",
  "scripts": {
    "start": "razzle start",
     "prepare:husky": "husky install && find src/addons/ -type f -execdir git config core.hooksPath ../../../.husky {} \\;",
    "postinstall": "yarn omelette && yarn patches && [ -d .git/ ] && yarn prepare:husky || true",
    "omelette": "ln -sf node_modules/@plone/volto/ omelette",
    "patches": "/bin/bash patches/patchit.sh > /dev/null 2>&1 ||true",
    "build": "razzle build",
    "test": "razzle test --env=jest-environment-jsdom-sixteen --passWithNoTests",
    "start:prod": "NODE_ENV=production node build/server.js",
    "i18n": "NODE_ENV=production node node_modules/@plone/volto/src/i18n.js",
    "develop": "missdev --config=jsconfig.json --output=addons --fetch-https"
  },
  "private": <%- private %>,
  "workspaces": <%- workspaces %>,
  "addons": <%- addons %>,
  "jest": {
    "modulePathIgnorePatterns": [
      "api"
    ],
    "transform": {
      "^.+\\.js(x)?$": "babel-jest",
      "^.+\\.css$": "jest-css-modules",
      "^.+\\.scss$": "jest-css-modules",
      "^.+\\.(png)$": "jest-file",
      "^.+\\.(jpg)$": "jest-file",
      "^.+\\.(svg)$": "./node_modules/@plone/volto/jest-svgsystem-transform.js"
    },
    "transformIgnorePatterns": [
      "/node_modules/(?!@plone/volto).+\\.js$"
    ],
    "moduleNameMapper": {
      "@plone/volto/babel": "<rootDir>/node_modules/@plone/volto/babel",
      "@plone/volto/(.*)$": "<rootDir>/node_modules/@plone/volto/src/$1",
      "load-volto-addons": "<rootDir>/node_modules/@plone/volto/jest-addons-loader.js",
      "@package/(.*)$": "<rootDir>/src/$1",
      "~/(.*)$": "<rootDir>/src/$1"
    },
    "coverageThreshold": {
      "global": {
        "branches": 10,
        "functions": 10,
        "lines": 10,
        "statements": 10
      }
    },
    "setupFiles": [
      "@plone/volto/test-setup-globals.js",
      "@plone/volto/test-setup-config.js"
    ],
    "globals": {
      "__DEV__": true
    }
  },
  "prettier": {
    "trailingComma": "all",
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.overrides",
        "options": {
          "parser": "less"
        }
      }
    ]
  },
    "lint-staged": {
    "src/**/*.{js,jsx,ts,tsx,json}": [
      "npx eslint --max-warnings=0 --fix",
      "npx prettier --single-quote --write",
      "razzle test --env=jest-environment-jsdom-sixteen --ci --bail --findRelatedTests --passWithNoTests"
    ],
    "src/**/*.{jsx}": [
      "NODE_ENV=production node node_modules/@plone/volto/src/i18n.js"
    ],
    "theme/**/*.{css,less}": [
      "npx stylelint --fix"
    ],
    "src/**/*.{css,less}": [
      "npx stylelint --fix"
    ],
    "theme/**/*.overrides": [
      "npx stylelint --fix --syntax less"
    ],
    "src/**/*.overrides": [
      "npx stylelint --fix --syntax less"
    ]
  },
  "stylelint": {
    "extends": [
      "stylelint-config-idiomatic-order"
    ],
    "plugins": [
      "stylelint-prettier"
    ],
    "rules": {
      "prettier/prettier": true,
      "rule-empty-line-before": [
        "always-multi-line",
        {
          "except": [
            "first-nested"
          ],
          "ignore": [
            "after-comment"
          ]
        }
      ]
    },
    "ignoreFiles": "theme/themes/default/**/*.overrides"
  },
    "browserslist": [
    ">1%",
    "last 4 versions",
    "Firefox ESR",
    "not ie 11",
    "not dead"
  ],
  "engines": {
    "node": "^10 || ^12 || ^14"
  },
  "dependencies": <%- dependencies %>,
  "devDependencies": {
    "eslint-plugin-prettier": "3.1.3",
    "prettier": "2.0.5",
    "stylelint": "13.3.3",
    "stylelint-config-idiomatic-order": "8.1.0",
    "stylelint-config-prettier": "8.0.1",
    "stylelint-prettier": "1.1.2"
  }
}
