import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVersionsNewComponent } from '@app/report/report-versions-new/report-versions-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoaderComponent } from '@shared/loader/loader.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { I18nService } from '@app/i18n/i18n.service';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { ReportService } from '../report.service';
import { MockReportService } from '../report.service.mock';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';

describe('ReportVersionsNewComponent', () => {
  let component: ReportVersionsNewComponent;
  let fixture: ComponentFixture<ReportVersionsNewComponent>;

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
        ReportVersionsNewComponent,
        LoaderComponent,
        InputFileComponent,
        ByteFormatPipe,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
      providers: [I18nService, { provide: ReportService, useClass: MockReportService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVersionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
