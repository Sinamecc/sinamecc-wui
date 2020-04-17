import { AuthenticationService } from "@app/core";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, Inject, forwardRef } from '@angular/core';

export interface S3File {
  filename: string;
  data: Blob;
}

@Injectable()
export class S3Service {


  constructor(@Inject(forwardRef(() => AuthenticationService)) private authenticationService: AuthenticationService,
    private httpClient: HttpClient) { }


  public async downloadResource(filePath: string): Promise<S3File> {

    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      }),
      observe: 'response' as 'body'
    };

    let regex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches;
    const file = await this.httpClient.get<any>(
      filePath, httpOptions
    ).toPromise();

    let str = file.headers.get('Content-Disposition');
    matches = str.match(regex);

    return {
      filename: matches[1].replace(/['"]+/g, ''),
      data: file.body
    };

  }

}


