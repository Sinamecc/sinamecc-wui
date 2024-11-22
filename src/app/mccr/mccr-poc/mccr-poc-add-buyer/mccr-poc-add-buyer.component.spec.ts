import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocAddBuyerComponent } from './mccr-poc-add-buyer.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from '@shared';
import { MccrPocService } from '../mccr-poc.service';
import { MockMccrPocService } from '../mccr-poc.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrPocAddBuyerComponent', () => {
  let component: MccrPocAddBuyerComponent;
  let fixture: ComponentFixture<MccrPocAddBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MccrPocAddBuyerComponent, LoaderComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MccrPocService, useClass: MockMccrPocService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocAddBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
