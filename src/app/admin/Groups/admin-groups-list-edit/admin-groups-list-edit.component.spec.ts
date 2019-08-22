import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupsListEditComponent } from './admin-groups-list-edit.component';

describe('AdminGroupsListEditComponent', () => {
  let component: AdminGroupsListEditComponent;
  let fixture: ComponentFixture<AdminGroupsListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGroupsListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupsListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
