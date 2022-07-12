import { commands, ExtensionContext, TextEdit, window, workspace, WorkspaceEdit } from 'vscode';
import { CSSLanguageMode } from './languages/css/cssMode';
import { HtmlLanguageMode } from './languages/html/htmlMode';
import { JSLanguageMode } from './languages/javascript/javascriptMode';
import { LanguageModes } from './languages/languageMode';

/** 语言模块集合 */
const languageModes = new LanguageModes();
languageModes.addLanguageMode(new HtmlLanguageMode());
languageModes.addLanguageMode(new JSLanguageMode());
languageModes.addLanguageMode(new CSSLanguageMode());


/**
 * 激活扩展
 * @param {ExtensionContext} context 上下文参数
 */
export function activate(context: ExtensionContext) {
    // 注册命令，该命令和package.json中命令一致
    let disposable = commands.registerCommand('extension.vueFormat', async function () {
        /** 激活的文档编辑器 */
        let activeEditor = window.activeTextEditor;
        if (!activeEditor || activeEditor.document.languageId !== 'vue') {
            window.showInformationMessage('这不是 vue 文件');
            return;
        }
        let document = activeEditor.document;
        /**  应用于文档的更改 */
        const allEdits: TextEdit[] = [];
        //获取文档中的所有语言模式范围
        const modes = languageModes.getAllLanguageModesInDocument();
        for (const mode of modes) {
            //格式化
            (await mode.format(document)).forEach(textEdit => allEdits.push(textEdit));
        }

        const edit = new WorkspaceEdit();
        //设置文档更改
        edit.set(document.uri, allEdits);
        //应用更改
        workspace.applyEdit(edit);
    });

    //添加命令
    context.subscriptions.push(disposable);
}

/**
 * 禁用扩展
 */
export function deactivate() { }
