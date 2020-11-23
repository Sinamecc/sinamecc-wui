import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ViewPdfService } from "./view-pdf.service";

@Component({
	selector: "app-view-pdf",
	templateUrl: "./view-pdf.component.html",
	styleUrls: ["./view-pdf.component.scss"]
})
export class ViewPdfComponent implements OnInit {
	isLoading = false;
	documentURl: string;
	documentID: string;
	document: any;

	constructor(
		private service: ViewPdfService,
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit() {
		this.documentID = this.route.snapshot.paramMap.get("id");
		this.documentURl = this.route.routeConfig.path.includes("ppcn")
			? `/api/v1/ppcn/34/ppcn_file/${this.documentID}`
			: "";
		this.download(this.documentURl);
	}

	async download(file: string) {
		this.isLoading = true;
		const blob = await this.service.downloadResource(file);

		const blobPDF = new Blob([blob.data], { type: "application/pdf" });
		this.document = this.sanitizer.bypassSecurityTrustResourceUrl(
			URL.createObjectURL(blobPDF)
		);

		this.isLoading = false;
	}
}
