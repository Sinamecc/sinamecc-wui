import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';


import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';

import { MccrRegistriesListComponent } from '@app/mccr/mccr-registries/mccr-registries-list/mccr-registries-list.component';
import { MccrRegistriesNewComponent } from '@app/mccr/mccr-registries/mccr-registries-new/mccr-registries-new.component';
import { MccrRegistryComponent } from '@app/mccr/mccr-registries/mccr-registry/mccr-registry.component';
import { MccrRegistriesUpdateComponent } from '@app/mccr/mccr-registries/mccr-registries-update/mccr-registries-update.component';
import { MccrRegistriesRoutingModule } from '@app/mccr/mccr-registries/mccr-registries-routing.module';
import { MccrRegistriesService } from './mccr-registries.service';
import { MccrRegistriesOvvSelectorComponent } from './mccr-registries-ovv-selector/mccr-registries-ovv-selector.component';
import { MccrRegistriesReviewComponent } from './mccr-registries-review/mccr-registries-review.component';
import { OvvProposalComponent } from './ovv-proposal/ovv-proposal.component';
import { OvvProposalNewComponent } from './ovv-proposal-new/ovv-proposal-new.component';


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
    MccrRegistriesUpdateComponent,
    MccrRegistriesOvvSelectorComponent,
    MccrRegistriesReviewComponent,
    OvvProposalComponent,
    OvvProposalNewComponent
  ],
  providers: [
    MccrRegistriesService,
    DatePipe
  ]
})
export class MccrRegistriesModule { }