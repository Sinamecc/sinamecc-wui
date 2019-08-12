import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';


export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;

}

export class MockUpdateStatusService {

  constructor() { }

  updateStatus(context: any, entity: any, routeToUpload: string, formData: FormData): Observable <Response> {
    const response = {
        statusCode: 200,
        message: 'Form submitted correctly'
      };
      return of(response);
  }

}
