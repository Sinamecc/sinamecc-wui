import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsListEditComponent } from './admin-permissions-list-edit.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { SharedModule } from '@shared';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminPermissionsListEditComponent', () => {
  let component: AdminPermissionsListEditComponent;
  let fixture: ComponentFixture<AdminPermissionsListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPermissionsListEditComponent],
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
    fixture = TestBed.createComponent(AdminPermissionsListEditComponent);
    component = fixture.componentInstance;
    const permissions = [
      { id: '01', codename: 'admin', name: 'admin', content_type: 'wtf' },
      { id: '02', codename: 'dcc', name: 'dcc', content_type: 'wtf' },
    ];
    component.dataTable = permissions;
    component.userPermissions = permissions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
