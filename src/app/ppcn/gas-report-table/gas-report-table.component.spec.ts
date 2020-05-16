import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasReportTableComponent } from './gas-report-table.component';

describe('GasReportTableComponent', () => {
  let component: GasReportTableComponent;
  let fixture: ComponentFixture<GasReportTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasReportTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
