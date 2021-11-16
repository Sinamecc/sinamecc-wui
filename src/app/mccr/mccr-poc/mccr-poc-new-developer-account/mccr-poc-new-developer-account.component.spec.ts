import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocNewDeveloperAccountComponent } from './mccr-poc-new-developer-account.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MccrPocService } from '../mccr-poc.service';
import { MockMccrPocService } from '../mccr-poc.service.mock';
import { LoaderComponent } from '@shared';

describe('MccrPocNewDeveloperAccountComponent', () => {
  let component: MccrPocNewDeveloperAccountComponent;
  let fixture: ComponentFixture<MccrPocNewDeveloperAccountComponent>;

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
      declarations: [MccrPocNewDeveloperAccountComponent, LoaderComponent],
      providers: [{ provide: MccrPocService, useClass: MockMccrPocService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocNewDeveloperAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
