import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesReviewComponent } from './mccr-registries-review.component';
import { UpdateStatusComponent } from '@app/shared/update-status/update-status.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { AuthenticationService, MockAuthenticationService, I18nService } from '@app/core';
import { MockMccrRegistriesService } from '../mccr-registries.service.mock';
import { MccrRegistriesService } from '../mccr-registries.service';
import { MockMitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service.mock';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MockS3Service } from '@app/core/s3.service.mock';
import { convertToParamMap, ActivatedRoute} from '@angular/router';
import { UpdateStatusService } from '@app/shared/update-status/update-status.service';
import { MockUpdateStatusService } from '@app/shared/update-status/update-status.service.mock';

fdescribe('MccrRegistriesReviewComponent', () => {
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
      declarations: [ MccrRegistriesReviewComponent, UpdateStatusComponent, LoaderComponent ],
      providers: [
        MockMccrRegistriesService, MockMitigationActionsService, MockS3Service, I18nService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: MccrRegistriesService, useClass: MockMccrRegistriesService },
        { provide: UpdateStatusService, useClass: MockUpdateStatusService },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
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
    fixture = TestBed.createComponent(MccrRegistriesReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
