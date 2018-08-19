import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsReviewsListComponent } from '@app/mitigation-actions/mitigation-action-reviews/mitigation-actions-reviews-list/mitigation-actions-reviews-list.component';

describe('MitigationActionsReviewsListComponent', () => {
  let component: MitigationActionsReviewsListComponent;
  let fixture: ComponentFixture<MitigationActionsReviewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionsReviewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsReviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
