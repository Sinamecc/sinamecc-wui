import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupsNewComponent } from './admin-groups-new.component';

describe('AdminGroupsNewComponent', () => {
  let component: AdminGroupsNewComponent;
  let fixture: ComponentFixture<AdminGroupsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGroupsNewComponent ]
    })
    .compileComponents();
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
