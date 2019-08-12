import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesUpdateComponent } from '@app/mccr-registries/mccr-registries-update/mccr-registries-update.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { MockMccrRegistriesService } from '../mccr-registries.service.mock';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MockS3Service } from '@app/core/s3.service.mock';
import { I18nService, AuthenticationService, MockAuthenticationService } from '@app/core';
import { MccrRegistriesService } from '../mccr-registries.service';
import { UpdateStatusService } from '@app/shared/update-status/update-status.service';
import { MockUpdateStatusService } from '@app/shared/update-status/update-status.service.mock';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockI18nService } from '@app/core/i18n.service.mock';
import { MockTranslateService } from '@app/core/translate.service.mock';

describe('MccrRegistriesUpdateComponent', () => {
  let component: MccrRegistriesUpdateComponent;
  let fixture: ComponentFixture<MccrRegistriesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [ MccrRegistriesUpdateComponent, LoaderComponent ],
      providers: [
        MockMccrRegistriesService, MockMitigationActionsService, MockS3Service, MockTranslateService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
        { provide: I18nService, useClass: MockI18nService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({id: '1'})
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
