import { Observable, of } from 'rxjs';

export class MockUpdateStatusService {
  constructor() {}

  updateStatus(context: any, entity: any, routeToUpload: string, formData: FormData): Observable<any> {
    const response = {
      statusCode: 200,
      message: 'Form submitted correctly',
    };
    return of(response);
  }
}
