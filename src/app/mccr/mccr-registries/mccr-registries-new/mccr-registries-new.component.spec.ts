import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderComponent, InputFileComponent } from '@app/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { MockTranslateService } from '@app/core/translate.service.mock';
import { I18nService } from '@app/core/i18n.service';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { MccrRegistriesService } from '../mccr-registries.service';
import { AuthenticationService, MockAuthenticationService, CoreModule } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/core/s3.service.mock';
import { MockMccrRegistriesService } from '@app/mccr-registries/mccr-registries.service.mock';
import { MccrRegistriesNewComponent } from './mccr-registries-new.component';

describe('MccrRegistriesNewComponent', () => {
  let component: MccrRegistriesNewComponent;
  let fixture: ComponentFixture<MccrRegistriesNewComponent>;

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
        CoreModule
      ],
      providers: [
        MockMccrRegistriesService, MockI18nService, MockMitigationActionsService, MockS3Service, MockTranslateService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
        { provide: I18nService, useClass: MockI18nService}
      ],
        // { provide: I18nService, useClass: MockI18nService}],
      declarations: [ MccrRegistriesNewComponent, InputFileComponent, LoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject([MockMitigationActionsService, MockI18nService, MockTranslateService], () => {
    expect(component).toBeTruthy();
  }));
});
