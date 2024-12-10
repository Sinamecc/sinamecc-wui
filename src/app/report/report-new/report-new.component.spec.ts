import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportNewComponent } from '@app/report/report-new/report-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CoreModule } from '@core';
import { I18nService } from '@app/i18n/i18n.service';
import { ReportService } from '../report.service';
import { MockReportService } from '../report.service.mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent, SharedModule } from '@shared';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { ByteFormatPipe } from '@shared/input-file/byte-format.pipe';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ReportNewComponent', () => {
  let component: ReportNewComponent;
  let fixture: ComponentFixture<ReportNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReportNewComponent,
        InputFileComponent,
        LoaderComponent,
        ByteFormatPipe,
        GenericButtonComponent,
        GenericButtonSecondaryComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      providers: [
        I18nService,
        { provide: ReportService, useClass: MockReportService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
