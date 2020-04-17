import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocAddPocComponent } from './mccr-poc-add-poc.component';
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

describe('MccrPocAddPocComponent', () => {
  let component: MccrPocAddPocComponent;
  let fixture: ComponentFixture<MccrPocAddPocComponent>;

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
      declarations: [ MccrPocAddPocComponent, LoaderComponent ],
      providers: [
        { provide: MccrPocService, useClass: MockMccrPocService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocAddPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
