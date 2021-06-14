require('dotenv').config();
const path = require('path');
const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');
const Discord = require('discord.js');
const cheerio = require('cheerio');
const indefinite = require('indefinite');

const client = new Discord.Client();

const getInsult = async (user) => {
    const html = await axios.get('http://robietherobot.com/insult-generator.htm');

    const $ = cheerio.load(html.data);
    const insult = $('h1', 'form').text().trim().toLowerCase().replace(/\s\s+/g, ' ');
    return `<@${ user }> You are ${ indefinite(insult) }.`;
};

const getInsults = async (users) => {
    let userMessages = [];
    for (userId of users) {
        userMessages.push(await getInsult(userId));
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return userMessages;
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
    schedule.scheduleJob('0 0 8 * * *', async () => {
        const channel = client.channels.get(process.env.CHANNEL);

        try {
            (await getInsults(process.env.USER_IDS.split(','))).forEach(message => {
                channel.send(message);
            });
        } catch (e) {
            console.error(e);
        }
    });
});

client.on('message', async msg => {
    if (msg.isMentioned(client.user) && msg.content.split(/ +/).indexOf('plz') !== -1) {
        let channelMessage = '';
        try {
            channelMessage = await getInsult(msg.author.id);
        } catch {
            channelMessage = 'I\'m all out of insults.';
        }

        msg.channel.send(channelMessage);
    }
});

client.login(process.env.TOKEN);

// server
const PORT = process.env.PORT || 5000;
express()
    .use(express.static(path.join(__dirname, 'public')))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
