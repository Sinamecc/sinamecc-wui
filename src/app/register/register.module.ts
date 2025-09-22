import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '@app/material.module';
import { I18nModule } from '@app/i18n';
import { SharedModule } from '@app/@shared';
import { RegisterRoutingModule } from './register-routing.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    I18nModule,
    SharedModule,
    RegisterRoutingModule,
  ],
})
export class RegisterModule {}
