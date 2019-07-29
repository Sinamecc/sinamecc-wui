import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from '@app/material.module';
import { ShellComponent } from '@app/core/shell/shell.component';
import { HeaderComponent } from '@app/core/shell/header/header.component';
import { RouteReusableStrategy } from '@app/core/route-reusable-strategy';
import { AuthenticationService } from '@app/core/authentication/authentication.service';
import { AuthenticationGuard } from '@app/core/authentication/authentication.guard';
import { I18nService } from '@app/core/i18n.service';
import { S3Service } from '@app/core/s3.service';
import { HttpService } from '@app/core/http/http.service';
import { HttpCacheService } from '@app/core/http/http-cache.service';
import { ApiPrefixInterceptor } from '@app/core/http/api-prefix.interceptor';
import { ErrorHandlerInterceptor } from '@app/core/http/error-handler.interceptor';
import { CacheInterceptor } from '@app/core/http/cache.interceptor';
import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    HeaderComponent,
    ShellComponent,
    ComponentDialogComponent,
  ],
  entryComponents: [
    ComponentDialogComponent
  ],
  providers: [
    AuthenticationService,
    AuthenticationGuard,
    I18nService,
    S3Service,
    HttpCacheService,
    ApiPrefixInterceptor,
    ErrorHandlerInterceptor,
    CacheInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixInterceptor,
      multi: true
    },
    {
      provide: HttpClient,
      useClass: HttpService
    },
    {
      provide: RouteReuseStrategy,
      useClass: RouteReusableStrategy
    }
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}
