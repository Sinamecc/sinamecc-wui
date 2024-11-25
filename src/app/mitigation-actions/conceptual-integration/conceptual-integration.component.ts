import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Logger } from '@core';

const log = new Logger('Conceptual integration');

@Component({
  selector: 'app-conceptual-integration',
  templateUrl: './conceptual-integration.component.html',
  styleUrls: ['./conceptual-integration.component.scss'],
  standalone: false,
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

  ngOnInit() {}
}
