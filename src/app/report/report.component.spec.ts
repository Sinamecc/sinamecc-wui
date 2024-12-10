import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';

import { ReportComponent } from './report.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportComponent],
      imports: [],
      providers: [
        { provide: CredentialsService, useClass: MockCredentialsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
