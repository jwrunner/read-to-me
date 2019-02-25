# Service Worker Notes
Service worker automatically gets added for production builds

## Setup History
Consulted [Angular Service Worker docs](https://angular.io/guide/service-worker-getting-started) and https://dzone.com/articles/developing-pwa-using-angular-7 for initial setup.

## To Test the Service Worker
1. `ng build --prod`
2. `http-server -p 8080 -c-1 dist`

## Learn More
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
https://developers.google.com/web/tools/workbox/modules/

## How to enhance Angular Service Worker (NGSW)
Add a sw-custom.js file and import it alongside ngsw-worker.js in a new script file and point Angular to this as described in http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/