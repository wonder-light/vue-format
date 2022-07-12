import { html_beautify } from 'js-beautify';
import { EndOfLine, Range, TextDocument, TextEdit, workspace } from 'vscode';
import { LanguageId, LanguageMode } from '../languageMode';

/** HTML语言模块 */
export class HtmlLanguageMode implements LanguageMode {
    languageId: LanguageId = 'html';
    async format(document: TextDocument): Promise<TextEdit[]> {
        //文档的更改
        const edits: TextEdit[] = [];
        /** 文档文本 */
        let text = document.getText();
        /** HTML文档范围 */
        const html = text.match(/<template[\w\W]+<\/template>\s?/);
        if (!html || html.index === undefined) {
            return [];
        }
        let htmlText = html[0];
        /** HTML文档范围 */
        let range = new Range(document.positionAt(html.index), document.positionAt(html.index + htmlText.length));
        /** html.format配置 */
        //let config = workspace.getConfiguration("html").get<any>("format");
        /** html格式化 */
        //let value = await commands.executeCommand<TextEdit[]>('vscode.executeFormatRangeProvider', document.uri, range, config);
        //if(value) return value;

        /** vue-format.html配置 */
        let config = workspace.getConfiguration("vue-format").get<any>("html");

        //未启用
        if (!config || config.disabled) {
            return [];
        }

        //设置行尾字符
        if (config.eol === "auto") {
            config.eol = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
        }

        /** 格式化后的文本 */
        let format: string = html_beautify(htmlText, config.format);
        //添加更改
        edits.push(TextEdit.replace(range, format));

        return edits;
    }
}