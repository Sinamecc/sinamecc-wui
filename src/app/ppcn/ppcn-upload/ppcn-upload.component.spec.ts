import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnUploadComponent } from './ppcn-upload.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoaderComponent, SharedModule } from '@shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { PpcnService } from '../ppcn.service';
import { MockPpcnService } from '../ppcn.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { GenericButtonComponent } from '@shared/generic-button/generic-button.component';
import { GenericButtonSecondaryComponent } from '@shared/generic-button-secondary/generic-button-secondary.component';
import { CoreModule } from '@core';
import { InputFileComponent } from '@shared/input-file/input-file.component';
import { I18nService } from '@app/i18n';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnUploadComponent', () => {
  let component: PpcnUploadComponent;
  let fixture: ComponentFixture<PpcnUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PpcnUploadComponent,
        LoaderComponent,
        InputFileComponent,
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
        MockS3Service,
        { provide: PpcnService, useClass: MockPpcnService },
        { provide: I18nService, useClass: MockI18nService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
