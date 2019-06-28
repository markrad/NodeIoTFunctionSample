// Sample Azure function in node that splits and sends data to an Event Hub
// See end for sample of the data

// Included only for debugging
//const inspect = require("util").inspect;

// Use:
// npm install -s @azure/event-hubs
// -s will update package.json with the dependency which is required for deployment to Azure
const { EventHubClient } = require("@azure/event-hubs");

// These two variables are specified in local.settings.json but imported into 
// the environment by the Azure function system code
var ehOutSpace = process.env.TargetEventHubSpace;
var ehOutName = process.env.TargetEventHubName;

// Create the Event Hub client
var client = EventHubClient.createFromConnectionString(ehOutSpace, ehOutName);

// Split the incoming data into seperate elements and send to Event Hub
var sendToEventHub = (context, data) =>
{
    // Interate through array of telemetry readings
    data.forEach((element) => 
    {
        context.log(JSON.stringify(element));       // Optional
        client.send(element);                       // Send data to Event Hub
    });
}

// This function is called by the Azure Function system code
module.exports = async function (context, eventHubMessages) 
{
    if (!client)
    {
        // Event Hub client creation failed
        context.log.error('Failed to create outgoing Event Hub connection');
    }
    
    // Iterate through the array of messages sent 
    eventHubMessages.forEach((message, index) => 
    {
        // Check that the message matches the expected format. This will prevent exceptions being thrown later
        if (message.length != undefined && typeof message[0].timestamp != 'undefined' && typeof message[0].Epoch != 'undefined')
        {
            // Send the batch for splitting and sending to the Event Hub
            try
            {
                sendToEventHub(context, message);
            }
            catch (exp)
            {
                context.log.warn(`Exception: ${exp.message}`);
            }
        }
        else
        {
            // If the script is expected to recognize all data then this might be useful
            //context.log.warn('Unrecognized data format');
        }
    });
};

/* ------------------------------------------------------------------------------------------------ *\

    Format of sample data sent to this function:

[
	{
		"timestamp": "2019-06-28T20:53:28.913Z",
		"Epoch": 1561755209,
		"Temp": 41.45392354387723,
		"Humidity": 4.607433300001534
	},
	{
		"timestamp": "2019-06-28T20:53:29.914Z",
		"Epoch": 1561755210,
		"Temp": 41.2471903333031,
		"Humidity": 4.743176555167779
	},
	{
		"timestamp": "2019-06-28T20:53:30.914Z",
		"Epoch": 1561755211,
		"Temp": 42.252882720588346,
		"Humidity": 4.728080812215639
	},
	{
		"timestamp": "2019-06-28T20:53:31.915Z",
		"Epoch": 1561755212,
		"Temp": 41.338731143215746,
		"Humidity": 4.754183669662441
	},
	{
		"timestamp": "2019-06-28T20:53:32.915Z",
		"Epoch": 1561755213,
		"Temp": 40.21403013090367,
		"Humidity": 4.803427331175999
	},
	{
		"timestamp": "2019-06-28T20:53:33.915Z",
		"Epoch": 1561755214,
		"Temp": 41.12348497524612,
		"Humidity": 4.671671986152014
	},
	{
		"timestamp": "2019-06-28T20:53:34.916Z",
		"Epoch": 1561755215,
		"Temp": 42.12735612581893,
		"Humidity": 4.567580469159343
	},
	{
		"timestamp": "2019-06-28T20:53:35.917Z",
		"Epoch": 1561755216,
		"Temp": 42.41480247030177,
		"Humidity": 4.577083539478977
	},
	{
		"timestamp": "2019-06-28T20:53:36.918Z",
		"Epoch": 1561755217,
		"Temp": 43.38781444682467,
		"Humidity": 4.579049388207306
	},
	{
		"timestamp": "2019-06-28T20:53:37.919Z",
		"Epoch": 1561755218,
		"Temp": 44.47125931131911,
		"Humidity": 4.569843130216907
	},
	{
		"timestamp": "2019-06-28T20:53:38.919Z",
		"Epoch": 1561755219,
		"Temp": 44.84124301717621,
		"Humidity": 4.5882333831456705
	},
	{
		"timestamp": "2019-06-28T20:53:39.919Z",
		"Epoch": 1561755220,
		"Temp": 43.670691198036664,
		"Humidity": 4.619464661706984
	},
	{
		"timestamp": "2019-06-28T20:53:40.919Z",
		"Epoch": 1561755221,
		"Temp": 43.01790981416385,
		"Humidity": 4.616227261256193
	},
	{
		"timestamp": "2019-06-28T20:53:41.920Z",
		"Epoch": 1561755222,
		"Temp": 41.755928971664346,
		"Humidity": 4.549717686715565
	},
	{
		"timestamp": "2019-06-28T20:53:42.920Z",
		"Epoch": 1561755223,
		"Temp": 41.13622525169533,
		"Humidity": 4.422280527463703
	},
	{
		"timestamp": "2019-06-28T20:53:43.920Z",
		"Epoch": 1561755224,
		"Temp": 41.19109304227,
		"Humidity": 4.453069274566469
	},
	{
		"timestamp": "2019-06-28T20:53:44.921Z",
		"Epoch": 1561755225,
		"Temp": 41.3873095965006,
		"Humidity": 4.358542229805921
	},
	{
		"timestamp": "2019-06-28T20:53:45.922Z",
		"Epoch": 1561755226,
		"Temp": 40.2273831611556,
		"Humidity": 4.281203947011116
	},
	{
		"timestamp": "2019-06-28T20:53:46.922Z",
		"Epoch": 1561755227,
		"Temp": 41.42222051987188,
		"Humidity": 4.402274365815326
	},
	{
		"timestamp": "2019-06-28T20:53:47.923Z",
		"Epoch": 1561755228,
		"Temp": 41.96713381288616,
		"Humidity": 4.289506404428543
	}
]


\* ------------------------------------------------------------------------------------------------ */
