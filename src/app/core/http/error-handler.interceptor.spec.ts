import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { ErrorHandlerInterceptor } from '@app/core/http/error-handler.interceptor';

describe('ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  function createInterceptor() {
    errorHandlerInterceptor = new ErrorHandlerInterceptor(router);
    return errorHandlerInterceptor;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useFactory: createInterceptor,
        multi: true
      }]
    });
    router = TestBed.get(Router)
  });

  beforeEach(inject([
    HttpClient,
    HttpTestingController
  ], (_http: HttpClient,
      _httpMock: HttpTestingController) => {

    http = _http;
    httpMock = _httpMock;
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch error and call error handler', () => {
    // Arrange
    // Note: here we spy on private method since target is customization here,
    // but you should replace it by actual behavior in your app
    spyOn(ErrorHandlerInterceptor.prototype as any, 'errorHandler');

    // Act
    http.get('/toto').subscribe(() => {}, () => {
      // Assert
      expect(ErrorHandlerInterceptor.prototype['errorHandler']).toHaveBeenCalled();
    });

    httpMock.expectOne({}).flush(null, {
      status: 404,
      statusText: 'error'
    });
  });
});
