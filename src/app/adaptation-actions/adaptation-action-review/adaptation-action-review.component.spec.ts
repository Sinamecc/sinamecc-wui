import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionReviewComponent } from './adaptation-action-review.component';

describe('AdaptationActionReviewComponent', () => {
  let component: AdaptationActionReviewComponent;
  let fixture: ComponentFixture<AdaptationActionReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptationActionReviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
