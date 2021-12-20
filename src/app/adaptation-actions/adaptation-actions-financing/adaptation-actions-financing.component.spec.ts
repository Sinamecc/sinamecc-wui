import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsFinancingComponent } from './adaptation-actions-financing.component';

describe('AdaptationActionsFinancingComponent', () => {
  let component: AdaptationActionsFinancingComponent;
  let fixture: ComponentFixture<AdaptationActionsFinancingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptationActionsFinancingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsFinancingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
