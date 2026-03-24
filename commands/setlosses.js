module.exports.run = async (client, message, args) => {

    if(args.length != 2){
        message.channel.send("Something went wrong. To use this command, type `!setlosses @player <number of losses>`."); //validation
        return;
    }

    if(message.mentions.users.size > 1){
        message.channel.send("You can only set the number of losses for one player at a time."); //validation
        return;
    }

    if(message.mentions.users.size != 1){
        message.channel.send("Remember to tag just the player you want to set the number of losses of."); //validation
        return;
    }

    let p = message.mentions.users.first().id;

    if(!args[0].includes(p)){
        message.channel.send("Remember to tag the player first, then the number of losses after."); //validation
        return;
    }
    if(isNaN(args[1])){
        message.channel.send("Something went wrong. Did you type the number of losses correctly?"); //validation
        return;
    }
    let losses = args[1];

    
    await client.CreatePlayer(p, message.guild.id);
    await client.SetLosses(p, message.guild.id, losses);
    let embed = require("../utils/embed")(client);
    embed.addField("Losses changed.", `The losses for the player <@${p}> have been set to ${losses}.`);
    await message.channel.send(embed);


}

module.exports.config = {
    name:"setlosses",
    description:"Set the total losses for a player.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}