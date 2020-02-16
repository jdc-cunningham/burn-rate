import React, { useEffect, useState } from 'react';
import './BurnRateAuth.scss';
import ajaxLoader from './../../../../assets/icons/ajax-loader.gif';

/**
 * Currently this just shows a Sign In button if you're not signed in
 * The sign out method would be tied to an external prop set event
 * @param {Object} props 
 */
const BurnRateAuth = (props) => {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
	const API_KEY = process.env.REACT_APP_API_KEY;
	const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

    const gapi = props.gapi;
    const signOut = props.signOut;

	const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    }
    
    const updateSigninStatus = (signedIn) => {
        if (signedIn) {
            props.updateSignedIn(true);
        }
    }

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
		}, function(error) {
			alert('An error occurred');
			console.log(error);
		});
    }

    const handleAuthClick = (event) => {
		gapi.auth2.getAuthInstance().signIn();
    }
    
    const handleSignoutClick = (event) => {
        console.log(gapi);
		gapi.auth2.getAuthInstance().signOut();
	}
    
    const oAuthModal = () => {
        return props.signedIn
            ? null
            : <div className="BurnRate__oAuth-modal">
                <button type="button" onClick={ handleAuthClick }>Sign in</button>
            </div>
    }

    const loadingMessage = () => {
        return gapi
            ? null 
            : <span className="BurnRate__loading-msg">Checking sign in status... <img src={ ajaxLoader } /></span>;
    }

    const checkAuth = () => {
        if (!gapi) {
            loadingMessage();
        } else {
            oAuthModal();
        }
    }

	if (!gapi) {
		const script = document.createElement('script'); //creates the html script element that points to external script via src
		script.src = "https://apis.google.com/js/api.js";
		script.async = true;
		script.defer = true;
		script.addEventListener('load', () => {
            props.setGapi(window.gapi);
		});
		document.head.append(script);
    }
    
    useEffect(() => {
        if (gapi) {
			handleClientLoad();
        }
    }, [gapi]);

    useEffect(() => {
        if (signOut) {
            console.log('handle signout');
        }
    }, [signOut]);

    return props.signedIn
        ? null
        : (
            <div className="BurnRateAuth">
                { checkAuth() }
            </div>
        )
}

export default BurnRateAuth;