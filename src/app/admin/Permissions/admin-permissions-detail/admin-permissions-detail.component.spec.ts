import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsDetailComponent } from './admin-permissions-detail.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminPermissionsNewComponent } from '../admin-permissions-new/admin-permissions-new.component';
import { AdminService } from '@app/admin/admin.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { SharedModule } from '@app/shared';

describe('AdminPermissionsDetailComponent', () => {
  let component: AdminPermissionsDetailComponent;
  let fixture: ComponentFixture<AdminPermissionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [ AdminPermissionsDetailComponent, AdminPermissionsNewComponent ],
      providers: [AdminService, { provide: AuthenticationService, useClass: MockAuthenticationService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionsDetailComponent);
    component = fixture.componentInstance;

    component.permission = {
      id: '1',
      name: 'wtf',
      codename: 'wtf',
      content_type: 'wtf'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
