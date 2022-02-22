import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import {
  adaptationActionClimateThreaMap,
  adaptationsActionsTypeMap,
  provinciaMap,
  reportingEntityTypeMap,
} from '../interfaces/catalogs';

@Component({
  selector: 'app-adaptation-actions-view',
  templateUrl: './adaptation-actions-view.component.html',
  styleUrls: ['./adaptation-actions-view.component.scss'],
})
export class AdaptationActionsViewComponent implements OnInit {
  id = '';
  adaptationAction: AdaptationAction = {};
  reportingEntityType = reportingEntityTypeMap;
  adaptationsActionsType = adaptationsActionsTypeMap;
  provinciaType = provinciaMap;
  adaptationActionClimateThreaType = adaptationActionClimateThreaMap;

  constructor(private route: ActivatedRoute, private service: AdaptationActionService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadAdaptationAction();

    this.adaptationAction.report_organization.report_organization_type;
  }

  loadAdaptationAction() {
    this.service.loadAdaptationActions().subscribe(
      (response) => {
        this.adaptationAction = response.find((element) => element.id == this.id);
      },
      (error) => {
        this.adaptationAction = {};
      }
    );
  }
}
