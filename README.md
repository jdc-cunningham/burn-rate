### Burn Rate PWA
This is a basic app that pulls data from a spreadsheet, namely a finance spreadsheet that keeps track of cash/credit/other assets.
Then based on your monthly/yearly needs this app tells you how many months/years you have till you run dry.
This is a peace of mind thing for me, the numbers.

### Requirements
You need a Google account for a spreadsheet and the necessary API credentials eg. oAuth client ID and API key

### Demo Spreadsheet Structure
[Here is the structure](https://docs.google.com/spreadsheets/d/e/2PACX-1vQHw1wCz_OOe08odWfhOrRjsvioxajeWgFCA7npzrfHedI74tSjJ_Y3FlVN1CrTDKLEMFu6W1oW-sGp/pubhtml) I'm using
I realized it would be more helpful for context to know what the spreadsheet I was coding around looked like. It does not have to be like this but this code is written for that spreadsheet design.

Further explanation:

**Net Worth Tab**
The debt is the summation of all the credit cards.
Cash is summation of banks/other forms of money eg. crypto/stocks. It's arguable that you can lump those together since they fluctuate.
Then `Current Monies` is just the difference.

**Bills**
This has different "levels" eg. `bare min` and `total`. `bare min` is no food/gas factored in. Those are dynamic eg. I could eat less or have a job that was not as far, etc... Also in the past my financial life imploded so I destroyed my credit so these are all generally bad, low limit credit cards. I would personally advise not to have so many because of how hard it is to track them all and the ones with annual fees suck.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).