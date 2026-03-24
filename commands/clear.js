module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    await client.ClearQueue(message.guild.id);
    embed.addField("Queue has been cleared.", "The queue is now empty.");
    await message.channel.send(embed);
}

module.exports.config = {
    name:"clear",
    aliases:[],
    description:"Clear the queue.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}