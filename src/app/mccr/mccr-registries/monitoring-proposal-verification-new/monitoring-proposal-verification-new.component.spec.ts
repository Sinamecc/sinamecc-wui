import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringProposalVerificationNewComponent } from './monitoring-proposal-verification-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { ByteFormatPipe } from '@app/shared/input-file/byte-format.pipe';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService, S3Service, I18nService } from '@app/core';
import { MockS3Service } from '@app/core/s3.service.mock';
import { DatePipe } from '@angular/common';

describe('MonitoringProposalVerificationNewComponent', () => {
  let component: MonitoringProposalVerificationNewComponent;
  let fixture: ComponentFixture<MonitoringProposalVerificationNewComponent>;

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
      declarations: [ MonitoringProposalVerificationNewComponent,
                      LoaderComponent,
                      ByteFormatPipe,
                      InputFileComponent,
                      UploadProposalComponent ],
      providers: [I18nService, DatePipe, MccrRegistriesService,
                  { provide: AuthenticationService, useClass: MockAuthenticationService },
                  { provide: S3Service, useClass: MockS3Service }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringProposalVerificationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
