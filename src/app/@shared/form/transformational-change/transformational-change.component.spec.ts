import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationalChangeComponent } from './transformational-change.component';

describe('TransformationalChangeComponent', () => {
  let component: TransformationalChangeComponent;
  let fixture: ComponentFixture<TransformationalChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformationalChangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransformationalChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
