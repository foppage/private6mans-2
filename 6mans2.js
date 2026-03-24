const {Client, Collection} = require("discord.js");
const client = new Client();
client.config = require("./config");
client.db = require("./utils/db");
client.commands = new Collection();
client.aliases = new Collection();
require("./utils/functions")(client);
require("./utils/express")(client);
["command", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.config.bot_token).then(r => console.log("Connected to Discord")).catch(e=>{console.error(e)});