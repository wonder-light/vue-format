import { commands, ExtensionContext, languages, window, workspace, WorkspaceEdit } from 'vscode';
import { createLanguageModes, documentFormattingEdit } from './api';
import { languageIds } from './languages/languageMode';


/**
 * 激活扩展
 * @param {ExtensionContext} context 上下文参数
 */
export function activate(context: ExtensionContext) {
    /** 激活的文档编辑器 */
    const document = window.activeTextEditor?.document;
    if (!document) {
        return;
    }

    // 注册命令，该命令和package.json中命令一致
    let disposable = commands.registerCommand('extension.vueFormat', async function () {
        /** 语言模块集合 */
        const languageModes = createLanguageModes(document);
        if (!languageModes) {
            return;
        }
        const edit = new WorkspaceEdit();
        let result = await languageModes.getDocumentChanges(document);
        //设置文档更改
        edit.set(document.uri, result);
        //应用更改
        workspace.applyEdit(edit);
    });

    //提供格式化文档程序
    languages.registerDocumentFormattingEditProvider(languageIds, { provideDocumentFormattingEdits: documentFormattingEdit });

    //注入命令
    context.subscriptions.push(disposable);
}

/**
 * 释放扩展
 */
export function deactivate() { }
