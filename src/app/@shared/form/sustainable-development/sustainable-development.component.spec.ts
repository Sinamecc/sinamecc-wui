import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustainableDevelopmentComponent } from './sustainable-development.component';

describe('SustainableDevelopmentComponent', () => {
  let component: SustainableDevelopmentComponent;
  let fixture: ComponentFixture<SustainableDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SustainableDevelopmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SustainableDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
