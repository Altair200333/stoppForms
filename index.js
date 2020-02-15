const {google} = require('googleapis');
var sheets = google.sheets('v4');
const fs = require('fs');
const TOKEN_PATH = 'token.json';
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), function(authClient) {
    var request = {
      // The ID of the spreadsheet to update.
      spreadsheetId: '1Nz4QhYfAwmatOUtZL6WuK3hfDyY3_QkNusKSqHfm1bw',  // TODO: Update placeholder value.
  
      // The A1 notation of a range to search for a logical table of data.
      // Values will be appended after the last row of the table.
      range: 'A1',  // TODO: Update placeholder value.
  
      // How the input data should be interpreted.
      valueInputOption: 'RAW',  // TODO: Update placeholder value.
  
      // How the input data should be inserted.
      insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.
  
      resource: {
        values: [
          ["sdsdd", "Some value", "Another value"]
        ],
      },
      auth: authClient,
    };
  
    sheets.spreadsheets.values.append(request, function(err, response) {
      if (err) {
        console.error(err);
        return;
      }
  
    });
  });
});

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function authorize(credentials, callback) {

  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

