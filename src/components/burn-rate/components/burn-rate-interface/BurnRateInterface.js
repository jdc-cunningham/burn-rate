import React, { useEffect, useState } from 'react';
import './BurnRateInterface.scss';

const BurnRateInterface = (props) => {

    return !props.signedIn
        ? null
        : (
            <div className="BurnRateInterface">

            </div>
        )
}

export default BurnRateInterface;