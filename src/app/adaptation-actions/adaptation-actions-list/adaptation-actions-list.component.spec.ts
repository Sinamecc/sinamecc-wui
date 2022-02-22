import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsListComponent } from './adaptation-actions-list.component';

describe('AdaptationActionsListComponent', () => {
  let component: AdaptationActionsListComponent;
  let fixture: ComponentFixture<AdaptationActionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptationActionsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
