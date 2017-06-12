import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// App modules
import { LayoutsModule } from './modules/layouts/layouts.module';

// App components
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout.component';
import { MainViewComponent } from './components/main-view/main-view.component';

// App Services
import { UserLoginService, CognitoUtil } from './services/cognito.service';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    // Angular modules
    BrowserModule,
    HttpModule,
    FormsModule,

    // Layout
    LayoutsModule,

    // Configure Routes
    RouterModule.forRoot(ROUTES, { useHash: true })

  ],
  providers: [CognitoUtil, UserLoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
