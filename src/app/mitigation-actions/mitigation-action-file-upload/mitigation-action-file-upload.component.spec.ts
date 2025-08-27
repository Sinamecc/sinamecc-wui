import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionFileUploadComponent } from './mitigation-action-file-upload.component';

describe('MitigationActionFileUploadComponent', () => {
  let component: MitigationActionFileUploadComponent;
  let fixture: ComponentFixture<MitigationActionFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MitigationActionFileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MitigationActionFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
