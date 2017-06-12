import { Component, AfterViewInit, OnDestroy } from '@angular/core';

declare var jQuery: any;

@Component({
    selector: 'app-blank',
    templateUrl: 'blank.template.html'
})
export class BlankComponent implements AfterViewInit, OnDestroy {

    ngAfterViewInit() {
        jQuery('body').addClass('gray-bg');
    }

    ngOnDestroy() {
        jQuery('body').removeClass('gray-bg');
    }
}
