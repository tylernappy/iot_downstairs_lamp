require('dotenv').load()
var path = require('path')
var express = require('express')
var app = express()

app.set('view engine', 'ejs')

var port = process.env.PORT || 5000

var isOn = false

var Particle = require('particle-api-js')
var particle = new Particle()

particle.login({username: process.env.PARTICLE_EMAIL, password: process.env.PARTICLE_PASSWORD})

app.get('/', function(req, res) {
  res.render('index', {
    isOn: isOn
  })
})

app.get('/toggle', function(req, res) {
  var state = req.query.state
  var fnPr = particle.callFunction({ deviceId: process.env.DEVICE_ID, name: 'togglelamp', argument: state, auth: process.env.ACCESS_TOKEN })
  fnPr.then(
  function(data) {
    console.log('Function called succesfully:', data)
    if (state == 'on') {isOn = true;}
    else if (state == 'off'){isOn = false;}
    res.status(200).json({isOn: isOn})
  }, function(err) {
    console.log('An error occurred:', err)
  })
})

// On startup, check state of lamp from variable on microcontroller
function initialize() {
  //check Particle for isOn
  particle.getVariable({ deviceId: process.env.DEVICE_ID, name: 'isOn', auth: process.env.ACCESS_TOKEN }).then(function(data) {
    console.log('Device variable retrieved successfully:', data)
    isOn = data.body.result
  }, function(err) {
    console.log('An error occurred while getting attrs:', err)
  })
}

initialize()

app.listen(port, function() {
  console.log('Listening on port: ' + port)
})
