import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrSearchPocComponent } from './mccr-search-poc.component';

describe('MccrSearchPocComponent', () => {
  let component: MccrSearchPocComponent;
  let fixture: ComponentFixture<MccrSearchPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrSearchPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrSearchPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
