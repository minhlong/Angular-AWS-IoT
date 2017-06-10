import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// App modules
import { MainViewModule } from './modules/main-view/main-view.module';
import { LoginModule } from './modules/login/login.module';
import { LayoutsModule } from './modules/layouts/layouts.module';

// App Services
import { UserLoginService, CognitoUtil } from './service/cognito.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular modules
    BrowserModule,

    // Layout
    LayoutsModule,

    // Page
    LoginModule,
    MainViewModule,

    // Configure Routes
    RouterModule.forRoot(ROUTES, { useHash: true })

  ],
  providers: [CognitoUtil, UserLoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
