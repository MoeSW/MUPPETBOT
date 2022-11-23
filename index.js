require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');

const { ActivityType } = require('discord.js');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

// Genie:          1042558036255973447
// Play button:    1044732835656896574
// Laughing Skull: 1044733332400898048
// Notes:          1044732781562974250
// Loading:        1044732872491274250
// Knoot:          852725377184825354
// MURR:           869772707833716796
player.on('trackStart', (queue, track) => {
  queue.metadata.send(`${client.emojis.cache.get('1044732835656896574')} | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`${client.emojis.cache.get('1044732781562974250')}  | Track **${track.title}** queued!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send(`${client.emojis.cache.get('1044733332400898048')} | I was manually disconnected from the voice channel, clearing queue!`);
});

player.on('channelEmpty', queue => {
  queue.metadata.send(`${client.emojis.cache.get('1044733332400898048')} | Nobody is in the voice channel. Stinky nuts...`);
});

player.on('queueEnd', queue => {
  queue.metadata.send(`${client.emojis.cache.get('852725377184825354')}  | Queue finished Pinche Poopo Guapo!`);
});

client.once('ready', async () => {
  console.log('Ready Motha Fucka!');
});

client.on('ready', function() {
  client.user.setPresence({
    activities: [{ name: config.activity, type: config.activityType }],
    status: 'Playing music as FREDBOAT',
  });
});

client.once('reconnecting', () => {
  console.log('Reconnecting. Drinking my chilled mug!');
});

client.once('disconnect', () => {
  console.log('Disconnected! I lost my poptart camera');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('STINKY NUTS');
      })
      .catch(err => {
        message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'There was an error trying to execute that command!',
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
