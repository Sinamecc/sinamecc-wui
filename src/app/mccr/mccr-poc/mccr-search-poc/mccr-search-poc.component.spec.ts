import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrSearchPocComponent } from './mccr-search-poc.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MccrPocService } from '../mccr-poc.service';
import { MockMccrPocService } from '../mccr-poc.service.mock';
import { LoaderComponent } from '@app/shared';
import { I18nService } from '@app/core/i18n.service';
import { MockI18nService } from '@app/core/i18n.service.mock';

describe('MccrSearchPocComponent', () => {
  let component: MccrSearchPocComponent;
  let fixture: ComponentFixture<MccrSearchPocComponent>;

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
      declarations: [ MccrSearchPocComponent, LoaderComponent ],
      providers: [
        { provide: I18nService, useClass: MockI18nService},
        { provide: MccrPocService, useClass: MockMccrPocService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrSearchPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
