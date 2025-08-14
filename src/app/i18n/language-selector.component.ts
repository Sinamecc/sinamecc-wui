import { Component, OnInit, Input } from '@angular/core';

import { I18nService } from './i18n.service';
import { Languages } from './languages';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: false,
})
export class LanguageSelectorComponent implements OnInit {
  @Input() icon = false;

  language = {
    [Languages.SPANISH]: {
      flag: '🇨🇷',
      name: 'Español',
    },
    [Languages.ENGLISH]: {
      flag: '🇺🇸',
      name: 'English',
    },
  };

  constructor(private i18nService: I18nService) {}

  ngOnInit() {}

  setLanguage(language: string) {
    this.i18nService.language = language;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }
}
