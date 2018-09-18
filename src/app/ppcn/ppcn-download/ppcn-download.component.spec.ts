import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpcnDownloadComponent } from './ppcn-download.component';

describe('PpcnDownloadComponent', () => {
  let component: PpcnDownloadComponent;
  let fixture: ComponentFixture<PpcnDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpcnDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpcnDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
