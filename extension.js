const vscode = require('vscode');
const bvtracker = require('./bvtracker');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('bvtracker.startTicker', function () {
		bvtracker.startTicker();
	});
	let disposable1 = vscode.commands.registerCommand('bvtracker.stopTicker', function () {
		bvtracker.stopTicker();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable1);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
