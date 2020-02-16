import React, { useEffect, useState } from 'react';
import './BurnRate.scss';
import BurnRateAuth from './components/burn-rate-auth/BurnRateAuth';
import BurnRateInterface from './components/burn-rate-interface/BurnRateInterface';

const BurnRate = (props) => {
    const [gapi, setGapi] = useState(null);
    const [signedIn, updateSignedIn] = useState(false);
    const [signOut, callSignOut] = useState(false);

	return (
		<div className="BurnRate">
            <BurnRateAuth
                gapi={ gapi }
                setGapi={ setGapi }
                signedIn={ signedIn }
                updateSignedIn={ updateSignedIn }
                signOut={ signOut } />
            <BurnRateInterface
                gapi={ gapi }
                signedIn={ signedIn }
                callSignOut={ callSignOut } />
		</div>
	);
}

export default BurnRate;
