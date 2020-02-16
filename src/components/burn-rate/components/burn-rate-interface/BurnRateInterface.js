import React, { useEffect, useState } from 'react';
import './BurnRateInterface.scss';

/**
 * Note: to get this far you need your oAuth working, the interface should show a popup
 * and have you log in. You have to configure this oAuth consent screen, I chose mostly blank answers
 * but what is important are the two links eg. redirect and another one but these for dev purposes
 * are both set to localhost:3000 for now until deployed/have a domain.
 * Also this is designed for a spread sheet with at least 2 tabs, the money tab and the bills tab.
 * They don't have to be in separate Google Spreadsheet tabs but I wrote the code that way as for
 * my case it's better to have two tabs.
 * @param {Object} props 
 */
const BurnRateInterface = (props) => {
    const { gapi, signedIn } = props;
    const [netWorth, setNetWorth] = useState({});
    const [bills, setBills] = useState({});

    const getNetWorth = () => {
        // the range is a top-left, bottom-right rectangle
        // dev: set variable to keep track of last known row then try next row to see if it exists, until legit way to find last row is determined
        gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
            // range: "Net Worth!A2:T3" // you could get all the values, particularly if you were writing to update, currently I'm just doing read only
            range: "Net Worth!R3:T3" // Debt, Cash, Current Monies
		}).then((response) => {
            console.log(response.result);
            if (typeof response.result.values !== "undefined") {
                const netWorthObj = {};
                response.result.values[0].forEach((value, index) => { // assuming row is current, but won't be true
                    if (index === 0) { // ehh enums
                        netWorthObj['debt'] = value;
                    } else if (index === 1) {
                        netWorthObj['cash'] = value;
                    } else {
                        netWorthObj['current monies'] = value;
                    }
                });

                setNetWorth(netWorthObj);
            }
		}, (response) => {
			console.log('Error get net worth: ' + response.result.error.message);
		});
    }

    const getBills = () => {
        gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
			range: "Bills!C15:D16"
		}).then((response) => {
            var range = response.result; // this one is nicer with first part of array being the key
            if (typeof response.result.values !== "undefined") {
                const bills = response.result.values;
                setBills({
                    [bills[0][0]]: bills[0][1],
                    [bills[1][0]]: bills[1][1] // not sure given this structure there is a way to run through this
                });
            }
		}, (response) => {
			console.log('Error get bills: ' + response.result.error.message);
		});
    }

    const concentricInterface = () => {
        return !gapi
            ? null
            : (
                <div className="BurnRateInterface__concentric-interface">

                </div>
            )
    }

    useEffect(() => {
        if (signedIn && gapi && typeof gapi.client !== "undefined") {
            getNetWorth();
            getBills();
        }
    }, [gapi, signedIn]);

    useEffect(() => {
        console.log(netWorth, bills);
    }, [netWorth, bills]);

    return !props.signedIn
        ? null
        : (
            <div className="BurnRateInterface">

            </div>
        )
}

export default BurnRateInterface;