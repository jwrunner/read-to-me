# Service Worker Notes
Angular automatically manages and adds Service worker for production builds.

## Setup History
Consulted [Angular Service Worker docs](https://angular.io/guide/service-worker-getting-started) and https://dzone.com/articles/developing-pwa-using-angular-7 for initial setup.

## Safari + Firebase Upload + Service Worker Bug Fix
Due to a bug on Safari with Firebase uploads when using service workers, the `dist/ngsw-worker.js` file must be patched after being built and before being published. See https://github.com/angular/angular/issues/23244 for more information on fixing the bug.

## To Test the Service Worker locally
1. `ng build --prod`
2. `http-server -p 8080 -c-1 dist` (requires http-server installed globally)

## Learn More
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
https://developers.google.com/web/tools/workbox/modules/

## How to enhance Angular Service Worker (NGSW)
Add a sw-custom.js file and import it alongside ngsw-worker.js in a new script file and point Angular to this as described in http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/