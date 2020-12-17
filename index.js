require('dotenv').config();
const axios = require('axios');
const schedule = require('node-schedule');
const Discord = require('discord.js');
const cheerio = require('cheerio');
const indefinite = require('indefinite');

const client = new Discord.Client();

const getMessage = async () => {
    try {
        const html = await axios.get('http://robietherobot.com/insult-generator.htm');

        const $ = cheerio.load(html.data);
        const insult = $('h1', 'form').text().trim().toLowerCase().replace(/\s\s+/g, ' ');
        return `You are ${ indefinite(insult) }.`;
    } catch {
        return 'I\'m all out of insults. bitch.';
    }
};

client.on('ready', () => {
    console.info(`Logged in as ${ client.user.tag }!`);

    // *    *    *    *    *    *
    // ┬    ┬    ┬    ┬    ┬    ┬
    // │    │    │    │    │    │
    // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    // │    │    │    │    └───── month (1 - 12)
    // │    │    │    └────────── day of month (1 - 31)
    // │    │    └─────────────── hour (0 - 23)
    // │    └──────────────────── minute (0 - 59)
    // └───────────────────────── second (0 - 59, OPTIONAL)
    schedule.scheduleJob('0 31 17 * * *', async () => {
        client.channels.get(process.env.CHANNEL).send(await getMessage());
    });
});

client.on('message', async msg => {
    if (msg.isMentioned(client.user)) {
        if (msg.content.split(/ +/).indexOf('plz') !== -1) {
            msg.channel.send(`<@${ msg.author.id }> ${ await getMessage() }`);
        }
    }
});

client.login(process.env.TOKEN);
