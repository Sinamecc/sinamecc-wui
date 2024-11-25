import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringProposalVerificationNewComponent } from './monitoring-proposal-verification-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadProposalComponent } from '../upload-proposal/upload-proposal.component';
import { LoaderComponent } from '@shared';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { MccrRegistriesService } from '../mccr-registries.service';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { DatePipe } from '@angular/common';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { S3Service } from '@shared/s3.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MonitoringProposalVerificationNewComponent', () => {
  let component: MonitoringProposalVerificationNewComponent;
  let fixture: ComponentFixture<MonitoringProposalVerificationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MonitoringProposalVerificationNewComponent,
        LoaderComponent,
        ByteFormatPipe,
        InputFileComponent,
        UploadProposalComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        I18nService,
        DatePipe,
        MccrRegistriesService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
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
