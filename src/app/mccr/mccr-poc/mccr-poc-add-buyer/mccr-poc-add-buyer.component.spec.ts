import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocAddBuyerComponent } from './mccr-poc-add-buyer.component';

describe('MccrPocAddBuyerComponent', () => {
  let component: MccrPocAddBuyerComponent;
  let fixture: ComponentFixture<MccrPocAddBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocAddBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocAddBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
