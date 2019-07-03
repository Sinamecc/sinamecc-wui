import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocNewDeveloperAccountComponent } from './mccr-poc-new-developer-account.component';

describe('MccrPocNewDeveloperAccountComponent', () => {
  let component: MccrPocNewDeveloperAccountComponent;
  let fixture: ComponentFixture<MccrPocNewDeveloperAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocNewDeveloperAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocNewDeveloperAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
