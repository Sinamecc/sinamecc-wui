import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRegisterComponent } from './general-register.component';

describe('GeneralRegisterComponent', () => {
  let component: GeneralRegisterComponent;
  let fixture: ComponentFixture<GeneralRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
