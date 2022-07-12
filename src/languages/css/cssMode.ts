import { css_beautify } from 'js-beautify';
import { EndOfLine, Range, TextDocument, TextEdit, workspace } from 'vscode';
import { LanguageId, LanguageMode } from '../languageMode';

/** CSS语言模块 */
export class CSSLanguageMode implements LanguageMode {
    languageId: LanguageId = 'css';
    async format(document: TextDocument): Promise<TextEdit[]> {
        //文档的更改
        const edits: TextEdit[] = [];
        /** 文档文本 */
        let text = document.getText();
        /** css文档范围 */
        const css = text.match(/<style[\w\W]+<\/style>\s?/);
        if (!css || css.index === undefined) {
            return [];
        }
        let cssText = css[0];
        /** css文档范围 */
        let range = new Range(document.positionAt(css.index), document.positionAt(css.index + cssText.length));
        /** css.format配置 */
        //let config = workspace.getConfiguration("css").get<any>("format");
        /** css格式化 */
        //let value = await commands.executeCommand('vscode.executeFormatRangeProvider', document.uri, range, config);
        //if(value) return value;

        /** vue-format.css配置 */
        let config = workspace.getConfiguration("vue-format").get<any>("css");

        //未启用
        if (!config || config.disabled) {
            return [];
        }

        //设置行尾字符
        if (config.eol === "auto") {
            config.eol = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
        }

        /** 格式化后的文本 */
        let format: string = css_beautify(cssText, config.format);
        //添加更改
        edits.push(TextEdit.replace(range, format));

        return edits;
    }
}