import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupsComponent } from './admin-groups.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { SharedModule } from '@shared';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminGroupsComponent', () => {
  let component: AdminGroupsComponent;
  let fixture: ComponentFixture<AdminGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGroupsComponent],
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
      providers: [
        AdminService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
