import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

describe('DownloadProposalComponent', () => {
  let component: DownloadProposalComponent;
  let fixture: ComponentFixture<DownloadProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [ DownloadProposalComponent, AuthenticationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
