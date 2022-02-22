import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupsListEditComponent } from './admin-groups-list-edit.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { SharedModule } from '@shared';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';

describe('AdminGroupsListEditComponent', () => {
  let component: AdminGroupsListEditComponent;
  let fixture: ComponentFixture<AdminGroupsListEditComponent>;

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
        SharedModule,
      ],
      declarations: [AdminGroupsListEditComponent],
      providers: [AdminService, { provide: CredentialsService, useClass: MockCredentialsService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupsListEditComponent);
    component = fixture.componentInstance;
    const groups = [
      { id: '01', label: 'admin', name: 'admin' },
      { id: '02', label: 'dcc', name: 'dcc' },
    ];
    component.dataTable = groups;
    component.userGroups = groups;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
