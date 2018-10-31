import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionsMitigationFormComponent } from './emissions-mitigation-form.component';

describe('EmissionsMitigationFormComponent', () => {
  let component: EmissionsMitigationFormComponent;
  let fixture: ComponentFixture<EmissionsMitigationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmissionsMitigationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionsMitigationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
