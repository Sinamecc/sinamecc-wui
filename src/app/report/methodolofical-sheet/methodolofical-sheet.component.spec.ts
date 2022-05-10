import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodoloficalSheetComponent } from './methodolofical-sheet.component';

describe('MethodoloficalSheetComponent', () => {
  let component: MethodoloficalSheetComponent;
  let fixture: ComponentFixture<MethodoloficalSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MethodoloficalSheetComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodoloficalSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
