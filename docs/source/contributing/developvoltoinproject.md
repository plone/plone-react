Contributing to Volto can be done by setting up Volto with

```js
clone https://github.com/plone/volto.git volto_coredev
cd volto_coredev
yarn start
````

Sometimes it's necessary to develop in a project. For example the configuration is extended and you need to check how it can be used and overridden in a project.

This is a setup for a vanilla project that uses Volto at branch 'somenewfeature'.

## Set up project with Volto at a specific branch

Create vanilla Volto project

```bash
yo @plone/volto  --skip-addons --skip-workspaces
```

Add mrs.developer

```bash
yarn add mrs-developer -WD
```

Create 'mrs.developer.json' and add the following content with the branch you want to work on.

```json
{
  "volto": {
    "package": "@plone/volto",
    "url": "git@github.com:plone/volto.git",
    "branch": "somenewfeature",
    "path": "src"
  }
}
```

Add a new script to your package.json

```json
"develop:volto": "missdev --config=jsconfig.json --output=voltodevelopment"
````

run

```bash
yarn develop:volto
```

add to your package.json

```json
"private": true,
"workspaces": [
  "src/voltodevelopment/volto"
],
```

install development Volto via

```bash
cd ./src/voltodevelopment/volto
yarn install
```

Add to your jsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@plone/volto": [
        "voltodevelopment/volto"
      ]
    },
    "baseUrl": "src"
  }
}
````

Upgrade moduleNameMapper in package.json

```json
{
  "moduleNameMapper": {
    "@plone/volto/babel": "<rootDir>/src/voltodevelopment/volto/babel",
    "@plone/volto/(.*)$": "<rootDir>/src/voltodevelopment/volto/src/$1",
  }
}
```

Run 

```bash
yarn start
```

Happy coding! And thanks for your contribution!
