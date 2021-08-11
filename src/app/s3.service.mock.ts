import { S3File } from './s3.service';

export class MockS3Service {
  public async downloadResource(filePath: string): Promise<S3File> {
    const file = new Blob([Math.random().toString(36).substring(7)], { type: 'text/plain' });

    const s3File: S3File = {
      filename: 'file.txt',
      data: file,
    };
    return s3File;
  }
}
