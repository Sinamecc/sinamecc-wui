/*
 * Use the Page Object pattern to define the page under test.
 * See docs/coding-guide/e2e-tests.md for more info.
 */

import { browser, element, by } from 'protractor';

export class AppPage {
  usernameField = element(by.css('input[formControlName="username"]'));
  passwordField = element(by.css('input[formControlName="password"]'));
  loginButton = element(by.css('button[type="submit"]'));

  constructor() {
    // Forces default language
    this.navigateTo();
    browser.executeScript(() => localStorage.setItem('language', 'en-US'));
  }

  navigateTo() {
    return browser.get('/');
  }

  login() {
    this.usernameField.sendKeys('admin');
    this.passwordField.sendKeys('cambiame');
    this.loginButton.click();
  }

  getParagraphText() {
    // console.log('CONSOLEEEE LOGGGG', element(by.css('app-root')));
    // browser.get('/')
    return element(by.css('app-root mat-toolbar')).getText();
  }
}
