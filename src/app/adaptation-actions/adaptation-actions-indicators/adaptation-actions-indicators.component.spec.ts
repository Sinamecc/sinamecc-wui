import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsIndicatorsComponent } from './adaptation-actions-indicators.component';

describe('AdaptationActionsIndicatorsComponent', () => {
  let component: AdaptationActionsIndicatorsComponent;
  let fixture: ComponentFixture<AdaptationActionsIndicatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptationActionsIndicatorsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
