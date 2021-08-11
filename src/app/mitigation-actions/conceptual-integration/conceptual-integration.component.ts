import { Component, OnInit } from '@angular/core';

import { Logger } from '@core';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('Report');

@Component({
  selector: 'app-conceptual-integration',
  templateUrl: './conceptual-integration.component.html',
  styleUrls: ['./conceptual-integration.component.scss'],
})
export class ConceptualIntegrationComponent implements OnInit {
  isLoading: boolean;
  title: string;
  id: string;
  fileName: string;
  nextRoute: string;

  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = 'Conceptual Proposal Integration';
    this.fileName = 'conceptual_proposal.xlsx';
    this.nextRoute = `mitigation/actions/${this.id}/conceptual/integration/new`;
  }

  ngOnInit(): void {}
}
