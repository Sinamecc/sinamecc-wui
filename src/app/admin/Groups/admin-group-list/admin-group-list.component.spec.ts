import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGroupListComponent } from './admin-group-list.component';

describe('AdminGroupListComponent', () => {
  let component: AdminGroupListComponent;
  let fixture: ComponentFixture<AdminGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
