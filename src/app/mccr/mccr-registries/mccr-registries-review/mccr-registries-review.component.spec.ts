import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesReviewComponent } from './mccr-registries-review.component';
import { UpdateStatusComponent } from '@app/mccr/mccr-registries/update-status/update-status.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@shared/loader/loader.component';
import { MccrRegistriesService } from '../mccr-registries.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { UpdateStatusService } from '@app/mccr/mccr-registries/update-status/update-status.service';
import { MockUpdateStatusService } from '@app/mccr/mccr-registries/update-status/update-status.service.mock';
import { MockMccrRegistriesService } from '@app/mccr-registries/mccr-registries.service.mock';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { I18nService } from '@app/i18n';

describe('MccrRegistriesReviewComponent', () => {
  let component: MccrRegistriesReviewComponent;
  let fixture: ComponentFixture<MccrRegistriesReviewComponent>;

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
      declarations: [MccrRegistriesReviewComponent, UpdateStatusComponent, LoaderComponent],
      providers: [
        MockMccrRegistriesService,
        MockMitigationActionsService,
        MockS3Service,
        I18nService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
