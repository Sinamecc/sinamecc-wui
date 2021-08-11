import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { environment } from '@env/environment';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { ReportModule } from '@app/report/report.module';
import { AuthModule } from '@app/auth';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { S3Service } from '@app/s3.service';
import { RouteReuseStrategy } from '@angular/router';
import { RouteReusableStrategy } from '@app/route-reusable-strategy';
import { RouteService } from '@app/route.service';
import { MitigationActionsModule } from '@app/mitigation-actions/mitigation-actions.module';
import { AdminModule } from '@app/admin/admin.module';
import { ErrorComponent } from '@app/error/error.component';
import { PpcnModule } from '@app/ppcn/ppcn.module';
import { MccrRegistriesModule } from '@app/mccr/mccr-registries/mccr-registries.module';
import { MccrPocModule } from '@app/mccr/mccr-poc/mccr-poc.module';

@NgModule({
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule,
    MaterialModule,
    CoreModule,
    SharedModule,
    ReportModule,
    MitigationActionsModule,
    ShellModule,
    HomeModule,
    AuthModule,
    AdminModule,
    PpcnModule,
    MccrRegistriesModule,
    MccrPocModule,
    Angulartics2Module.forRoot(),
    AppRoutingModule, // must be imported as the last module as it contains the fallback route
  ],
  declarations: [AppComponent, ErrorComponent],
  providers: [
    S3Service,
    RouteService,
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
