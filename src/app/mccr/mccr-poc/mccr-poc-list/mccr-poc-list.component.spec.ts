import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrPocListComponent } from './mccr-poc-list.component';

describe('MccrPocListComponent', () => {
  let component: MccrPocListComponent;
  let fixture: ComponentFixture<MccrPocListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrPocListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrPocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
