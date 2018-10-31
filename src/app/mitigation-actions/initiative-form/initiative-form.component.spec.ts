import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeFormComponent } from './initiative-form.component';

describe('InitiativeFormComponent', () => {
  let component: InitiativeFormComponent;
  let fixture: ComponentFixture<InitiativeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
