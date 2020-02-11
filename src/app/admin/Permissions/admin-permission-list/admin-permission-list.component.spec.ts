import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionListComponent } from './admin-permission-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared';

describe('AdminPermissionListComponent', () => {
  let component: AdminPermissionListComponent;
  let fixture: ComponentFixture<AdminPermissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      declarations: [ AdminPermissionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionListComponent);
    component = fixture.componentInstance;
    const permissions = [{id: '01', name: 'test', codename: 'test codename' , content_type: 'fake content'}];

    component.dataTable = permissions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
