import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Inject, forwardRef } from '@angular/core';

export interface S3File {
  filename: string;
  data: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  constructor(
    @Inject(forwardRef(() => CredentialsService)) private credentialsService: CredentialsService,
    private httpClient: HttpClient
  ) {}

  public async downloadResource(filePath: string): Promise<S3File> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
      observe: 'response' as 'body',
    };

    const regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches;
    const file = await this.httpClient.get<any>(filePath, httpOptions).toPromise();

    const str = file.headers.get('Content-Disposition');
    matches = str.match(regex);

    return {
      filename: matches[1].replace(/['"]+/g, ''),
      data: file.body,
    };
  }
}
