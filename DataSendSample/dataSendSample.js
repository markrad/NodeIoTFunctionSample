'use strict';

// Sends sample data compatible with the function sample
var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var ConnectionString = require('azure-iot-device').ConnectionString;

var connectionString = "<Device connection string>";
var client = clientFromConnectionString(connectionString);
var lastTemperature = 50;
var lastHumidity = 50;
var telemetryData = [];

function getFakeData(base, variance)
{
    var rnd = Math.random();
    var cp = 2 * variance * rnd;

    if (cp > variance)
    {
        cp -= (2 * variance);
    }

    var ca = base * cp;

    return base + ca;
}

function sendTelemetry()
{
    var work = telemetryData;
    var data = JSON.stringify(work);
    var message = new Message(data);

    client.sendEvent(message, (err, res) => 
    {
        console.log();
        console.log(`Send message: ${message.getData()}` +
            (err ? `; error: ${err.toString()}` : '') +
            (res ? `; status: ${res.constructor.name}` : '')
        );
    });
}

function collectTelemetry()
{
    lastTemperature = getFakeData(lastTemperature, 0.03);
    lastHumidity = getFakeData(lastHumidity, 0.03);
    var now = new Date; 
    telemetryData.push( { timestamp : now.toISOString(),  Epoch : Math.round(now.getTime() / 1000), Temp : lastTemperature, Humidity : lastHumidity} );

    if (telemetryData.length % 10 == 0)
    {
        if (telemetryData.length == 20) 
        {
            sendTelemetry();
            telemetryData = [];
        }
        else
        {
            process.stdout.write(telemetryData.length % 60 == 0? 'X' : 'x');
        }
    }
}

var connectCallback = (err) =>
{
    if (err)
    {
        console.log(`Device could not connect to AIC: ${err.toString()}`);
    }
    else
    {
        console.log('Connected');
        setInterval(collectTelemetry, 1000);
    }
};

client.open(connectCallback);