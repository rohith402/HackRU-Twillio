var http = require('http');
var express = require('express');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));

var quesIds = "";
var jsonQuesIds = "";
var count  = 8 ;
var quesAndAns = new Array();
var ans = new Array();
var questions = new Array();
var finalAns = {userId: {
    type: String,
    required: 'Kindly enter the user ID'
  },
  qAndA: [],
  selfRating : {
    type: String
  },
  currCareer : {
    type: String
  }}


app.post('/sms', function(req, res) {
  var twilio = require('twilio');
  var twiml = new twilio.twiml.MessagingResponse();
  //console.log(typeof(req.body.Body));
  //console.log(req);
  if(req.body.Body.toLowerCase() === "start"){
    finalAns.userId.type = req.body.From;
    finalAns.userId.required = 'Kindly enter the user ID';
    console.log("Started");
    count = 0;
    var id = JSON.parse(quesIds)[count]._id
    request('http://31e58e0a.ngrok.io/questions/'+id, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Success request")
            console.log("Body:"+ body);
            quesText = JSON.parse(body).questionText;
            if(JSON.parse(body).questionType === "M"){
                quesText += "["
                for (i = 0; i < JSON.parse(body).options.length; i++) { 
                    quesText += JSON.parse(body).options[i].optionText+",";
                }
                quesText += "]";
            }
            questions.push(quesText);
            finalAns.qAndA[count] = {
                qID: {
                  type: "",
                  required: 'Kindly enter the question ID'
                },
                answer: {
                  type: ""
            }};
            finalAns.qAndA[count].qID.type = JSON.parse(quesIds)[count]._id;
            finalAns.qAndA[count].qID.required =  'Kindly enter the question ID';
            count++;
            twiml.message(quesText);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(quesText);
            res.end();
        }
    });
  }else{
    ans.push(req.body.Body);
    finalAns.qAndA[count-1].answer.type = req.body.Body;
    console.log("Count:"+count)
    if(count < JSON.parse(quesIds).length){
        request('http://31e58e0a.ngrok.io/questions/'+JSON.parse(quesIds)[count]._id, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                finalAns.qAndA[count] = {
                    qID: {
                      type: "",
                      required: 'Kindly enter the question ID'
                    },
                    answer: {
                      type: ""
                }};
                finalAns.qAndA[count].qID.type = JSON.parse(quesIds)[count]._id;
            finalAns.qAndA[count].qID.required =  'Kindly enter the question ID';
            
            quesText = JSON.parse(body).questionText;
                if(JSON.parse(body).questionType === "M"){
                    quesText += "["
                    for (i = 0; i < JSON.parse(body).options.length; i++) { 
                        quesText += JSON.parse(body).options[i].optionText+",";
                    }
                    quesText += "]";
                }
            questions.push(quesText);
            count++;
            twiml.message(quesText);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(quesText);
            res.end();
            }
        });
    }else{
        request('http://2b98bcc1.ngrok.io/query', function (error, response, body) {
            finalAns = JSON.stringify(finalAns);
            console.log("Sending answers over");
            console.log("Checking final answers:"+finalAns)
            //twiml.message(quesText);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(finalAns);
            res.end();
        });
    }
  }
});

http.createServer(app).listen(1337, function () {
  console.log("Express server listening on port 1337");
  request('http://31e58e0a.ngrok.io/getQIds', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Request started");
            count = 0;
            quesIds = body;
            jsonQuesIds = JSON.parse(quesIds);
            console.log("quesIds Inside:"+ quesIds);
        }
    });
});