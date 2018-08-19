import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVersionsNewComponent } from '@app/report/report-versions-new/report-versions-new.component';

describe('ReportVersionsNewComponent', () => {
  let component: ReportVersionsNewComponent;
  let fixture: ComponentFixture<ReportVersionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVersionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVersionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
