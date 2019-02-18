import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesUpdateComponent } from '@app/mccr-registries/mccr-registries-update/mccr-registries-update.component';

describe('MccrRegistriesUpdateComponent', () => {
  let component: MccrRegistriesUpdateComponent;
  let fixture: ComponentFixture<MccrRegistriesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistriesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
