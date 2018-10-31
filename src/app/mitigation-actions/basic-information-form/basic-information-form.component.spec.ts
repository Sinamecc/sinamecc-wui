import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInformationFormComponent } from './basic-information-form.component';

describe('BasicInformationFormComponent', () => {
  let component: BasicInformationFormComponent;
  let fixture: ComponentFixture<BasicInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
