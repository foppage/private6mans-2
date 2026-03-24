module.exports.run = async (client, message, args) => {
    message.reply("Are you sure you want to reset the leaderboards for this server? This cannot be undone. Reply `YES` in the next 10 seconds to reset the leaderboards.");
    let filter = m => m.author.id == message.author.id;
    let collected = await message.channel.awaitMessages(filter, {time:10000, max:1});
    if(collected.size!=1){
        message.channel.send("Time ran out, leaderboards have **not** been reset.");
        return;
    }
    if(collected.first().content.toLowerCase()!="yes"){
        message.channel.send("The message you typed wasn't `YES`. Therefore the leaderboards have **not** been reset.");
        return;
    }
    await client.ResetLeaderboards(message.guild.id);
    let embed = require("../utils/embed")(client);
    embed.addField("Leaderboards reset!", `The leaderboards for ${message.guild.name} have been reset.`);
    await message.channel.send(embed);
}

module.exports.config = {
    name:"reset",
    description:"Reset the leaderboards for this server.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}