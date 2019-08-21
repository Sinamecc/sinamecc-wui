import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { InputFileComponent } from '../input-file/input-file.component';
import { ByteFormatPipe } from '../input-file/byte-format.pipe';
import { I18nService } from '@app/core';
import { UploadProposalService } from './upload-proposal.service';
import { MockUploadProposalService } from './upload-proposal.service.mock';

fdescribe('UploadProposalComponent', () => {
  let component: UploadProposalComponent;
  let fixture: ComponentFixture<UploadProposalComponent>;

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
      declarations: [ UploadProposalComponent, LoaderComponent, InputFileComponent, ByteFormatPipe ],
      providers: [
        I18nService,
        { provide: UploadProposalService, useClass: MockUploadProposalService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
