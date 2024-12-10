import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentDialogComponent } from '@core/component-dialog/component-dialog.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ComponentDialogComponent', () => {
  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };
  let component: ComponentDialogComponent;
  let fixture: ComponentFixture<ComponentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentDialogComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        MatDialog,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ComponentDialogComponent],
      },
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
