import { js_beautify } from 'js-beautify';
import { LanguageId } from '../languageMode';
import { JSLanguageMode } from './javascriptMode';

/** JavaScript语言模块 */
export class TSLanguageMode extends JSLanguageMode {
    constructor(template: RegExp | undefined = undefined) {
        super(template);
    }
    override languageId: LanguageId = 'typescript';
}