import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyAspectsFormComponent } from './key-aspects-form.component';

describe('KeyAspectsFormComponent', () => {
  let component: KeyAspectsFormComponent;
  let fixture: ComponentFixture<KeyAspectsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyAspectsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyAspectsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
