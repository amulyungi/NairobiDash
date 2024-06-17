import { Direction, BidiModule } from '@angular/cdk/bidi';
import { Component, Inject, Renderer2 } from '@angular/core';
import { AuthService, DirectionService, InConfiguration } from '@core';
import { ConfigService } from '@config';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { PageLoaderComponent } from 'app/layout/page-loader/page-loader.component';
import { NgAngularLoaderModule } from 'ng-angular-loader';
import { ToastrMessagesService } from '@core/service/toastr-messages.service';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: [],
    standalone: true,
    imports: [BidiModule, RouterOutlet, PageLoaderComponent, NgAngularLoaderModule],
})

export class AuthLayoutComponent{
    direction!: Direction;
    public config!: InConfiguration;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private directoryService: DirectionService,
        private configService: ConfigService,
        private renderer: Renderer2,
        public authService: AuthService,
        public toastr: ToastrMessagesService
    ) {
        // super();
        this.config = this.configService.configData;
        // this.subs.sink = this.directoryService.currentData.subscribe((currentData) => {            
            this.directoryService.currentData.subscribe((currentData) => {            
            if (currentData) {
                this.direction = currentData === 'ltr' ? 'ltr' : 'rtl';
            } else {
                if (localStorage.getItem('isRtl')) {
                    if (localStorage.getItem('isRtl') === 'true') {
                        this.direction = 'rtl';
                    } else if (localStorage.getItem('isRtl') === 'false') {
                        this.direction = 'ltr';
                    }
                } else {
                    if (this.config) {
                        if (this.config.layout.rtl === true) {
                            this.direction = 'rtl';
                            localStorage.setItem('isRtl', 'true');
                        } else {
                            this.direction = 'ltr';
                            localStorage.setItem('isRtl', 'false');
                        }
                    }
                }
            }
        });

        // set theme on startup
        if (localStorage.getItem('theme')) {
            this.renderer.removeClass(this.document.body, this.config.layout.variant);
            this.renderer.addClass(
                this.document.body,
                localStorage.getItem('theme') as string
            );
        } else {
            this.renderer.addClass(this.document.body, this.config.layout.variant);
        }
    }
}
