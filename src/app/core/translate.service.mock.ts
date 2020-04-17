import { Subject } from 'rxjs/Subject';

export class MockTranslateService {

    currentLang: string;
    onLangChange = new Subject();

    use(language: string) {
        this.currentLang = language;
        this.onLangChange.next({
            lang: this.currentLang,
            translations: {}
        });
    }

    getBrowserCultureLang() {
        return 'en-US';
    }

    setTranslation(lang: string, translations: Object, shouldMerge?: boolean) { }

}
