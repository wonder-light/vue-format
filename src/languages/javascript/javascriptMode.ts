import { js_beautify } from 'js-beautify';
import { EndOfLine, Range, TextDocument, TextEdit, workspace } from 'vscode';
import { LanguageId, LanguageMode } from './../languageMode';

/** JavaScript语言模块 */
export class JSLanguageMode implements LanguageMode {
    languageId: LanguageId = 'javascript';
    async format(document: TextDocument): Promise<TextEdit[]> {
        //文档的更改
        const edits: TextEdit[] = [];
        /** 文档文本 */
        let text = document.getText();
        /** javascript文档范围 */
        const js = text.match(/<script[\w\W]+<\/script>\s?/);
        if (!js || js.index === undefined) {
            return [];
        }
        let jsText = js[0];
        /** HTML文档范围 */
        let range = new Range(document.positionAt(js.index), document.positionAt(js.index + jsText.length));
        /** javascript.format配置 */
        //let config = workspace.getConfiguration("javascript").get<any>("format");
        /** 格式化值 */
        //let value = await commands.executeCommand<any>('vscode.executeFormatRangeProvider', document.uri, range, config);
        //if(value) return value;

        /** vue-format.javascript配置 */
        let config = workspace.getConfiguration("vue-format").get<any>("javascript");

        //未启用
        if (!config || config.disabled) {
            return [];
        }

        //设置行尾字符
        if (config.eol === "auto") {
            config.eol = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
        }

        /** 格式化后的文本 */
        let format: string = js_beautify(jsText, config.format);
        //添加更改
        edits.push(TextEdit.replace(range, format));

        return edits;
    }
}