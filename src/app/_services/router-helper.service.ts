// tslint:disable:max-line-length
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { mapTo, map, filter, pluck, distinctUntilChanged, take } from 'rxjs/operators';

import assign from 'lodash/assign';

export class RouterParams {
    bookId: string;
    chapterId: string;
    // page: number;

    constructor(allParams: any) {
        assign(this, allParams);
    }
}

@Injectable()
export class RouterHelperService {
    // TODO: Ask David to explain routerParamsStatic
    // private routerParamsStatic: RouterParams;
    private _routerParams: BehaviorSubject<RouterParams> = new BehaviorSubject<RouterParams>(new RouterParams({}));
    routerParams = this._routerParams.asObservable();

    bookId: Observable<string> = this._routerParams.pipe(pluck<RouterParams, string>('bookId'), filter(bookId => !!bookId), distinctUntilChanged());
    chapterId: Observable<string> = this._routerParams.pipe(pluck<RouterParams, string>('chapterId'), filter(chapterId => !!chapterId), distinctUntilChanged());

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            mapTo(activatedRoute),
            map(route => {
                const allParams = {};
                while (route.firstChild) {
                    route = route.firstChild;
                    assign(allParams, route.snapshot.params);
                }
                return allParams;
            })
        ).subscribe(allParams => {
            const params = new RouterParams(allParams);
            this._routerParams.next(params);
            // this.routerParamsStatic = params;
        });
    }

    getBookId(): Promise<any> {
        return this.bookId.pipe(take(1)).toPromise();
    }

    getChapterId(): Promise<any> {
        return this.chapterId.pipe(take(1)).toPromise();
    }
}
