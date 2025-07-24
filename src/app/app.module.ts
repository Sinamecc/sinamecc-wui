import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { Angulartics2Module } from 'angulartics2';

import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { ReportModule } from '@app/report/report.module';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { RouteReusableStrategy } from '@app/route-reusable-strategy';
import { RouteService } from '@app/route.service';
import { MitigationActionsModule } from '@app/mitigation-actions/mitigation-actions.module';
import { AdminModule } from '@app/admin/admin.module';
import { ErrorComponent } from '@app/error/error.component';
import { PpcnModule } from '@app/ppcn/ppcn.module';
import { MccrRegistriesModule } from '@app/mccr/mccr-registries/mccr-registries.module';
import { MccrPocModule } from '@app/mccr/mccr-poc/mccr-poc.module';
import { AdaptationActionsModule } from './adaptation-actions/adaptation-actions.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsCR from '@angular/common/locales/es-CR';

import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Languages } from './i18n/languages';

registerLocaleData(localeEsCR);

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [AppComponent, ErrorComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production,
    }),
    FormsModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    HomeModule,
    SharedModule,
    ReportModule,
    MitigationActionsModule,
    ShellModule,
    AuthModule,
    AdminModule,
    PpcnModule,
    MccrRegistriesModule,
    MccrPocModule,
    AdaptationActionsModule,
    Angulartics2Module.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    RouteService,
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
    {
      provide: LOCALE_ID,
      useValue: Languages.SPANISH,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: Languages.SPANISH,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: DATE_FORMATS,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
