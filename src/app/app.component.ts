import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private translocoService: TranslocoService) {

    }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
        ).subscribe(() => {
            let activeLang = this.translocoService.getActiveLang()

            this.setActiveRouteTitle(activeLang)
        });
        this.translocoService.langChanges$.subscribe((activeLang) => {
            this.setActiveRouteTitle(activeLang)
        });

    }

    setActiveRouteTitle(activeLang) {
        const rt = this.getChild(this.activatedRoute);
        rt.data.subscribe(data => {
            if (data.title && data.title[activeLang]) {
                this.titleService.setTitle(data.title[activeLang] + " | SooMeet")
            }
        });

    }

    getChild(activatedRoute: ActivatedRoute) {
        if (activatedRoute.firstChild) {
            return this.getChild(activatedRoute.firstChild);
        } else {
            return activatedRoute;
        }

    }
}
