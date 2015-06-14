console.log('Initialising...');
var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console

var _config = require('./config.json');
var client = require('./client.js');
var sercli = new client(_config);
var sensors = require('./sensors.js');
var senses = new sensors(_config);
var outputs = require('./outputs.js');
var output = new outputs(_config);

var barLevel = 1;
var barUp = true;

sercli.printHi();
senses.printHi();
output.printHi();
    

function submitReadingData()
{   
    var readings = senses.takeAllReadings();
    console.log('submitting readings: ' + JSON.stringify(readings));
    
    sercli.submitUv(readings.light);
    console.log('submitted light');
    sercli.submitMoisture(readings.moisture);
    console.log('submitted moisture');
    sercli.submitTemp(readings.temp);
    console.log('submitted temp');
}

function checkPump()
{
    console.log('checkPump...');
    sercli.getPumpOn(function(turnPumpOn) {
        console.log('pumpResult:' + turnPumpOn);
        if(turnPumpOn)
        {
            console.log('turning pump on');
            output.turnRelayOn();
        }
        else
        {
            console.log('turning pump off');
            output.turnRelayOff();
        }
    });
}

function switchRelay(on)
{
    if(on)
    {
        output.turnRelayOn();
    }
    else
    {
        output.turnRelayOff();
    }
    setTimeout(switchRelay, 1000, !on);
}


// Print message when exiting
process.on('SIGINT', function()
{
	console.log("Exiting...");
	process.exit(0);
});

    
//this.http=require('http');
//setInterval(submitReadingData, 1000);


output.turnRelayOff();
setInterval(checkPump, 10000, true);

//setTimeout(switchRelay, 1000, true);
//setTimeout(checkPump, 1000, true);

//setInterval(moveLED, 1000);


/*
var grove_moisture = require('jsupm_grovemoisture');
var myMoistureObj = new grove_moisture.GroveMoisture(0);
    
var groveSensor = require('jsupm_grove');
var light = new groveSensor.GroveLight(1);
var temp = new groveSensor.GroveTemp(2);


function takeAnalogLightReading()
{
    return light.value();
}

function takeTempReading()
{
    return temp.value();
}

function takeMoistureReading()
{
	return parseInt(myMoistureObj.value());
}

*/