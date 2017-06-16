import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { BlankComponent } from './blank.component';
import { BasicComponent } from './basic.component';

import { NavigationModule } from './navigation/navigation.module';
import { TopnavbarModule } from './topnavbar/topnavbar.module';
import { FooterModule } from './footer/footer.module';

@NgModule({
    declarations: [BlankComponent, BasicComponent],
    imports: [BrowserModule, RouterModule, NavigationModule, TopnavbarModule, FooterModule],
    exports: [BlankComponent, BasicComponent]
})

export class LayoutsModule { }
