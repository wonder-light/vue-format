import { EndOfLine, TextDocument, TextEdit, workspace } from "vscode";
import { configurePrefix, getRange, getRangeText } from "../api";


/** 语言类型 */
export type LanguageId =
    | 'vue'
    | 'html'
    | 'css'
    | 'javascript'
    | 'typescript';

/** 语言类型数组 */
export const languageIds: LanguageId[] = ['vue', 'html', 'css', 'javascript', 'typescript'];

/** 语言模块 */
export class LanguageMode {
    /**
     * 语言模块构造函数
     * @param {RegExp} template 正则匹配的模板
     */
    constructor(template: RegExp | undefined = undefined) {
        this.matchTemplate = template;
    }
    /** 需要匹配模板 */
    matchTemplate: RegExp | undefined = undefined;
    /** 偏移的行 */
    offsetLine: number = 0;
    /** 语言Id */
    languageId: LanguageId = 'vue';
    /**
     * 格式化文档
     * @param {TextDocument} document 需要格式化的文档
     * @return {TextEdit[]} 应用于文档的更改
     */
    async format(document: TextDocument): Promise<TextEdit[]> {
        //文档的更改
        const edits: TextEdit[] = [];
        const config = this.getFormattingConfig(document);

        if (!config) {
            return [];
        }

        //分段匹配
        if (this.matchTemplate) {
            edits.push(...(await this.formatRange(document, config)));
        }
        else {
            /** 整个文档范围 */
            edits.push(await this.formatDocument(document, config));
        }

        return edits;
    }

    /**
     * 格式化指定的文本
     * @param {string} matchText 需要格式化的文本
     * @return {string3} 格式化后的文本
     */
    protected async formatText(matchText: string, formatConfig: any): Promise<string> {
        return matchText;
    }

    /**
     * 格式化文档
     * @param {TextDocument} document 指定的文档
     * @param {any} formatConfig 格式化配置
     */
    protected async formatDocument(document: TextDocument, formatConfig: any): Promise<TextEdit> {
        let text = document.getText();
        let end = text.length;
        text = await this.formatText(text, formatConfig);
        return TextEdit.replace(getRange(document, 0, end), text);
    }

    /**
     * 格式化指定的范围
     * @param {TextDocument} document 指定的文档
     * @param {any} formatConfig 格式化配置
     * @return {}
     */
    protected async formatRange(document: TextDocument, formatConfig: any): Promise<TextEdit[]> {
        const edits: TextEdit[] = [];
        if (!this.matchTemplate) {
            return edits;
        }
        let doc = document.getText();
        //匹配的结果
        let result = doc.match(this.matchTemplate);
        if (!result || result.length <= 0) {
            return edits;
        }


        for (const match of result) {
            //获取第一次匹配的索引位置
            let start = doc.indexOf(match);
            if (start === -1) {
                continue;
            }
            const { range, text } = getRangeText(document, start, start + match.length, this.offsetLine);
            const format = await this.formatText(text, formatConfig);
            edits.push(TextEdit.replace(range, format));
        }

        return edits;
    }

    /**
     * 获取格式化配置
     */
    getFormattingConfig(document: TextDocument): any {
        /** vue-format.javascript配置 */
        let config = workspace.getConfiguration(configurePrefix).get<any>(this.languageId);

        config = Object.assign({}, config);

        //未启用
        if (!config || config.disabled) {
            return undefined;
        }

        //设置行尾字符
        if (config.eol === "auto") {
            config.eol = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
        }

        return config;
    }
}

/** 语言模块集合 */
export class LanguageModes {
    /** 语言模块集合 */
    private modes: { [K in LanguageId]: LanguageMode | undefined } = {
        vue: undefined,
        html: undefined,
        css: undefined,
        javascript: undefined,
        typescript: undefined
    };
    /**
     * 获取文档中的所有语言模式
     * @return {LanguageMode} LanguageModeRange
     */
    getAllLanguageModesInDocument(): LanguageMode[] {
        const result: LanguageMode[] = [];
        //获取有效的语言
        for (const key in this.modes) {
            const mode = this.modes[key as LanguageId];
            if (mode) {
                result.push(mode);
            }
        }
        return result;
    }

    /**
     * 添加语言模块
     * @param {LanguageMode} mode 模块
     * @return {void}
     */
    addLanguageMode(mode: LanguageMode): void {
        this.modes[mode.languageId] = mode;
    }

    /**
     * 移除所有语言模块
     */
    removeAllLanguageModes(): void {
        for (const key in this.modes) {
            delete this.modes[key as LanguageId];
        }
    }

    /**
     * 获取应用于文档的更改
     * @param {TextDocument} document 激活的文档
     * @return {TextEdit[]} 文档更改
     */
    async getDocumentChanges(document: TextDocument): Promise<TextEdit[]> {
        /**  应用于文档的更改 */
        const allEdits: TextEdit[] = [];
        //获取文档中的所有语言模式范围
        const modes = this.getAllLanguageModesInDocument();
        for (const mode of modes) {
            //格式化
            allEdits.push(...(await mode.format(document)));
        }
        return allEdits;
    }
}