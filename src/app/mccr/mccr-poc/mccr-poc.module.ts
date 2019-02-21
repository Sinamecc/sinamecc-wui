import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MccrPocListComponent } from '@app/mccr/mccr-poc/mccr-poc-list/mccr-poc-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';


import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { MccrPocRoutingModule } from './mccr-poc-routing.module';
import { MccrPocService } from './mccr-poc.service';
import { MccrSearchPocComponent } from '@app/mccr/mccr-poc/mccr-search-poc/mccr-search-poc.component';
import { MccrPocAddBuyerComponent } from '@app/mccr/mccr-poc/mccr-poc-add-buyer/mccr-poc-add-buyer.component';
import { MccrPocAddDeveloperComponent } from '@app/mccr/mccr-poc/mccr-poc-add-developer/mccr-poc-add-developer.component';
import { FormGroup , FormControl , ReactiveFormsModule , FormsModule } from '@angular/forms';
import { MccrPocAddPocComponent } from '@app/mccr/mccr-poc/mccr-poc-add-poc/mccr-poc-add-poc.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MccrPocRoutingModule,
    ReactiveFormsModule,
    FormsModule

  ],
  declarations: [MccrPocListComponent, MccrSearchPocComponent, MccrPocAddBuyerComponent, MccrPocAddDeveloperComponent, MccrPocAddPocComponent],
  providers: [
    MccrPocService
  ]
})
export class MccrPocModule { }
