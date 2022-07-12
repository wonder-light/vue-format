import { css_beautify } from 'js-beautify';
import { LanguageId, LanguageMode } from '../languageMode';

/** CSS语言模块 */
export class CSSLanguageMode extends LanguageMode {
    constructor(template: RegExp | undefined = undefined) {
        super(template);
    }
    override languageId: LanguageId = 'css';
    override async formatText(matchText: string, formatConfig: any): Promise<string> {
        return css_beautify(matchText, formatConfig);
    }
}