import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import {
  adaptationActionClimateThreaMap,
  adaptationActionFinanceStatusMap,
  adaptationsActionsTypeMap,
  classifiersSINAMECCMap,
  financeInstrumentMap,
  indicatorsTypeOfDataMap,
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
  adaptationAction: any = {};
  reportingEntityType = reportingEntityTypeMap;
  adaptationsActionsType = adaptationsActionsTypeMap;
  provinciaType = provinciaMap;
  adaptationActionClimateThreaType = adaptationActionClimateThreaMap;
  adaptationActionFinanceStatusType = adaptationActionFinanceStatusMap;
  financeInstrumentType = financeInstrumentMap;
  indicatorsTypeOfDataType = indicatorsTypeOfDataMap;
  classifiersSINAMECCType = classifiersSINAMECCMap;

  constructor(private route: ActivatedRoute, private service: AdaptationActionService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loadAdaptationAction();
  }

  loadAdaptationAction() {
    this.service.loadAdaptationActions().subscribe(
      (response) => {
        this.adaptationAction = response.find((element: any) => element.id == this.id);
        console.log(this.adaptationAction);
      },
      (error) => {
        this.adaptationAction = {};
      }
    );
  }
}
