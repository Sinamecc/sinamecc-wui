import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileVersionComponent } from './file-version.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '@shared';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MockS3Service } from '@app/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { I18nService } from '@app/i18n';
import { UploadProposalComponent } from '@app/ppcn/upload-proposal/upload-proposal.component';

describe('FileVersionComponent', () => {
  let component: FileVersionComponent;
  let fixture: ComponentFixture<FileVersionComponent>;

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
        FileVersionComponent,
        UploadProposalComponent,
        LoaderComponent,
        InputFileComponent,
        ByteFormatPipe,
      ],
      providers: [
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
