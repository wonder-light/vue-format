import { js_beautify } from 'js-beautify';
import { LanguageId, LanguageMode } from './../languageMode';

/** JavaScript语言模块 */
export class JSLanguageMode extends LanguageMode {
    constructor(template: RegExp | undefined = undefined) {
        super(template);
        if(template !== undefined){
            this.offsetLine = 1;
        }
    }
    override languageId: LanguageId = 'javascript';

    override async formatText(matchText: string, formatConfig: any): Promise<string> {
        return js_beautify(matchText, formatConfig);
    }
}