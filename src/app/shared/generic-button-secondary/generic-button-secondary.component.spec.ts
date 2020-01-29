import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericButtonSecondaryComponent } from './generic-button-secondary.component';

describe('GenericButtonSecondaryComponent', () => {
  let component: GenericButtonSecondaryComponent;
  let fixture: ComponentFixture<GenericButtonSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericButtonSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericButtonSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
