import { html_beautify } from 'js-beautify';
import { LanguageId, LanguageMode } from '../languageMode';

/** HTML语言模块 */
export class HtmlLanguageMode extends LanguageMode {
    constructor(template: RegExp | undefined = undefined) {
        super(template);
    }
    override languageId: LanguageId = 'html';
    override async formatText(matchText: string, formatConfig: any): Promise<string> {
        return html_beautify(matchText, formatConfig);
    }
}