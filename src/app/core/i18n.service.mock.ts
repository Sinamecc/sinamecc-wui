import { Injectable, Inject, forwardRef } from '@angular/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { includes } from 'lodash';

import { Logger } from '@app/core/logger.service';
import * as enUS from '../../translations/en-US.json';
// import * as frFR from '../../translations/fr-FR.json';
import * as esCR from '../../translations/es-CR.json';
import { Subject } from 'rxjs';
import { MockTranslateService } from '@app/core/translate.service.mock.js';

const log = new Logger('I18nService');
const languageKey = 'language';

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param {string} s The string to extract for translation.
 * @return {string} The same string.
 */
export function extract(s: string) {
  return s;
}

export class MockI18nService {

  defaultLanguage: string;
  supportedLanguages: string[];
  translateService: MockTranslateService = new MockTranslateService;
  // constructor(@Inject(forwardRef(() => AuthenticationService)) private authenticationService: AuthenticationService,

  // constructor(@Inject(forwardRef(() => MockTranslateService)) translateService: MockTranslateService) {
  //   // Embed languages to avoid extra HTTP requests
  //   this.translateService = translateService;
  //   this.translateService.setTranslation('en-US', enUS);
  //   // translateService.setTranslation('fr-FR', frFR);
  //   this.translateService.setTranslation('es-CR', esCR);
  // }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param {!string} defaultLanguage The default language to use.
   * @param {Array.<String>} supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';
    // let onLangChangeSpy: jasmine.Spy;
    // Create spies
    // onLangChangeSpy = jasmine.createSpy('onLangChangeSpy');
    // this.translateService.onLangChange
    //   .subscribe((event: LangChangeEvent) => {
    //     onLangChangeSpy(event.lang);
    //   });

    // this.translateService.onLangChange
    //   .subscribe((event: LangChangeEvent) => { localStorage.setItem(languageKey, event.lang); });
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param {string} language The IETF language code to set.
   */
  set language(language: string) {
    language = language || localStorage.getItem(languageKey) || 'en-US';
    let isSupportedLanguage = includes(this.supportedLanguages, language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  /**
   * Gets the current language.
   * @return {string} The current language code.
   */
  get language(): string {
    return 'en-US';
  }

}
