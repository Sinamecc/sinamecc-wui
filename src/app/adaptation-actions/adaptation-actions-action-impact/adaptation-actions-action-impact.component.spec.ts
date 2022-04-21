import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsActionImpactComponent } from './adaptation-actions-action-impact.component';

describe('AdaptationActionsActionImpactComponent', () => {
  let component: AdaptationActionsActionImpactComponent;
  let fixture: ComponentFixture<AdaptationActionsActionImpactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptationActionsActionImpactComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsActionImpactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
