import { Range, TextDocument, TextEdit, workspace } from "vscode";
import { CSSLanguageMode } from "./languages/css/cssMode";
import { HtmlLanguageMode } from "./languages/html/htmlMode";
import { JSLanguageMode } from "./languages/javascript/javascriptMode";
import { TSLanguageMode } from "./languages/javascript/typescriptMode";
import { LanguageId, languageIds, LanguageModes } from "./languages/languageMode";


/** 配置前缀 */
export const configurePrefix: string = 'vue-format';

/**
 * 从文档创建语言模块集合
 * @param {TextDocument} document 激活的文档
 * @return { LanguageModes | undefined} 语言无效则返回 undefined
 */
export function createLanguageModes(document: TextDocument): LanguageModes | undefined {
    if (!isEnable()) {
        return undefined;
    }

    const id = document.languageId as LanguageId;
    if (!languageIds.includes(id)) {
        return undefined;
    }

    const modes = new LanguageModes();
    switch (id) {
        case 'vue': {
            modes.addLanguageMode(new JSLanguageMode(/<script[\w\W]+<\/script>\s?/));
            modes.addLanguageMode(new CSSLanguageMode(/<style[\w\W]+<\/style>\s?/));
            modes.addLanguageMode(new HtmlLanguageMode(/<template[\w\W]+<\/template>\s?/));
            break;
        }
        case 'css': {
            modes.addLanguageMode(new CSSLanguageMode());
            break;
        }
        case 'html': {
            modes.addLanguageMode(new HtmlLanguageMode());
            break;
        }
        case 'javascript': {
            modes.addLanguageMode(new JSLanguageMode());
            break;
        }
        case 'typescript': {
            modes.addLanguageMode(new TSLanguageMode());
            break;
        }
        default: return undefined;
    }
    return modes;
}


/**
 * 插件是否启用
 */
export function isEnable(): boolean {
    return workspace.getConfiguration(configurePrefix).get<boolean>('enable') ?? false;
}


/**
 * 文档格式化命令
 * @return {}
 */
async function documentFormattingCommand() {

}


/**
 * 文档格式化持续
 * @param {TextDocument} document 文档
 * @return {}
 */
export async function documentFormattingEdit(document: TextDocument): Promise<TextEdit[]> {
    /** 语言模块集合 */
    const languageModes = createLanguageModes(document);
    if (!languageModes) {
        return [];
    }
    let result = await languageModes.getDocumentChanges(document);
    return result;
}



export function getRangeText(document: TextDocument, start: number, end: number, offset: number = 0) {
    let startPosition = document.positionAt(start);
    let endPosition = document.positionAt(end);

    if (offset !== 0) {
        startPosition = startPosition.translate(offset);
        endPosition = endPosition.translate(0 - offset);
    }

    const range = new Range(startPosition, endPosition);
    return { range, text: document.getText(range) };
}


export function getRange(document: TextDocument, start: number, end: number): Range {
    return new Range(document.positionAt(start), document.positionAt(end));
}