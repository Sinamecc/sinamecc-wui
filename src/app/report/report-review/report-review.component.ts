import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { Report } from '../interfaces/report';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-review',
  templateUrl: './report-review.component.html',
  styleUrls: ['./report-review.component.scss'],
})
export class ReportReviewComponent implements OnInit {
  isLoading = false;
  id: string;
  report: Report;
  title: string;
  formData: FormData;
  statuses: any[];
  formSubmitRoute: string;
  nextRoute: string;
  shouldDisplayComment = false;

  constructor(
    private route: ActivatedRoute,
    private service: ReportService,
    private credentialsService: CredentialsService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'adaptationAction.addReview';
    this.formData = new FormData();
    this.statuses = [];
    this.nextRoute = `report`;
    this.formSubmitRoute = `/v1/report-data/report/${this.id}/`;
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.isLoading = true;
    this.service.report(this.id).subscribe(
      (x) => {
        this.report = x;
        this.statuses = this.report.next_action;
      },
      (complete) => {
        this.isLoading = false;
      }
    );
  }

  onSubmission(context: any) {
    this.formData.append('comment', context.descriptionCtrl);
    this.formData.append('fsm_state', context.context.statusCtrl.state);
    this.formData.append('user', String(this.credentialsService.credentials.id));
  }
}
