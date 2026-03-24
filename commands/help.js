module.exports.run = async (client, message, args) => {
    var embed = require("../utils/embed")(client);
    embed.setTitle("Help");
    for(let c of client.commands.values()){
        if(c.config.description){
            embed.addField(`${message.prefix}${c.config.name}`, c.config.description);
        }
    }

    embed.addField("Bot invite link", `Want to invite this bot to your server? https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=19456`);
    embed.addField("Support Server", "Join https://discord.gg/zX7ZyFA for the support server for this bot.");
    embed.addField("Want to make a request to delete your data from the server?", `Join the Support Server linked above. In there, go to the <#697403717535793184> channel and read the channel description. In there, type !deletedata. This command will only work in that channel.`);
    
    await message.channel.send(embed);
}

module.exports.config = {
    name:"help",
    description:"This command.",
    aliases:['h']
}