import { EndOfLine, Range, TextDocument, TextEdit, workspace } from "vscode";


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

    /** 语言Id */
    languageId: LanguageId = 'vue';
    /** 配置前缀 */
    configurePrefix: string = 'vue-format';
    /**
     * 格式化文档
     * @param {TextDocument} document 需要格式化的文档
     * @return {TextEdit[]} 应用于文档的更改
     */
    async format(document: TextDocument): Promise<TextEdit[]> {
        //文档的更改
        const edits: TextEdit[] = [];
        /** 文档文本 */
        let text = document.getText();
        const config = this.getFormattingConfig(document);

        /** 获取对应范围内的变化 */
        const getRangeChange = async (start: number, end: number, text: string) => {
            const range = new Range(document.positionAt(start), document.positionAt(end));
            const format = await this.formatText(text, config);
            return TextEdit.replace(range, format);
        };

        //分段匹配
        if (this.matchTemplate) {
            let result = text.match(this.matchTemplate);
            if (!result || result.length <= 0) {
                return [];
            }
            for (const match of result) {
                //获取第一次匹配的索引位置
                let start = text.indexOf(match);
                if (start === -1) {
                    continue;
                }
                edits.push(await getRangeChange(start, start + match.length, match));
            }
        }
        else {
            /** 整个文档范围 */
            edits.push(await getRangeChange(0, text.length, text));
        }

        return edits;
    }

    /**
     * 格式化指定的文本
     * @param {string} matchText 需要格式化的文本
     * @return {string3} 格式化后的文本
     */
    async formatText(matchText: string, formatConfig: any): Promise<string> {
        return matchText;
    }

    /**
     * 获取格式化配置
     */
    getFormattingConfig(document: TextDocument): any {
        /** vue-format.javascript配置 */
        let config = workspace.getConfiguration(this.configurePrefix).get<any>(this.languageId);

        //未启用
        if (!config || config.disabled) {
            return undefined;
        }

        //设置行尾字符
        if (config.eol === "auto") {
            config.eol = document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
        }

        return config.format;
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