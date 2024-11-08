import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { CoolGoogleButtonComponent } from "@angular-cool/social-login-buttons";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getFirestore, provideFirestore } from "@angular/fire/firestore";
import { CookieDetail, CookieItem, NgxCookieConsentModule } from "@localia/ngx-cookie-consent";
import { NgxGoogleAnalyticsModule } from "ngx-google-analytics";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { DrawerComponent } from "./components/drawer/drawer.component";
import { LoginComponent } from "./components/login/login.component";
import { MainComponent } from "./components/main/main.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RegisterComponent } from "./components/register/register.component";
import { ValidateNameDirective } from "./directives/validate-name.directive";
import { MaterialModule } from "./material.module";

const cookieConfig = {
  showCookieDetails: false,
  showLanguageSwitcher: false,
  showFunctionalCookies: true,
  showMarketingCookies: false,
  showOtherTools: false,
  functionalCookies: [
    {
      name: "Google Analytics",
      key: "ga",
      cookies: [
        {
          name: "Google Analytics",
          description: "Cookies will be collected for google analytics.",
        } as CookieDetail,
      ],
      description: "Cookies will be collected for google analytics.",
      privacyPolicyUrl: "",
    } as CookieItem,
  ],
  customClass: "custombanner",
  customOpenerClass: "opener",
  cookiePrefix: "logeks",
  openerPosition: "right-bottom" as "right-bottom",
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    DrawerComponent,
    ValidateNameDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([{path: "", component: AppComponent}]),
    NgxCookieConsentModule.forRoot(cookieConfig),
    NgxGoogleAnalyticsModule.forRoot("G-FQW4MXXGBY"),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    MaterialModule,
    CoolGoogleButtonComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
