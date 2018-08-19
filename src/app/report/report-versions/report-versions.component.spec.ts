import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVersionsComponent } from '@app/report/report-versions/report-versions.component';

describe('ReportVersionsComponent', () => {
  let component: ReportVersionsComponent;
  let fixture: ComponentFixture<ReportVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
