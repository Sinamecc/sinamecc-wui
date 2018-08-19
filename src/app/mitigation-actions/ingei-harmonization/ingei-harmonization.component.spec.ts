import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngeiHarmonizationComponent } from '@app/mitigation-actions/ingei-harmonization/ingei-harmonization.component';

describe('IngeiHarmonizationComponent', () => {
  let component: IngeiHarmonizationComponent;
  let fixture: ComponentFixture<IngeiHarmonizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngeiHarmonizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngeiHarmonizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
