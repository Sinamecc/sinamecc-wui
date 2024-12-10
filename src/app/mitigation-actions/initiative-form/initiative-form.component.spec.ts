import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeFormComponent } from './initiative-form.component';
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
import { SharedModule, MockS3Service } from '@shared';
import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('InitiativeFormComponent', () => {
  let component: InitiativeFormComponent;
  let fixture: ComponentFixture<InitiativeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InitiativeFormComponent],
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
        DatePipe,
        {
          provide: MitigationActionsService,
          useClass: MockMitigationActionsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
