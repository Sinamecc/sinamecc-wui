import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MobileService {
  private readonly isMobile = new BehaviorSubject<boolean>(false);
  public readonly isMobile$ = this.isMobile.asObservable();

  public setIsMobile(isMobile: boolean): void {
    if (this.isMobile.value !== isMobile) {
      this.isMobile.next(isMobile);
    }
  }

  public get isMobileValue(): boolean {
    return this.isMobile.value;
  }
}
