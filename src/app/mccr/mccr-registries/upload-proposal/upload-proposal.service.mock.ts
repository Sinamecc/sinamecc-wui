import { Observable, of } from 'rxjs';
import { Response } from './response';

export class MockUploadProposalService {
  uploadProposal(context: any, entity: any, routeToUpload: string, formData: FormData): Observable<Response> {
    const response = {
      statusCode: 200,
      message: 'Form submitted correctly',
    };
    return of(response);
  }
}
