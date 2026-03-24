module.exports.run = async (client, message, args) => {
    if(args.length !== 1) return message.reply("Make sure you supply one Match ID.");
    let embed = require("../utils/embed")(client);
    let details;
    try{
        details = await client.GetMatchDetails(args[0]);
    }catch (e){
        embed.addField("Something went wrong!", e);
        await message.channel.send(embed);
        return;
    }
    
    let guildName = "NULL";
    try{
        let guildName = client.guilds.cache.get(details[4]).name;
    }catch(e){

    }
    
    embed.addField("Match ID", args[0])
    .addField("Match Server", guildName)
    .addField("Team 1", await client.PlayerArrayToString(details[0][0]))
    .addField("Team 2", await client.PlayerArrayToString(details[0][1]))
    .addField("Reported", details[1], true)
    .addField("Winner", details[2],true)
    .addField("Match Time", details[3]);
    await message.channel.send(embed);
}

module.exports.config = {
    name:"match",
    aliases:['m'],
    tris_only:true
}