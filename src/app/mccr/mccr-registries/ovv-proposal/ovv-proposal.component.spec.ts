import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvvProposalComponent } from './ovv-proposal.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { I18nService, AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';
import { DatePipe } from '@angular/common';
import { MccrRegistriesService } from '../mccr-registries.service';
import { MockS3Service } from '@app/core/s3.service.mock';
import { GenericButtonComponent } from '@app/shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@app/shared/generic-button-secondary/generic-button-secondary.component';

describe('OvvProposalComponent', () => {
  let component: OvvProposalComponent;
  let fixture: ComponentFixture<OvvProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,

      ],
      declarations: [ OvvProposalComponent, DownloadProposalComponent, GenericButtonComponent,
        GenericButtonSecondaryComponent ],
      providers: [I18nService, DatePipe, MccrRegistriesService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvvProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
