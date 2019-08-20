import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesReviewComponent } from './mccr-registries-review.component';

describe('MccrRegistriesReviewComponent', () => {
  let component: MccrRegistriesReviewComponent;
  let fixture: ComponentFixture<MccrRegistriesReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistriesReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
