
var http  = require('http');
var fs = require("fs");
var connect = require("connect")
var app = connect();

function profile(request, response, next)
{
    console.log("User prof");
    //next();
}
function forum(request, response, next)
{
    console.log("User forum");
    //next();
}
app.use('/profile', profile);
app.use('/forum', forum);

http.createServer(app).listen(8888);
console.log("Running");