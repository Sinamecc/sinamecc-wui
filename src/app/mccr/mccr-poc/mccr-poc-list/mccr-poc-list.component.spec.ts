import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocListComponent } from './mccr-poc-list.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@shared';
import { I18nService } from '@app/i18n';
import { MccrPocService } from '../mccr-poc.service';
import { MockMccrPocService } from '../mccr-poc.service.mock';
import { MockI18nService } from '@app/i18n/i18n.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrPocListComponent', () => {
  let component: MccrPocListComponent;
  let fixture: ComponentFixture<MccrPocListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MccrPocListComponent, LoaderComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: I18nService, useClass: MockI18nService },
        { provide: MccrPocService, useClass: MockMccrPocService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
