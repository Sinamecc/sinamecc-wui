import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvvProposalNewComponent } from './ovv-proposal-new.component';
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
import { I18nService, AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';
import { DatePipe } from '@angular/common';
import { MockS3Service } from '@app/core/s3.service.mock';

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
      declarations: [ OvvProposalNewComponent,
                      UploadProposalComponent,
                      InputFileComponent,
                      ByteFormatPipe,
                      LoaderComponent ],
      providers: [
        I18nService, DatePipe, MccrRegistriesService,
                  { provide: AuthenticationService, useClass: MockAuthenticationService },
                  { provide: S3Service, useClass: MockS3Service }
      ]
    })
    .compileComponents();
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
