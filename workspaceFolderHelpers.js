const vscode = require('vscode') ;
function currentWorkspaceFolder() {
    let workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.workspace.workspaceFolders[0].uri);
    let activeTextEditorDocumentUri = null;
    try {
        activeTextEditorDocumentUri = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
    } catch (error) {
        activeTextEditorDocumentUri = null;
    };

    if (activeTextEditorDocumentUri) { workspaceFolder = activeTextEditorDocumentUri};
    return workspaceFolder.uri.fsPath;
};
exports.currentWorkspaceFolder = currentWorkspaceFolder;