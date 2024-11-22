import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringProposalNewComponent } from './monitoring-proposal-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent, SharedModule } from '@shared';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@app/i18n/i18n.service';
import { MccrRegistriesService } from '../mccr-registries.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@shared/s3.service';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { UploadProposalComponent } from '../upload-proposal/upload-proposal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MonitoringProposalNewComponent', () => {
  let component: MonitoringProposalNewComponent;
  let fixture: ComponentFixture<MonitoringProposalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MonitoringProposalNewComponent,
        LoaderComponent,
        UploadProposalComponent,
        InputFileComponent,
        ByteFormatPipe,
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
    fixture = TestBed.createComponent(MonitoringProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
