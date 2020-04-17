import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupListComponent } from './admin-group-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared';

describe('AdminGroupListComponent', () => {
  let component: AdminGroupListComponent;
  let fixture: ComponentFixture<AdminGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      declarations: [ AdminGroupListComponent ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupListComponent);
    component = fixture.componentInstance;
    const groups = [{id: '01', label: 'admin', name: 'admin'},
                     {id: '02', label: 'dcc', name: 'dcc'}];
    component.dataTable = groups;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
