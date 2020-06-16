// -- Requiring modules
const { Client, Collection } = require('discord.js');
const { config } = require('dotenv');
const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES'] } });
const mongoose = require('mongoose');

bot.shop = new Map();
const items = require('./jsonFiles/items.json');

// -- Setting .env path
config({
	path: __dirname + '/.env',
});

['aliases', 'commands', 'items'].forEach((x) => (bot[x] = new Collection()));
['command', 'event', 'items'].forEach((x) => require(`./handlers/${x}`)(bot));

console.log(bot.items);

mongoose.connect(process.env.MONGOPASSWORD, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

items.forEach(a => {
	bot.shop.set(a.id, a);
	console.log(`Loaded item ${a.id}`);
});


// ---Logging in with token or test token---
const token = process.env.TEST === 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
bot.login(token);
