module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    if(args.length!==1){
        embed.addField("Something went wrong!", "Make sure you typed in the Match ID.");
        await message.channel.send(embed);
        return;
    }
    client.db.query("update matches set reported=1 where match_id=?",[args[0]]);
    embed.addField("Match cancelled.", `Match ${args[0]} was cancelled, and any attempts to report this match won't work.`);
    await message.channel.send(embed);
}

module.exports.config = {
    name:"cancel",
    description:"Cancel a game that hasn't been played, so it cannot be falsely reported later.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}