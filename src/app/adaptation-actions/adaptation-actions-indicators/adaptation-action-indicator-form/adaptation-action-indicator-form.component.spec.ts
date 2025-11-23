import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionIndicatorFormComponent } from './adaptation-action-indicator-form.component';

describe('AdaptationActionIndicatorFormComponent', () => {
  let component: AdaptationActionIndicatorFormComponent;
  let fixture: ComponentFixture<AdaptationActionIndicatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptationActionIndicatorFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdaptationActionIndicatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
