import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { Logger } from '@app/core';

const log = new Logger('Report');

@Component({
  selector: 'app-ovv-proposal',
  templateUrl: './ovv-proposal.component.html',
  styleUrls: ['./ovv-proposal.component.scss']
})
export class OvvProposalComponent implements OnInit {

  isLoading: boolean;
  title: string;
  id: string;
  fileName: string;
  nextRoute: string;

  constructor(private route: ActivatedRoute) { 
      this.id = this.route.snapshot.paramMap.get('id');
      this.title = "Formulario detalle solicitud MCCR";
      this.fileName = "conceptual_proposal.xlsx";
      this.nextRoute = `mccr/registries/${this.id}/ovv/proposal/new`;
    }

    ngOnInit() {
    
    }

}
