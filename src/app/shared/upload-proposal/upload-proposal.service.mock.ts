import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Response } from '@app/shared/response';

export class MockUploadProposalService {


    uploadProposal(context: any, entity: any, routeToUpload: string, formData: FormData): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly'
        };
        return of(response);
    }
}
