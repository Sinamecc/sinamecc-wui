import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface S3File {
  filename: string;
  data: Blob;
}

@Injectable({
  providedIn: 'root',
})
export class S3Service {
  constructor(private httpClient: HttpClient) {}

  public async downloadResource(filePath: string, filename: string = ''): Promise<S3File> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      observe: 'response' as 'body',
    };
    const file = await this.httpClient.get<any>(filePath, httpOptions).toPromise();

    return {
      filename: filename ? filename : 'file',
      data: file.body,
    };
  }
}
