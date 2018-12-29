# Service Worker Notes
Service worker automatically gets added for production builds

## Setup History
Consulted [Angular Service Worker docs](https://angular.io/guide/service-worker-getting-started) and https://dzone.com/articles/developing-pwa-using-angular-7 for initial setup.

## To Test the Service Worker
1. `ng build --prod`
2. `http-server -p 8080 -c-1 dist`

## TODO
- Check https://fonts.googleapis.com/css?family=Google+Sans:300,400,500 in shell.scss and see if needs put into index.html for service worker cache to be effective.
1. Learn how to cache audio files that have been played using https://angular.io/guide/service-worker-config
2. Learn how to check if a resource is available offline (to denote which audio files are playable)
3. Read https://stackoverflow.com/questions/45996192/angular-service-worker-with-fcm-push-notification/46171748#46171748 for avoiding sw missing error on local (create empty service worker on local?)
4. Learn how to send and display push notifications

## Learn More
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
https://developers.google.com/web/tools/workbox/modules/

## How to enhance Angular Service Worker (NGSW)
Add a sw-custom.js file and import it alongside ngsw-worker.js in a new script file and point Angular to this as described in http://jakubcodes.pl/2018/06/13/enhancing-angular-ngsw/