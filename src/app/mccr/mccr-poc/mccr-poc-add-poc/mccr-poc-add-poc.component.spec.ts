import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocAddPocComponent } from './mccr-poc-add-poc.component';

describe('MccrPocAddPocComponent', () => {
  let component: MccrPocAddPocComponent;
  let fixture: ComponentFixture<MccrPocAddPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocAddPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocAddPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
