// based on https://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
// requires service account configured with key
// also have to share spreadsheet with your service account email

require('dotenv').config({
  path: __dirname + '/.env'
});

const { google } = require('googleapis');
const privateKey = require(`./${process.env.PRIVATE_KEY_JSON_PATH}`);
const sheets = google.sheets('v4');
const tabs = process.env.TAB_NAMES.split(',');

const jwtClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const authenticate = async () => {
  return new Promise(resolve => {
    jwtClient.authorize(function (err, tokens) {
      resolve(!err);
    });
  });
};

// only for last row call
const getColHeaders = async (tabName) => {
  return new Promise(resolve => {
    sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range: `${tabName}!A1:AB5`
    }, (err, res) => {
      if (err) {
        resolve(false);
      } else {
        if (res.data) {
          resolve(res.data);
        } else {
          resolve(false);
        }
      }
    });
  });
}

// this returns for example A13
const getLastRow = async (tabName) => {
  return new Promise(resolve => {
    sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range: `${tabName}!A12:A1000` // future problem, past 1000 lol that's far like 27 years if ran thrice a month
    }, (err, res) => {
      if (err) {
        resolve(false);
      } else {
        if (res.data) {
          const lastRow = 11 + res.data.values.length; // not sure what the 11 is from but it does work
          resolve(`A${lastRow}`);
        } else {
          resolve(false);
        }
      }
    });
  });
}

const _getLatestRow = async (tabName) => {
  const authenticated = await authenticate();

  return new Promise(async (resolve) => {
    if (authenticated) {
      const colHeaders = await getColHeaders(tabName);
      const lastRow =  await getLastRow(tabName);
      const lastRowLetter = lastRow[0];
      const rowNum = lastRow.split(lastRowLetter)[1];
      const range = `${tabName}!${lastRow}:X${rowNum}`;

      sheets.spreadsheets.values.get({
        auth: jwtClient,
        spreadsheetId: process.env.SHEET_ID,
        range,
      }, (err, res) => {
        if (err) {
          // handle this err
          resolve(false);
        } else {
          resolve({
            colHeaders,
            latestRow: res.data.values[0]
          });
        }
      });
    } else {
      resolve(false);
    }
  });
}

const _getAllRows = async (tabName, customRange = 'A1:A1') => {
  const authenticated = await authenticate();
  
  return new Promise(async (resolve) => {
    if (authenticated) {
      sheets.spreadsheets.values.get({
          auth: jwtClient,
          spreadsheetId: process.env.SHEET_ID,
          range: `${tabName}!${customRange}`
      }, (err, res) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          if (res.data) {
            resolve(res.data.values);
          } else {
            resolve(false);
          }
        }
      });
    }
  });
}

const getLatestNetWorthRow = async (req, res) => {
  const latestNetWorthRow = await _getLatestRow(tabs[0]);
  
  if (!latestNetWorthRow) {
    res.status(400).json({err: true});
  } else {
    res.status(200).json({data: latestNetWorthRow, err: false});
  }
}

const getBillRows = async (req, res) => {
  const billRows = await _getAllRows(tabs[1], 'A1:F33');
  
  if (!billRows) {
    res.status(400).json({err: true});
  } else {
    res.status(200).json({data: billRows, err: false});
  }
}

const getCardRows = async (req, res) => {
  const cardRows = await _getAllRows(tabs[2], 'A1:E12');
  
  if (!cardRows) {
    res.status(400).json({err: true});
  } else {
    res.status(200).json({data: cardRows, err: false});
  }
}

module.exports = {
  getLatestNetWorthRow,
  getBillRows,
  getCardRows,
};
