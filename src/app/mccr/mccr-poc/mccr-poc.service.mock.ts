import { HttpClient } from '@angular/common/http';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export interface Response {
    // Customize received credentials here
    statusCode: number;
    message: string;
    id?: string;

}

export interface ReportContext {
    comment: string;
    file: string | any;
}

export class MockMccrPocService {

    currentMmcr_POC: Observable<MccrPoc>;
    someMccrPoc: MccrPoc;

    constructor() {
        this.someMccrPoc = {
            ucc_code: Math.random().toString(36).substring(7),
            minusq_account: Math.random(),
            generation_account: Math.random(),
            reserve_account: Math.random(),
            developer_account: {
                developer_current_debit_balance: Math.random(),
                developer_current_credit_balance: Math.random(),
                developer_final_balance: Math.random()
            },
            final_balance: Math.random(),
            buyer_account: {
                buyer_current_debit_balance: Math.random(),
                buyer_current_credit_balance: Math.random(),
                buyer_final_balance: Math.random()
            },
            cancellation_account: Math.random(),
        };
        this.currentMmcr_POC = of(this.someMccrPoc);
    }

    getMccrPoc(uuid: string, lang: string): Observable<MccrPoc> {
        return of(
            this.someMccrPoc
        );
    }

    cancelUcc(uuid: string): Observable<{} | Object> {
        const response = {
            statusCode: 200,
            message: 'UCC cancel correctly'
        };
        return of(response);

    }


    submitUccBuyerTransfer(context: any): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly'
        };
        return of(response);
    }

    submitNewDeveloperAccount(context: any): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly',
            account_number: 'some random account number'
        };
        return of(response);


    }

    submitNewBuyerAccount(context: any): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly',
            account_number: 'some random number'
        };
        return of(response);
    }

    submitNewUcc(context: any): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly'
        };
        return of(response);
    }

    submitUccDeveloperTransfer(context: any): Observable<Response> {
        const response = {
            statusCode: 200,
            message: 'Form submitted correctly'
        };
        return of(response);

    }

}
