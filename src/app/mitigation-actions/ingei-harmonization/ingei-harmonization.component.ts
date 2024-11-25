import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Logger } from '@core';

const log = new Logger('Report');

@Component({
  selector: 'app-ingei-harmonization',
  templateUrl: './ingei-harmonization.component.html',
  styleUrls: ['./ingei-harmonization.component.scss'],
  standalone: false,
})
export class IngeiHarmonizationComponent implements OnInit {
  isLoading: boolean;
  title: string;
  id: string;
  fileName: string;
  nextRoute: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'harmonization_ingei_proposal';
    this.fileName = 'harmonization_proposal.xlsx';
    this.nextRoute = `mitigation/actions/${this.id}/harmonization/proposal/new`;
  }

  ngOnInit() {}
}
