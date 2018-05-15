import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistryComponent } from './mccr-registry.component';

describe('MccrRegistryComponent', () => {
  let component: MccrRegistryComponent;
  let fixture: ComponentFixture<MccrRegistryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
