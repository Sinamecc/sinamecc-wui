import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocNewBuyerAccountComponent } from './mccr-poc-new-buyer-account.component';
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

describe('MccrPocNewBuyerAccountComponent', () => {
  let component: MccrPocNewBuyerAccountComponent;
  let fixture: ComponentFixture<MccrPocNewBuyerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MccrPocNewBuyerAccountComponent, LoaderComponent],
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
    fixture = TestBed.createComponent(MccrPocNewBuyerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
