import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDialogComponent } from '@app/core/component-dialog/component-dialog.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ComponentDialogComponent', () => {
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  let component: ComponentDialogComponent;
  let fixture: ComponentFixture<ComponentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [ ComponentDialogComponent ],
      providers : [
        { provide: MatDialogRef, useValue: {}},
        { provide: MAT_DIALOG_DATA, useValue: {} }
        , MatDialog ]
        });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ComponentDialogComponent]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
