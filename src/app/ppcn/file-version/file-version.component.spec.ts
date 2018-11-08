import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileVersionComponent } from './file-version.component';

describe('FileVersionComponent', () => {
  let component: FileVersionComponent;
  let fixture: ComponentFixture<FileVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
