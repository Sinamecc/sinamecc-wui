import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactFormComponent } from './impact-form.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { S3Service } from '@app/s3.service';
import { MockS3Service } from '@app/s3.service.mock';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { I18nService } from '@app/i18n/i18n.service';
import { SharedModule } from '@shared';

describe('ImpactFormComponent', () => {
  let component: ImpactFormComponent;
  let fixture: ComponentFixture<ImpactFormComponent>;

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
        SharedModule,
      ],
      declarations: [ImpactFormComponent],
      providers: [
        MockS3Service,
        { provide: MitigationActionsService, useClass: MockMitigationActionsService },
        { provide: S3Service, useClass: MockS3Service },
        { provide: I18nService, useClass: MockI18nService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
