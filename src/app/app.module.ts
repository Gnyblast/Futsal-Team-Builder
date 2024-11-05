import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CoolGoogleButtonComponent } from '@angular-cool/social-login-buttons';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { CookieDetail, CookieItem, NgxCookieConsentModule } from '@localia/ngx-cookie-consent';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { LoginComponent } from './views/login/login.component';
import { NavbarComponent } from "./views/navbar/navbar.component";
import { RegisterComponent } from './views/register/register.component';


const cookieConfig = {
  showCookieDetails: false,
  showLanguageSwitcher: false,
  showFunctionalCookies: true,
  showMarketingCookies: false,
  showOtherTools: false,
  functionalCookies: [{
    name: "Google Analytics",
    key: "ga",
    cookies: [{
      name: "Google Analytics",
      description: "Cookies will be collected for google analytics."
    } as CookieDetail],
    description: "Cookies will be collected for google analytics.",
    privacyPolicyUrl: ""
  } as CookieItem],
  customClass: "custombanner",
  customOpenerClass: "opener",
  cookiePrefix: "logeks"
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([{ path: '', component: AppComponent }]),
    NgxCookieConsentModule.forRoot(cookieConfig),
    NgxGoogleAnalyticsModule.forRoot('G-FQW4MXXGBY'),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    MaterialModule,
    CoolGoogleButtonComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
