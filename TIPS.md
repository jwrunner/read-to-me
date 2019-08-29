# Observable Tips

Instead of subscribing to the User observable consider using async-await to access the data from the auth.getUser() promise. Here's a couple examples to use and extract the data.

async function() {
    const user = await this.auth.getUser();
    const { uid } = await this.auth.getUser();
    const { displayName } = await this.auth.getUser();
}

const user = await this.auth.getUser();
if (!user) {
    DO SOMETHING!
}

# Package Optimizations

## Keep packages up-to-date and clean
Run `npm-check`

## Webpack Bundle Analyzer
From https://angularfirebase.com/lessons/pwa-performance-optimization-angular/
1. `npm install webpack-bundle-analyzer --save-dev`
2. `ng build --prod --stats-json`
3. `npm run analyzer`

## Source Map Explorer
From https://alligator.io/angular/bundle-size/
1. `npm install source-map-explorer --save-dev`
2. `ng build --prod --source-map`
3. Add `"sourcemap-explorer": "source-map-explorer dist/main.b0a5766917f050b67ff2.js",` to package.json and run `npm run sourcemap-explorer`

## Other
Check out https://www.webpagetest.org/result/181107_28_059607ae60c4b5263ae9db05c489fe16/

## Optimizations ToDo
- FontAwesome offline icons