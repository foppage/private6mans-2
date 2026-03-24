module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    if(args.length !== 1){
        message.reply("Make sure you have 1 argument with this command, that being the Match ID you want to undo.");
        return;
    }
    let match_id=args[0];
    let match_details;
    try{
        match_details = await client.GetMatchDetails(match_id);
    }catch(e){
        embed.addField("Something went wrong!", e);
        message.channel.send(e);
        return;
    }
    
    if(match_details[1]!=1){
        embed.addField("Match not reported!", "This match hasn't been reported, you can't undo a match that hasn't happened yet.");
        await message.channel.send(embed);
        return;
    }
    let Teams = match_details[0];
    let winner = parseInt(match_details[2]) - 1;
    if(match_details[2]==null){
        embed.addField("Match was cancelled", "This was never played, therefore it cannot be undone.");
        await message.channel.send(embed);
        return;
    }
    let loser = 1-winner;
    for(let p of Teams[winner]){
        await client.RemoveWin(p, message.guild.id);
    }
    for(let p of Teams[loser]){
        await client.RemoveLoss(p, message.guild.id);
    }

    await client.SetMatchAsUnreported(match_id);
    embed.addField("This match has been reverted", "You can now report the score correctly.");
    await message.channel.send(embed);
  
}

module.exports.config = {
    name:"undo",
    aliases:['u'],
    description:"Revert a match that has been reported.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}

