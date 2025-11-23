import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorSearchComponent } from './indicator-search.component';

describe('IndicatorSearchComponent', () => {
  let component: IndicatorSearchComponent;
  let fixture: ComponentFixture<IndicatorSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndicatorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
