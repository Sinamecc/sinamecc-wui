import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { MccrRegistriesRoutingModule } from '@app/mccr/mccr-registries/mccr-registries-routing.module';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { MccrRegistriesListComponent } from './mccr-registries-list/mccr-registries-list.component';
import { MccrRegistriesNewComponent } from './mccr-registries-new/mccr-registries-new.component';
import { MccrRegistryComponent } from './mccr-registry/mccr-registry.component';
import { MccrRegistriesUpdateComponent } from './mccr-registries-update/mccr-registries-update.component';
import { MccrRegistriesOvvSelectorComponent } from './mccr-registries-ovv-selector/mccr-registries-ovv-selector.component';
import { MccrRegistriesReviewComponent } from './mccr-registries-review/mccr-registries-review.component';
import { OvvProposalComponent } from './ovv-proposal/ovv-proposal.component';
import { OvvProposalNewComponent } from './ovv-proposal-new/ovv-proposal-new.component';
import { MonitoringProposalNewComponent } from './monitoring-proposal-new/monitoring-proposal-new.component';
import { MonitoringProposalVerificationNewComponent } from './monitoring-proposal-verification-new/monitoring-proposal-verification-new.component';

@NgModule({
  declarations: [
    MccrRegistriesListComponent,
    MccrRegistriesNewComponent,
    MccrRegistryComponent,
    MccrRegistriesUpdateComponent,
    MccrRegistriesOvvSelectorComponent,
    MccrRegistriesReviewComponent,
    OvvProposalComponent,
    OvvProposalNewComponent,
    MonitoringProposalNewComponent,
    MonitoringProposalVerificationNewComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MccrRegistriesRoutingModule,
  ],
  providers: [MccrRegistriesService, DatePipe],
})
export class MccrRegistriesModule {}
