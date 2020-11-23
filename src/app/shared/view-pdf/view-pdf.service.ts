import { Injectable } from "@angular/core";
import { S3File, S3Service } from "@app/core";

@Injectable()
export class ViewPdfService {
	constructor(private s3: S3Service) {}

	public async downloadResource(filePath: string): Promise<S3File> {
		return this.s3.downloadResource(filePath);
	}
}
