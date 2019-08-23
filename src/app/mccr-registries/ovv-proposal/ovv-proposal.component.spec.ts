import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nService, AuthenticationService, MockAuthenticationService } from '@app/core';
import { DatePipe } from '@angular/common';
import { OvvProposalComponent } from '@app/mccr/mccr-registries/ovv-proposal/ovv-proposal.component';
import { MaterialModule } from '@app/material.module';
import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { MockS3Service } from '@app/core/s3.service.mock';
import { S3Service } from '@app/core/s3.service';

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
      declarations: [ OvvProposalComponent, DownloadProposalComponent ],
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
