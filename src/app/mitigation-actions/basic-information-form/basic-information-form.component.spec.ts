import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { BasicInformationFormComponent } from './basic-information-form.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@app/core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockS3Service } from '@app/core/s3.service.mock';

describe('BasicInformationFormComponent', () => {
  let component: BasicInformationFormComponent;
  let fixture: ComponentFixture<BasicInformationFormComponent>;

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
      declarations: [ BasicInformationFormComponent ],
      providers: [ MockS3Service,
        { provide: MitigationActionsService, useClass: MockMitigationActionsService},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({id: '1'})
            }
          }
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should create', inject([MockMitigationActionsService], () => {
  //   expect(component).toBeTruthy();
  // }));
});
