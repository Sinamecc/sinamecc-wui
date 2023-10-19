import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { I18nModule } from '@app/i18n';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login.component';
import { CredentialsService } from '.';
import { SharedModule } from '@shared';
import { RestorePasswordComponent } from './restore-password/restore-password.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    I18nModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [LoginComponent, RestorePasswordComponent],
  providers: [],
})
export class AuthModule {}
