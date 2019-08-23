import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsNewComponent } from './admin-permissions-new.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';

describe('AdminPermissionsNewComponent', () => {
  let component: AdminPermissionsNewComponent;
  let fixture: ComponentFixture<AdminPermissionsNewComponent>;

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
      ],
      declarations: [ AdminPermissionsNewComponent ],
      providers: [AdminService, { provide: AuthenticationService, useClass: MockAuthenticationService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
