import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarmonizationProposalNewComponent } from '@app/mitigation-actions/harmonization-proposal-new/harmonization-proposal-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadProposalComponent } from '@app/mitigation-actions/upload-proposal/upload-proposal.component';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockS3Service } from '@app/s3.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { LoaderComponent } from '@shared';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { CoreModule } from '@core';
import { S3Service } from '@app/s3.service';
import { I18nService } from '@app/i18n';

describe('HarmonizationProposalNewComponent', () => {
  let component: HarmonizationProposalNewComponent;
  let fixture: ComponentFixture<HarmonizationProposalNewComponent>;

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
        CoreModule,
      ],
      declarations: [
        HarmonizationProposalNewComponent,
        UploadProposalComponent,
        LoaderComponent,
        InputFileComponent,
        ByteFormatPipe,
      ],
      providers: [
        MockS3Service,
        { provide: MitigationActionsService, useClass: MockMitigationActionsService },
        { provide: S3Service, useClass: MockS3Service },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarmonizationProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
