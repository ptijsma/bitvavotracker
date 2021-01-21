"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const workspaceFolderHelpers_1 = require("./workspaceFolderHelpers");
function getWorkspaceSettings(workspacePath) {
    workspacePath = workspacePath === undefined ? workspaceFolderHelpers_1.currentWorkspaceFolder() : workspacePath;
    const fileUri = workspacePath !== undefined ? vscode.Uri.file(workspacePath) : null;
    const bvConfig = vscode.workspace.getConfiguration('bvtracker', fileUri);
    const settings = {
        workspacePath: workspacePath,
        bvConfigurationSettings: {
            apikey: bvConfig.get('apiKey'),
            apisecret: bvConfig.get('apiSecret'),
            basecurrency: bvConfig.get('baseCurrency'),
            cryptocurrencies: bvConfig.get('cryptoCurrencies'),
            updateinterval: bvConfig.get('updateInterval'),
            hidezerovalues: bvConfig.get('hideZeroValues'),
            showrates: bvConfig.get('showRates'),
            lowcolor: bvConfig.get('lowColor'),
            highcolor: bvConfig.get('highColor'),
            othercolor: bvConfig.get('otherColor'),
            totalwarningthresholdtriggers: bvConfig.get('totalWarningThresholdTriggers')
        },
    };
    return settings;
}
exports.getWorkspaceSettings = getWorkspaceSettings;
