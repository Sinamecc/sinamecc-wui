import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsMitigationFormComponent } from './emissions-mitigation-form.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MockMitigationActionsService } from '../mitigation-actions.service.mock';
import { SharedModule, S3Service, MockS3Service } from '@shared';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EmissionsMitigationFormComponent', () => {
  let component: EmissionsMitigationFormComponent;
  let fixture: ComponentFixture<EmissionsMitigationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmissionsMitigationFormComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SharedModule,
      ],
      providers: [
        MockS3Service,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionsMitigationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
