import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesOvvSelectorComponent } from './mccr-registries-ovv-selector.component';

describe('MccrRegistriesOvvSelectorComponent', () => {
  let component: MccrRegistriesOvvSelectorComponent;
  let fixture: ComponentFixture<MccrRegistriesOvvSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistriesOvvSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesOvvSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
