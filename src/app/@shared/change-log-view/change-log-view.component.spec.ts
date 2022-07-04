import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogViewComponent } from './change-log-view.component';

describe('ChangeLogViewComponent', () => {
  let component: ChangeLogViewComponent;
  let fixture: ComponentFixture<ChangeLogViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeLogViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeLogViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
