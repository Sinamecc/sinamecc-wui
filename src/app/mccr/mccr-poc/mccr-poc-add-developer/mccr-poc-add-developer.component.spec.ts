import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocAddDeveloperComponent } from './mccr-poc-add-developer.component';

describe('MccrPocAddDeveloperComponent', () => {
  let component: MccrPocAddDeveloperComponent;
  let fixture: ComponentFixture<MccrPocAddDeveloperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocAddDeveloperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocAddDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
