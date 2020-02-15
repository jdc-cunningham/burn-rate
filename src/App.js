import React from 'react';
// import logo from './logo.svg';
import './App.css';

function App() {
	// https://developers.google.com/sheets/api/quickstart/js
	// Client ID and API key from the Developer Console
	const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
	const API_KEY = process.env.REACT_APP_API_KEY;

	// Array of API discovery doc URLs for APIs used by the quickstart
	const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

	// Authorization scopes required by the API; multiple scopes can be
	// included, separated by spaces.
	const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

	let authorizeButton;
	let signoutButton;
	let gapiLoaded = false;
	let gapi;

	/**
	 *  On load, called to load the auth2 library and API client library.
	 */
	const handleClientLoad = () => {
		gapi.load('client:auth2', initClient);
	}

	/**
	 *  Initializes the API client library and sets up sign-in state
	 *  listeners.
	 */
	const initClient = () => {
		gapi.client.init({
		apiKey: API_KEY,
		clientId: CLIENT_ID,
		discoveryDocs: DISCOVERY_DOCS,
		scope: SCOPES
		}).then(function () {
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
		}, function(error) {
		appendPre(JSON.stringify(error, null, 2));
		});
	}

	/**
	 *  Called when the signed in status changes, to update the UI
	 *  appropriately. After a sign-in, the API is called.
	 */
	const updateSigninStatus = (isSignedIn) => {
		if (isSignedIn) {
		authorizeButton.style.display = 'none';
		signoutButton.style.display = 'block';
		listMajors();
		} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
		}
	}

	/**
	 *  Sign in the user upon button click.
	 */
	const handleAuthClick = (event) => {
		gapi.auth2.getAuthInstance().signIn();
	}

	/**
	 *  Sign out the user upon button click.
	 */
	const handleSignoutClick = (event) => {
		gapi.auth2.getAuthInstance().signOut();
	}

	/**
	 * Append a pre element to the body containing the given message
	 * as its text node. Used to display the results of the API call.
	 *
	 * @param {string} message Text to be placed in pre element.
	 */
	const appendPre = (message) => {
		var pre = document.getElementById('content');
		var textContent = document.createTextNode(message + '\n');
		pre.appendChild(textContent);
	}

  /**
   * Print the names and majors of students in a sample spreadsheet:
   * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   */
  const listMajors = () => {
		gapi.client.sheets.spreadsheets.values.get({
			spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
			range: `${process.env.REACT_APP_SPREADSHEET_TAB_NAME}!A2:T3`, // tab name, rectangular corner range eg. top-left, bottom-right
			// set variable to keep track of last known row then try next row to see if it exists, until legit way to find last row is determined
		}).then((response) => {
			var range = response.result;
			// if (range.values.length > 0) {
			//   appendPre('Name, Major:');
			//   for (let i = 0; i < range.values.length; i++) {
			//     var row = range.values[i];
			//     // Print columns A and E, which correspond to indices 0 and 4.
			//     appendPre(row[0] + ', ' + row[4]);
			//   }
			// } else {
			//   appendPre('No data found.');
			// }
		}, (response) => {
			appendPre('Error: ' + response.result.error.message);
		});
  }

  	if (!gapiLoaded) {
		const script = document.createElement('script'); //creates the html script element that points to external script via src
		script.src = "https://apis.google.com/js/api.js";
		script.async = true; 
		script.defer = true;
		script.addEventListener('load', () => {
			gapi = window.gapi;
			authorizeButton = document.getElementById('authorize_button');
			signoutButton = document.getElementById('signout_button');
			handleClientLoad();
		});
		document.head.append(script);
	}

	return (
		<div className="App">
		<p>Google Sheets API Quickstart</p>
		<button id="authorize_button" style={ {display: "none"} }>Authorize</button>
		<button id="signout_button" style={ {display: "none"} }>Sign Out</button>
		<pre id="content" style={ {whiteSpace: "pre-wrap"} }></pre>
		</div>
	);
}

export default App;
