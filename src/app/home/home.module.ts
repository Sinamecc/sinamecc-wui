import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing-module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { CoreModule } from '@app/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
