import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDialogBoxComponent } from './generic-dialog-box.component';

describe('GenericDialogBoxComponent', () => {
  let component: GenericDialogBoxComponent;
  let fixture: ComponentFixture<GenericDialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericDialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
