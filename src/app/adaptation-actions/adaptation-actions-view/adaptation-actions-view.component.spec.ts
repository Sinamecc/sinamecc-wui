import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsViewComponent } from './adaptation-actions-view.component';

describe('AdaptationActionsViewComponent', () => {
  let component: AdaptationActionsViewComponent;
  let fixture: ComponentFixture<AdaptationActionsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptationActionsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
