import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvvProposalNewComponent } from './ovv-proposal-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadProposalComponent } from '../upload-proposal/upload-proposal.component';
import { LoaderComponent } from '@shared';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { MccrRegistriesService } from '../mccr-registries.service';
import { DatePipe } from '@angular/common';
import { MockS3Service } from '@app/s3.service.mock';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { I18nService } from '@app/i18n';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { S3Service } from '@app/s3.service';

describe('OvvProposalNewComponent', () => {
  let component: OvvProposalNewComponent;
  let fixture: ComponentFixture<OvvProposalNewComponent>;

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
      declarations: [
        OvvProposalNewComponent,
        UploadProposalComponent,
        InputFileComponent,
        ByteFormatPipe,
        LoaderComponent,
      ],
      providers: [
        I18nService,
        DatePipe,
        MccrRegistriesService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvvProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
