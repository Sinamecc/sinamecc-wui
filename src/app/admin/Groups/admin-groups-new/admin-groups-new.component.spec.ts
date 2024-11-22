import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupsNewComponent } from './admin-groups-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminGroupsNewComponent', () => {
  let component: AdminGroupsNewComponent;
  let fixture: ComponentFixture<AdminGroupsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGroupsNewComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
