import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonitoringProposalNewComponent } from '@app/mccr/mccr-registries/monitoring-proposal-new/monitoring-proposal-new.component';
import { MaterialModule } from '@app/material.module';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { ByteFormatPipe } from '@app/shared/input-file/byte-format.pipe';
import { I18nService, AuthenticationService, MockAuthenticationService } from '@app/core';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { S3Service } from '@app/core/s3.service';
import { MockS3Service } from '@app/core/s3.service.mock';

describe('MonitoringProposalNewComponent', () => {
  let component: MonitoringProposalNewComponent;
  let fixture: ComponentFixture<MonitoringProposalNewComponent>;

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
      declarations: [ MonitoringProposalNewComponent,
                      LoaderComponent,
                      UploadProposalComponent,
                      InputFileComponent,
                      ByteFormatPipe ],
      providers: [I18nService, DatePipe, MccrRegistriesService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }]
    })
    .compileComponents();
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
