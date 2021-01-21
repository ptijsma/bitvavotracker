const vscode = require('vscode');

var workspacePath;
var settings;
var bitvavoprivate;

var interval;
var tickers= {};
var portfolioDetail = {};
var currencies = {};
var priority = 2000;
var idle = true;
var started = false;
var initial = 0;
var high = 0;
var low = 0;
var thresholds = {};

function startTicker() {
    if (started) { return }

    started = true;
    settings = require('./settings').getWorkspaceSettings(workspacePath).bvConfigurationSettings;
    if (settings.cryptocurrencies === undefined || settings.cryptocurrencies === '') {
        return;
    }

    bitvavoprivate = require('bitvavo')().options({
        APIKEY: settings.apikey,
        APISECRET: settings.apisecret
    });

    currencies = settings.cryptocurrencies.split(';');
    thresholds = settings.totalwarningthresholdtriggers.split(';');

    getBalance();
    interval = setInterval(function(){ getBalance(); }, settings.updateinterval);
}
function stopTicker() {
    if (interval != null) {
        clearInterval(interval);
    }
    for(var index in tickers) {
        tickers[index].hide();
    }
    started = false;
}

function updateStatusBarItem(symbol, statusText, color) {
    if (tickers[symbol] === undefined) {
        tickers[symbol] = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, priority);
        priority ++;
    }
    tickers[symbol].text = statusText;
    tickers[symbol].startTicker
    tickers[symbol].color = color;
    tickers[symbol].show();
}

function getBalance() {
    var prices = {};
    var portfolioTotal = 0;
    var sign = '';
    switch (settings.basecurrency) {
        case 'EUR': { sign = '€'; break; }
        case 'USD': { sign = '$'; break; }
        default: { sign = settings.basecurrency.toLowerCase() }
    }
    if (!idle) { return }

    idle = false;
    bitvavoprivate.tickerPrice({ }, (error, response) => {
        if (error === null) {
            for(var index in response) {
                prices[response[index].market] = parseFloat(response[index].price); 
            }

            bitvavoprivate.balance({}, (error, response) => {
                if (error === null) {
                    for(var index in response) {
                        if (currencies.includes(response[index].symbol)) {
                            var messageText = '';
                            if (parseFloat(response[index].available) !== 0 || !settings.hidezerovalues) {
                                var pocket = (response[index].symbol === settings.basecurrency ? parseFloat(response[index].available) : (parseFloat(response[index].available) * prices[response[index].symbol + '-' + settings.basecurrency]));
                                
                                messageText = `${response[index].symbol}: ${sign} ${pocket.toFixed(2)}`;
                                if (response[index].symbol != settings.basecurrency && settings.showrates) { 
                                    messageText += ` (${parseFloat(response[index].available)}|${prices[response[index].symbol + '-' + settings.basecurrency]})`
                                }

                                if (portfolioDetail[response[index].symbol] === undefined) { portfolioDetail[response[index].symbol] = 0 }
                                var color = (pocket >= portfolioDetail[response[index].symbol] ? settings.highcolor : settings.lowcolor);
                                portfolioDetail[response[index].symbol] = pocket;

                                updateStatusBarItem(response[index].symbol, messageText, color);
                                portfolioTotal += pocket;
                            }   
                        }
                    }
                    var color = (portfolioTotal >= portfolioDetail['TOTAL'] ? settings.highcolor : settings.lowcolor);
                    updateStatusBarItem('TOTAL', `∑ ${sign} ${portfolioTotal.toFixed(2)} `, color);
                    if (initial === 0) {
                        initial = portfolioTotal;
                        updateStatusBarItem('INITIAL', `► ${sign} ${initial.toFixed(2)} `, settings.othercolor);
                    }
                    if (portfolioTotal > high) {
                        high = portfolioTotal;
                        updateStatusBarItem('HIGH', `▲ ${sign} ${high.toFixed(2)} `, settings.othercolor);
                    }
                    if (low === 0 || portfolioTotal < low) {
                        low = portfolioTotal;
                        updateStatusBarItem('LOW', `▼ ${sign} ${low.toFixed(2)} `, settings.othercolor);
                    }
                    for (var entry in thresholds) {
                        var removeEntry = false;
                        if (portfolioDetail['TOTAL'] <= parseFloat(thresholds[entry]) && portfolioTotal > parseFloat(thresholds[entry])) {
                            vscode.window.showWarningMessage(`Bitvavo: Your balance has superseded the predefined threshold of ${sign} ${parseFloat(thresholds[entry])} (threshold removed)`)
                            removeEntry = true;
                        }
                        if (portfolioDetail['TOTAL'] > parseFloat(thresholds[entry]) && portfolioTotal <= parseFloat(thresholds[entry])) {
                            vscode.window.showWarningMessage(`Bitvavo: Your balance has dropped below the predefined threshold of ${sign} ${parseFloat(thresholds[entry])} (threshold removed)`)
                            removeEntry = true;
                        }
                        if (removeEntry) {
                            thresholds.splice(entry,1);
                        }
                    }
                    portfolioDetail['TOTAL'] = portfolioTotal;
                } else {
                    showError(error)
                }
                idle = true;
            });

        } else {
            showError(error);
        }
    });
}

function showError(messageTxt) {
    vscode.window.showErrorMessage(messageTxt);
}

exports.getBalance = getBalance;
exports.startTicker = startTicker;
exports.stopTicker = stopTicker;
