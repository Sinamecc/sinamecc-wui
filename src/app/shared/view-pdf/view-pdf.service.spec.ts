import { TestBed, inject } from "@angular/core/testing";

import { ViewPdfService } from "./view-pdf.service";

describe("ViewPdfService", () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ViewPdfService]
		});
	});

	it("should be created", inject(
		[ViewPdfService],
		(service: ViewPdfService) => {
			expect(service).toBeTruthy();
		}
	));
});
