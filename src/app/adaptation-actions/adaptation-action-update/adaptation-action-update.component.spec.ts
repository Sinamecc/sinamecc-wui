import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionUpdateComponent } from './adaptation-action-update.component';

describe('AdaptationActionUpdateComponent', () => {
  let component: AdaptationActionUpdateComponent;
  let fixture: ComponentFixture<AdaptationActionUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptationActionUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdaptationActionUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
