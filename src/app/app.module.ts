import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { StoreDevtoolsModule } from '@ngrx/store-devtools'; // Have to remove on production mod

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';

// Modules
import { LayoutsModule } from './modules/layouts/layouts.module';
// Services
import { providers } from './services/index';

// Redux - Actions
import { actions } from './store/actions/index';
// Redux - Effects
import { AuthEffect } from './store/effects/auth.effect';
// Redux - Reducer
import { reducer } from './store/reducers/index';

// Components
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout.component';
import { MainViewComponent } from './components/main-view/main-view.component';
import { ApiComponent } from './components/api/api.component';
import { IotProtocolComponent } from './components/iot-protocol/iot-protocol.component';
import { IotThingInfoComponent } from './components/iot-thing-info/iot-thing-info.component';
import { IotFlowComponent } from './components/iot-flow/iot-flow.component';
import { IotEmulatorComponent } from './components/iot-emulator/iot-emulator.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    LoginComponent,
    LogoutComponent,
    ApiComponent,
    IotProtocolComponent,
    IotThingInfoComponent,
    IotFlowComponent,
    IotEmulatorComponent
  ],
  imports: [
    // Angular modules
    BrowserModule,
    HttpModule,
    FormsModule,

    // Layout
    LayoutsModule,

    // Routes
    RouterModule.forRoot(ROUTES, { useHash: true }),

    // Redux
    StoreModule.provideStore(reducer),
    EffectsModule.run(AuthEffect),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 5
    })
  ],
  providers: [
    providers(), // Services
    actions(), // Redux - Action
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
