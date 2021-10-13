import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionInfoModalComponent } from './mitigation-action-info-modal.component';

describe('MitigationActionInfoModalComponent', () => {
  let component: MitigationActionInfoModalComponent;
  let fixture: ComponentFixture<MitigationActionInfoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionInfoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
