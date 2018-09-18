import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import {Ppcn, GeographicLevel, SubSector} from '@app/ppcn/ppcn_registry'
import { PpcnNewFormData } from '@app/ppcn/ppcn-new-form-data';
import { BehaviorSubject } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { Contact } from '@app/mitigation-actions/mitigation-action';

const routes = {
  getGeographicLevel: (lang: string) => `/v1/ppcn/geographic/level/${lang}`,
  getRequiredLevel: () => `/v1/ppcn/required/level`,
  seededFormData: (levelId:string, lang: string) => `/v1/ppcn/form/${levelId}/${lang}`,
  ppcns: (lang:string) => `/v1/ppcn/${lang}`,
  submitNewPpcn: () => `/v1/ppcn/`,
  submitUpdatePpcn: (ppcnId: string) => `/v1/ppcn/${ppcnId}`,
  subsectors: (subsector:string, lang:string) => `/v1/ppcn/${subsector}/subsector/${lang}/`,
  deletePpcn: (uuid:string) => `/v1/ppcn/${uuid}`,
  getPpcn: (uuid: string, lang:string) => `/v1/ppcn/${uuid}/${lang}`,
  submitNewFilePPCN: () => `/v1/ppcn/file/`,

}

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
  geographic?: string;

}
@Injectable()
export class PpcnService {

  private pccnLevelId = new BehaviorSubject('');
  currentLevelId = this.pccnLevelId.asObservable();
  

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe) { 

    }

    submitNewPpcnForm (context: any): Observable <Response> {
    
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      let formData= this.buildFormData(context);
      return this.httpClient
      .post(routes.submitNewPpcn(),formData,httpOptions)
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            id: body.id,
            geographic: body.geographicLevel,
            message: 'Form submitted correctly'
          };
          return response;
        })
      );

    }

    submitUpdatePpcnForm (context: any,
                          id:string,
                          contactFormId:number,
                          geographicFormId: number,
                          requiredFormId: number,
                          recognitionFormId: number,
                          sectorFormId: number,
                          subsectorFormId: number): Observable<Response>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      let formData= this.buildFormData(context,contactFormId,geographicFormId,requiredFormId,recognitionFormId,sectorFormId,subsectorFormId);
      return this.httpClient
      .put(routes.submitUpdatePpcn(id),formData,httpOptions)
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            id: body.id,
            geographic:"",
            message: 'Form updated correctly'
          };
          return response;
        })
      );

    }

    deletePpcn(uuid: string): Observable <{} | Object> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      const url = routes.deletePpcn(uuid);
      // routes.deleteMitigationAction(uuid)
      return this.httpClient
        .delete(url, httpOptions) 
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'PPCN deleted correctly'
            };
            return response;
          })
        );
  
    }

    updateCurrentGeographicalLevel(newGeographicalLevelId: string) {
      this.pccnLevelId.next(newGeographicalLevelId);
    }

    ppcn(lang: string): Observable < Ppcn[] > {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
        .get(routes.ppcns(lang), httpOptions) 
        .pipe(
          map((body: any) => {
            return body;
          })
        );
    }
  
    geographicLevel(lang: string): Observable < GeographicLevel[] > {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
        .get(routes.getGeographicLevel(lang), httpOptions) 
        .pipe(
          map((body: any) => {
            return body;
          })
        );
    }

    newPpcnFormData(levelId:string, lang: string): Observable < PpcnNewFormData > {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
      .get(routes.seededFormData(levelId,lang), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  
    }

    subsectors(sector:string, lang:string): Observable<SubSector[]>{
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
      .get(routes.subsectors(sector,lang),httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      )

    }

    getPpcn(uuid: string, lang: string): Observable <Ppcn> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
      .get(routes.getPpcn(uuid, lang), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

    }

    submitPpcnNewFile(context: any): Observable <Response> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
  
      let fileList = context.files;
      
      let formData: FormData = new FormData();
      formData.append('ppcn_form', context.ppcnCtrl);
      
      if (fileList.length > 0 ) {
        for (let file of fileList) {
          let fileToUpload = file.file.files[0];
          formData.append('files[]', fileToUpload, fileToUpload.name);
        }
        return this.httpClient
          .post(routes.submitNewFilePPCN(), formData, httpOptions)
          .pipe(
            map((body: any) => {
              const response = {
                statusCode: 200,
                message: 'Files submitted correctly'
              };
              return response;
            })
          );
      } else {
        // raise exception
      }
      
    }

    private buildFormData(context: any,
                          contactFormId:number = null,
                          geographicFormId:number = null,
                          requiredFormId:number = null,
                          recognitionFormId:number = null,
                          sectorFormId:number = null,
                          subsectorFormId:number = null,
                        ){
      let formData = {};
      let organization = {};
      let contact = {};

      this.currentLevelId.subscribe(levelId => formData['geographicLevel'] = levelId);
      if(geographicFormId){
        formData['geographicLevel'] = String(geographicFormId);
      }
      formData['requiredLevel'] = context.formArray[2].requiredCtrl;
      formData['subsector'] = context.formArray[2].subSectorCtrl;
      formData['sector'] = context.formArray[2].sectorCtrl;
      formData['base_year'] = this.datePipe.transform(context.formArray[3].implementationEndDateCtrl, 'yyyy-MM-dd');
      formData['recognitionType'] =  context.formArray[2].recognitionCtrl;  

      organization['name']  = context.formArray[0].nameCtrl;
      organization['representative_name'] = context.formArray[0].representativeNameCtrl;
      organization['phone_organization'] = context.formArray[0].telephoneCtrl;
      organization['postal_code'] = context.formArray[0].postalCodeCtrl;
      organization['fax'] = context.formArray[0].faxCtrl;
      organization['ciuu'] = context.formArray[0].ciuuCodeCtrl;
      organization['address'] = context.formArray[0].addressCtrl;

      if(contactFormId) {
        contact['id'] =  String(contactFormId);
      }
      contact['full_name'] =  context.formArray[1].contactNameCtrl;
      contact['job_title'] =  context.formArray[1].positionCtrl;
      contact['email'] =  context.formArray[1].emailFormCtrl;
      contact['phone'] =  context.formArray[1].phoneCtrl;

      organization['contact'] = contact;
      formData['organization'] = organization;
      



      return formData;
    }

}
