import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MccrRegistriesNewComponent } from './mccr-registries-new.component';

describe('MccrRegistriesNewComponent', () => {
  let component: MccrRegistriesNewComponent;
  let fixture: ComponentFixture<MccrRegistriesNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MccrRegistriesNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MccrRegistriesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
