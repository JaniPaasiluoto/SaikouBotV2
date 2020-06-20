const ms = require('ms');
const dailyCooldown = require('../../models/dailyCooldown');
const weighted = require('weighted');

const dailyCooldownAmount = 24 * 60 * 60 * 1000;

const lootCrateWeights = {
	'common': 0.80,
	'rare': 0.5,
	'legendary': 0.1
};

module.exports = {
	config: {
		name: 'daily',
		aliases: ['supply'],
		cooldown: false,
		autoCooldown: true
	},
	async run(client, message, args, utils) {
		let cooldown = await dailyCooldown.findOne({ id: message.author.id });
		if (!cooldown) {
			cooldown = new dailyCooldown({ id: message.author.id });
			await cooldown.save();
		}
		const expire = cooldown.timestamp.getTime() + dailyCooldownAmount;
		const now = Date.now();
		if (expire > now) {
			return message.channel.send(new MessageEmbed({
				title: 'Please wait',
				description: `You can use this again in **${ms(expire - now)}**`,
				footer: { text: 'Please brandon, Im so ugly I will explode, pls fix me :(' },
				color: colours.red
			}));
		}

		const choosenCrate = weighted.select(lootCrateWeights);
		message.channel.send(choosenCrate);

		cooldown.timestamp = new Date();
		await cooldown.save();
	}
};
