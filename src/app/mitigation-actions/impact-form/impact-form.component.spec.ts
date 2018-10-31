import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactFormComponent } from './impact-form.component';

describe('ImpactFormComponent', () => {
  let component: ImpactFormComponent;
  let fixture: ComponentFixture<ImpactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
