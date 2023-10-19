import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AdaptationAction,
  BenefitedPopulation,
  Canton,
  ClimateThreat,
  ClimateThreatCatalog,
  District,
  InstrumentDetail,
  Province,
} from './interfaces/adaptationAction';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Activities, ODS, SubTopics, TemporalityImpact, Topic } from './interfaces/catalogs';

const routes = {
  adaptationAction: () => `/v1/adaptation-action/`,
  adaptationActionUpdate: (id: string) => `/v1/adaptation-action/${id}/`,
  topics: () => `/v1/adaptation-action/get_topics/`,
  subTopics: (id: string) => `/v1/adaptation-action/get_subtopics/${id}`,
  getActivities: (id: string) => `/v1/adaptation-action/get_activities/${id}/`,
  ods: () => `/v1/adaptation-action/get_ods/`,
  temporalityImpact: () => `/v1/adaptation-action/get_temporality_impact/`,
  generalImpact: () => `/v1/adaptation-action/get_general_impact/`,
  getProvince: () => `/v1/general/province/`,
  getCanton: (id: number) => `/v1/general/canton/${id}/`,
  getCantones: () => `/v1/general/canton/`,
  getDistricts: (id: number) => `/v1/general/district/${id}/`,
  districts: () => `/v1/general/district/`,
  getClimateThreat: () => `/v1/adaptation-action/type_climate_threat/`,
  instrumentDetail: () => `/v1/adaptation-action/instrument_detail/`,
  benefitedPopulations: () => `/v1/adaptation-action/get_benefited_population/`,
};

@Injectable()
export class AdaptationActionService {
  private adaptationActionSource = new BehaviorSubject(null);
  currentAdaptationActionSource = this.adaptationActionSource.asObservable();

  updateCurrentAdaptationAction(newAdaptationAction: AdaptationAction) {
    this.adaptationActionSource.next(newAdaptationAction);
  }

  constructor(private httpClient: HttpClient) {}

  public createNewAdaptationAction(payload: AdaptationAction) {
    return this.httpClient.post(routes.adaptationAction(), payload).pipe(
      map((body: any) => {
        this.updateCurrentAdaptationAction(body);
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
          body: body,
        };
        return response;
      })
    );
  }

  public updateNewAdaptationAction(payload: AdaptationAction, id: string) {
    return this.httpClient.put(routes.adaptationActionUpdate(id), payload).pipe(
      map((body: any) => {
        this.updateCurrentAdaptationAction(body);
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
          body: body,
        };
        return response;
      })
    );
  }

  public loadAdaptationActions() {
    return this.httpClient.get(routes.adaptationAction()).pipe(
      map((body: AdaptationAction[]) => {
        return body;
      })
    );
  }

  public loadOneAdaptationActions(id: string) {
    return this.httpClient.get(routes.adaptationActionUpdate(id)).pipe(
      map((body: AdaptationAction) => {
        return body;
      })
    );
  }

  public loadTopics() {
    return this.httpClient.get(routes.topics()).pipe(
      map((body: Topic[]) => {
        return body;
      })
    );
  }

  public loadSubTopics(id: string = '') {
    const ID = id !== '' ? `${id}/` : id;
    return this.httpClient.get(routes.subTopics(ID)).pipe(
      map((body: SubTopics[]) => {
        return body;
      })
    );
  }

  public loadActivities(id: string) {
    return this.httpClient.get(routes.getActivities(id)).pipe(
      map((body: Activities[]) => {
        return body;
      })
    );
  }

  public loadODS() {
    return this.httpClient.get(routes.ods()).pipe(
      map((body: ODS[]) => {
        return body;
      })
    );
  }

  public loadTemporalityImpact() {
    return this.httpClient.get(routes.temporalityImpact()).pipe(
      map((body: TemporalityImpact[]) => {
        return body;
      })
    );
  }

  public loadGeneralImpact() {
    return this.httpClient.get(routes.generalImpact()).pipe(
      map((body: TemporalityImpact[]) => {
        return body;
      })
    );
  }

  public loadProvince() {
    return this.httpClient.get(routes.getProvince()).pipe(
      map((body: Province[]) => {
        return body;
      })
    );
  }

  public loadCanton(id: number) {
    return this.httpClient.get(routes.getCanton(id)).pipe(
      map((body: Canton[]) => {
        return body;
      })
    );
  }

  public loadCantones() {
    return this.httpClient.get(routes.getCantones()).pipe(
      map((body: Canton[]) => {
        return body;
      })
    );
  }

  public loadDistrict(idCanton: number, idProvince: number) {
    return this.httpClient.get(routes.getDistricts(idCanton)).pipe(
      map((body: District[]) => {
        return body;
      })
    );
  }

  public loadDistricts() {
    return this.httpClient.get(routes.districts()).pipe(
      map((body: District[]) => {
        return body;
      })
    );
  }

  public loadClimateThreat() {
    return this.httpClient.get(routes.getClimateThreat()).pipe(
      map((body: ClimateThreatCatalog[]) => {
        return body;
      })
    );
  }

  public loadInstrumentDetail() {
    return this.httpClient.get(routes.instrumentDetail()).pipe(
      map((body: InstrumentDetail[]) => {
        return body;
      })
    );
  }

  public loadBenefitedPopulation() {
    return this.httpClient.get(routes.benefitedPopulations()).pipe(
      map((body: BenefitedPopulation[]) => {
        return body;
      })
    );
  }
}
