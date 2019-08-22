import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocNewBuyerAccountComponent } from './mccr-poc-new-buyer-account.component';

describe('MccrPocNewBuyerAccountComponent', () => {
  let component: MccrPocNewBuyerAccountComponent;
  let fixture: ComponentFixture<MccrPocNewBuyerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocNewBuyerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocNewBuyerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
