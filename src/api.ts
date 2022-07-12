import { TextDocument } from "vscode";
import { CSSLanguageMode } from "./languages/css/cssMode";
import { HtmlLanguageMode } from "./languages/html/htmlMode";
import { JSLanguageMode } from "./languages/javascript/javascriptMode";
import { TSLanguageMode } from "./languages/javascript/typescriptMode";
import { LanguageId, languageIds, LanguageModes } from "./languages/languageMode";

/**
 * 从文档创建语言模块集合
 * @param {TextDocument} document 激活的文档
 * @return { LanguageModes | undefined} 语言无效则返回 undefined
 */
export function createLanguageModes(document: TextDocument): LanguageModes | undefined {
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
