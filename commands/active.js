module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    let matches = await client.GetActiveMatches(message.guild.id);
    let tempString = "";
    matches.forEach(m => {
        tempString += `${m}\n`;
    });
    if(tempString==""){
        embed.addField("No active matches!", "All matches for this server have been reported.");
        await message.channel.send(embed);
        return;
    }
    embed.addField(`Active Matches for ${message.guild.name}`, tempString);
    await message.channel.send(embed);
    return;
}

module.exports.config = {
    name:"active",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"],
    description:"View all active matches (matches that haven't been reported yet)."
}