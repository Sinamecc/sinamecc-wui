import { Response, Version, Report, ReportContext } from "./report.service";
import { Observable } from "rxjs";
import { MockS3Service } from "@app/core/s3.service.mock";
import { of } from "rxjs/observable/of";
import * as _moment from 'moment';
import { S3File } from "@app/core/s3.service";
const moment = _moment;

export class MockReportService {
    s3: MockS3Service;
    submitReport(context: ReportContext): Observable<Response> {
        return of({
            statusCode: 200,
            message: 'Form submitted correctly',
            id: '001'
        });
    }
    
    submitReportVersion(context: ReportContext, id: number): Observable<Response> {
        return of({
            statusCode: 200,
            message: 'Form submitted correctly',
            id: '001'
        });
    }

    reports(): Observable<Report[]> {
        return of([
            {
                name: 'Report 1',
                created: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY'),
                updated: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY')
            },
            {
                name: 'Report 2',
                created: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY'),
                updated: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY')
            },
            {
                name: 'Report 3',
                created: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY'),
                updated: moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)))
                    .format('MM/DD/YYYY')
            }
        ]);
    }

    versions(id: number): Observable<Version[]> {
        return of([
            {
                version: '1.0.0',
                file: Math.random().toString(64)
            },
            {
                version: '1.0.1',
                file: Math.random().toString(64)
            },
            {
                version: '1.1.0',
                file: Math.random().toString(64)
            },
            {
                version: '1.1.1',
                file: Math.random().toString(64)
            }
        ]);
    }


    public async downloadResource(filePath: string): Promise<S3File> {
        return this.s3.downloadResource(filePath);
    }

    reportVersionsName(id: number): Observable<string> {
        return of('Version Name 01');
    }


}