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


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MccrPocRoutingModule

  ],
  declarations: [MccrPocListComponent, MccrSearchPocComponent],
  providers: [
    MccrPocService
  ]
})
export class MccrPocModule { }
