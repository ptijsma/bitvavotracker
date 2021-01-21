# bitvavotracker README

Use this Visual Studio Code extension to track your favorite crypto currencies you have in your Bitvavo wallet.

Simply start and stop the tracker from the command palette:

![Command Palette](https://github.com/ptijsma/bitvavotracker/blob/main/commands.png)

## Features

* Selection of crypto currencies from your wallet to show in the statusbar
* Specify a low and high color
* Possibility to define trigger values (you'll receive a warning when the wallet value reaches this value)

![example](https://github.com/ptijsma/bitvavotracker/blob/main/statusbarexample.png)

## Extension Settings

This extension contributes the following settings:

* `bvtracker.apikey`: The Bitvavo key to use. See https://account.bitvavo.com/user/api
* `bvtracker.apisecret`: The Bitvavo secret to use. See https://account.bitvavo.com/user/api
* `bvtracker.basecurrency`: The base currency to use. I.e. EUR
* `bvtracker.cryptocurrencies`: The cryptocurrencies to show in the statusbar. Seperate each currency with a semi-colon. I.e. BTC;NANO
* `bvtracker.updateinterval`: Tracker interval in ms. Default is 5000 (5 sec.)
* `bvtracker.hidezerovalues`: Hide currencies without values (to save space on the statusbar)
* `bvtracker.showrates`: Shows the currency rate next to the value
* `bvtracker.lowcolor`: The color to use when price is lower since the last update
* `bvtracker.highcolor`: The color to use when price is higher since the last update
* `bvtracker.othercolor`: The color to use for other elements
* `bvtracker.totalwarningthresholdtriggers`: Semi-colon seperated list of values to use as threshold triggers. When the total value reaches a threshold, a warning message is displayed and the trigger is removed for this session.

