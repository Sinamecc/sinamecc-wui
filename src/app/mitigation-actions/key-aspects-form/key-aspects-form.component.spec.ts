import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyAspectsFormComponent } from './key-aspects-form.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { MockS3Service } from '@app/s3.service.mock';
import { S3Service } from '@app/s3.service';
import { SharedModule } from '@shared';

describe('KeyAspectsFormComponent', () => {
  let component: KeyAspectsFormComponent;
  let fixture: ComponentFixture<KeyAspectsFormComponent>;

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
      declarations: [KeyAspectsFormComponent],
      providers: [
        MockS3Service,
        { provide: S3Service, useClass: MockS3Service },
        { provide: MitigationActionsService, useClass: MockMitigationActionsService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyAspectsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
