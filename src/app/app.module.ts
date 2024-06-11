import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { CookieDetail, CookieItem, NgxCookieConsentModule } from '@localia/ngx-cookie-consent';
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';
import { AppComponent } from './app.component';

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
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterModule.forRoot([{ path: '', component: AppComponent }]),
    NgxCookieConsentModule.forRoot(cookieConfig),
    NgxGoogleAnalyticsModule.forRoot('G-FQW4MXXGBY')
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
