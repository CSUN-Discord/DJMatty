// Import classes and files

const { token } = require("./config.json");
const { Client, Collection } = require("discord.js");
const fs = require('fs');

// Create a new discord client
const client = new Client({ intents: 32767, partials: ['MESSAGE', 'REACTION', 'USER'] });
exports.client = client;

const { Player } = require("./modified-packages/discord-music-player");

const player = new Player(client, {
  leaveOnEnd: false,
  leaveOnStop: false,
  leaveOnEmpty: true,
  deafenOnJoin: true
});

// You can define the Player as *client.player* to easily access it.
client.player = player;

//create a collection to store all the commands
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//command handler
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

//get the events handler
require("./handlers/events")(client);

//start the bot with the token from the config file
client.login(token);
