import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesListComponent } from '@app/mccr-registries/mccr-registries-list/mccr-registries-list.component';

describe('MccrRegistriesListComponent', () => {
  let component: MccrRegistriesListComponent;
  let fixture: ComponentFixture<MccrRegistriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
