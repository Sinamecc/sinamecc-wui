import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {By} from "@angular/platform-browser";
import { Router } from '@angular/router';
import { SharedModule } from '@app/shared';
import { CoreModule, AuthenticationService, MockAuthenticationService } from '@app/core';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let router: Router;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,NoopAnimationsModule,SharedModule,CoreModule],
      declarations: [ HomeComponent ],
      providers: [{provide: Router, useValue: router},{ provide: AuthenticationService, useClass: MockAuthenticationService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have atribute href', () => {
    let href = fixture.debugElement.query(By.css('a')).nativeElement
    .getAttribute('href');
    expect(href).toEqual('http://www.sinamecc.go.cr/');
  });

});
