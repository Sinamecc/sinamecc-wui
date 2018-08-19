import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from '@app/home/quote.service';
import { HomeService } from '@app/home/home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  quote: string;
  backendMessage: string;
  statusCode: number;
  isLoading: boolean;

  constructor(private quoteService: QuoteService, 
              private homeService: HomeService) { }

  ngOnInit() {
    this.isLoading = true;
     /* this.quoteService.getRandomQuote({ category: 'dev' })
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((quote: string) => { this.quote = quote; }); 

      */

    // instead of loading a chuck norris quote, we contact with the python api
    // and if answers 200, we show this as a health status.
     this.homeService.getHealthStatus()
    .pipe(finalize(() => { this.isLoading = false; })) 
    .subscribe((backendMessage: string) => { this.backendMessage = backendMessage; }); 
    
  }

}
