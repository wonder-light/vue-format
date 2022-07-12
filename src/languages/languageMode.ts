import { Range, TextDocument, TextEdit } from "vscode";

/** 语言类型 */
export type LanguageId =
    | 'html'
    | 'css'
    | 'javascript';

/** 语言模块 */
export interface LanguageMode {
    /** 语言Id */
    languageId: LanguageId;

    /**
     * 格式化文档
     * @param {TextDocument} document 需要格式化的文档
     * @return {TextEdit[]} 应用于文档的更改
     */
    format(document: TextDocument): Promise<TextEdit[]>;
}

/** 语言模块的文档范围 */
export interface LanguageModeRange extends LanguageMode, Range {
    attributeValue?: boolean;
}

/** 语言模块集合 */
export class LanguageModes {
    /** 语言模块集合 */
    private modes: { [K in LanguageId]: LanguageMode | undefined } = {
        html: undefined,
        css: undefined,
        javascript: undefined
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
}