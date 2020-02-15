var http = require('http');
var fs = require("fs");
var connect = require("connect");

const { google } = require('googleapis');
var sheets = google.sheets('v4');
const TOKEN_PATH = 'token.json';
const readline = require('readline');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// 404
function params(query) {
  //console.log(query.split("?")[1] + "");
  var vars = query.split("?")[1].split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
function handleSheets(params) {

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function (authClient) {
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
            [params.num, params.date, params.mem, params.exit, params.back, params.dk, params.do, params.edu, params.equ]
          ],
        },
        auth: authClient,
      };

      sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
          console.error(err);
          return;
        }

      });
    });
  });
}
function handleFormAnswers(params) {
  var date = params.date;
  var dk = params.dk;
  var num = params.num;
  var doval = params.do;
  var exit = params.exit;
  var back = params.back;
  var edu = params.edu;

  console.log(params.date + " " + doval + " " + edu);
  
  var fs = require("fs");
  //var data = paramsVariable(num, dk, doval, date, exit, back, edu, params);
  /*fs.appendFile("./object.json", JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("File has been created");
  });*/
  
  handleSheets(params);
}
function paramsVariable(num, dk, doval, date, exit, back, edu, params) {
  return {
    number: num,
    checkedDK: dk,
    checkedDO: doval,
    date: date,
    exit: exit,
    back: back,
    edu: edu,
    member: params.mem
  };
}

function handleSheetsForDo(params) {

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function (authClient) {
      var request = {
        // The ID of the spreadsheet to update.
        spreadsheetId: '1UhsU1t9Z_G7CCVwRV2KA8un8s3fGObqUQeUgXU-Jj4c',  // TODO: Update placeholder value.

        // The A1 notation of a range to search for a logical table of data.
        // Values will be appended after the last row of the table.
        range: 'A1',  // TODO: Update placeholder value.

        // How the input data should be interpreted.
        valueInputOption: 'RAW',  // TODO: Update placeholder value.

        // How the input data should be inserted.
        insertDataOption: 'INSERT_ROWS',  // TODO: Update placeholder value.

        resource: {
          values: [
            [params.num, params.date, params.name, params.dk, params.s, params.e, params.start,
            params.end, params.money, params.guest, params.stay]
          ],
        },
        auth: authClient,
      };

      sheets.spreadsheets.values.append(request, function (err, response) {
        if (err) {
          console.error(err);
          return;
        }

      });
    });
  });
}
function isPositiveInteger(s) {
  return /^\+?[1-9][\d]*$/.test(s);
}
function getLastDo(resp) {
  var result =0;
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function (authClient) {
      var request = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1UhsU1t9Z_G7CCVwRV2KA8un8s3fGObqUQeUgXU-Jj4c',  // TODO: Update placeholder value.
    
        // The A1 notation of the values to retrieve.
        range: "A1:A100000",  // TODO: Update placeholder value.
        majorDimension: "ROWS",
        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'FORMATTED_VALUE',  // TODO: Update placeholder value.
    
        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'SERIAL_NUMBER',  // TODO: Update placeholder value.
    
        auth: authClient,
      };

      sheets.spreadsheets.values.get(request, function(err, response) {
        if (err) {
          console.error(err);
          return;
        }
    
        // TODO: Change code below to process the `response` object:
        console.log(response.data.values);
        result = response.data.values[response.data.values.length-1][0];
        console.log(result);

        resp.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        resp.write(isPositiveInteger(result)?result:"0"+"");
        resp.end();
      });
    });
  });
}
function getLastPatrol(resp) {
  var result =0;
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), function (authClient) {
      var request = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1Nz4QhYfAwmatOUtZL6WuK3hfDyY3_QkNusKSqHfm1bw',  // TODO: Update placeholder value.
    
        // The A1 notation of the values to retrieve.
        range: "A1:A100000",  // TODO: Update placeholder value.
        majorDimension: "ROWS",
        // How values should be represented in the output.
        // The default render option is ValueRenderOption.FORMATTED_VALUE.
        valueRenderOption: 'FORMATTED_VALUE',  // TODO: Update placeholder value.
    
        // How dates, times, and durations should be represented in the output.
        // This is ignored if value_render_option is
        // FORMATTED_VALUE.
        // The default dateTime render option is [DateTimeRenderOption.SERIAL_NUMBER].
        dateTimeRenderOption: 'SERIAL_NUMBER',  // TODO: Update placeholder value.
    
        auth: authClient,
      };

      sheets.spreadsheets.values.get(request, function(err, response) {
        if (err) {
          console.error(err);
          return;
        }
    
        // TODO: Change code below to process the `response` object:
        console.log(response.data.values);
        result = response.data.values[response.data.values.length-1][0];
        console.log(result);

        resp.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        resp.write(isPositiveInteger(result)?result:"0"+"");
        resp.end();
      });
    });
  });
}
function handleDoAnswers(params) {
  var date = params.date;
  var dkname = params.dk;
  var num = params.num;
  var dk1 = params.start;
  var dk2 = params.end;
  var stime = params.s;
  var etime = params.e;
  var money = params.money;
  var name = params.name;
  var guests = params.guest;
  var stay = params.stay;

  var fs = require("fs");
  var data = {
    number: num,
    dkName: dkname,
    startDk: dk1,
    endDk: dk2,
    date: date,
    startTime: stime,
    endTime: etime,
    money: money,
    name: name,
    /*c: {
        x: 11,
        y: 22
    }*/
  };
  
  fs.appendFile("./dodata.json", JSON.stringify(data, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("File has been created");
  });

  handleSheetsForDo(params);
}
function send404Response(response) {

  response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream("./page404.html").pipe(response);
}
function sendGreatResponse(response) {

  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  fs.createReadStream("./thanks.html").pipe(response);
}
function validTime(time)
{
  if(time.includes(':'))
  {
    var s = time.split(':');
    if(s.length==2 && s[0].length==2 && s[1].length==2 && parseInt(s[0],10)<24  && parseInt(s[1],10)<60 && parseInt(s[0],10)>0 && parseInt(s[1],10)>0)
    {
      console.log("ok");
      return 1;
    }
    else{
      return 0;
    }
  }
  else
  {
    return 0;
  }
}
function onRequest(request, response) {


  if (request.method == 'GET' && request.url.includes('/send')) {
    request.params = params(request.url + "");

    var date2 = Date.parse(request.params.date);
    if(isNaN(date2))
    {
      send404Response(response);
    }
    else if(!validTime(request.params.exit))
    {
      send404Response(response);
    }
    else if(!validTime(request.params.back))
    {
      send404Response(response);
    }
    else if(!(parseInt(request.params.num)>0))
    {
      send404Response(response);
    }
    else
    {
    handleFormAnswers(request.params);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./thanks.html").pipe(response);
    //sendGreatResponse(response);
    //send404Response(response);
    }
  }
  else if (request.method == 'GET' && request.url.includes('/subdo')) {
    request.params = params(request.url + "");
    handleDoAnswers(request.params);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./thanks.html").pipe(response);
    //sendGreatResponse(response);
    //send404Response(response);
  }
  else if (request.method == 'GET' && request.url.includes('/form')) {

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./index.html").pipe(response);

  }
  else if (request.method == 'GET' && request.url.includes('/do')) {

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./doform.html").pipe(response);

  }

  else if (request.method == 'GET' && request.url.includes('/main')) {

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./selector.html").pipe(response);

  }
  else if (request.method == 'GET' && request.url.includes('/thanks')) {

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream("./thanks.html").pipe(response);

  }
  else if (request.method == 'GET' && request.url.includes('/dnum')) {
   
    getLastDo(response);

  }
  else if (request.method == 'GET' && request.url.includes('/pnum')) {
   
    getLastPatrol(response);

  }
  else {
    send404Response(response);
  }
}
http.createServer(onRequest).listen(8888);

console.log('Running...'); 