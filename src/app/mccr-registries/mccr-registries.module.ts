import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';


import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { MccrRegistriesListComponent } from './mccr-registries-list/mccr-registries-list.component';
import { MccrRegistriesNewComponent } from './mccr-registries-new/mccr-registries-new.component';
import { MccrRegistryComponent } from './mccr-registry/mccr-registry.component';
import { MccrRegistriesUpdateComponent } from './mccr-registries-update/mccr-registries-update.component';
import { MccrRegistriesRoutingModule } from '@app/mccr-registries/mccr-registries-routing.module';
import { MccrRegistriesService } from './mccr-registries.service';


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
    MccrRegistriesRoutingModule
  ],
  declarations: [
    MccrRegistriesListComponent,
    MccrRegistriesNewComponent,
    MccrRegistryComponent,
    MccrRegistriesUpdateComponent
  ],
  providers: [
    MccrRegistriesService,
    DatePipe
  ]
})
export class MccrRegistriesModule { }
