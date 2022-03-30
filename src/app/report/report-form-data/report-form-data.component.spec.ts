import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFormDataComponent } from './report-form-data.component';

describe('ReportFormDataComponent', () => {
  let component: ReportFormDataComponent;
  let fixture: ComponentFixture<ReportFormDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportFormDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
