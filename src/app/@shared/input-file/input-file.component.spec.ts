import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFileComponent } from '@shared/input-file/input-file.component';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

xdescribe('InputFileComponent', () => {
  let component: InputFileComponent;
  let fixture: ComponentFixture<InputFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InputFileComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFileComponent);
    (fixture.componentInstance as any).ngControl = new UntypedFormControl();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
