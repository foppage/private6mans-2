module.exports.run = async (client, message, args) => {

    if(args.length != 2){
        message.channel.send("Something went wrong. To use this command, type !setwins @player <number of wins>."); //validation
        return;
    }

    if(message.mentions.users.size > 1){
        message.channel.send("You can set the number of wins for one player at a time."); //validation
        return;
    }

    if(message.mentions.users.size != 1){
        message.channel.send("Remember to tag just the player you want to set the number of wins of."); //validation
        return;
    }

    let p = message.mentions.users.first().id;

    if(!args[0].includes(p)){
        message.channel.send("Remember to tag the player first, then the number of wins after."); //validation
        return;
    }
    if(isNaN(args[1])){
        message.channel.send("Something went wrong. Did you type the number of wins correctly?"); //validation
        return;
    }
    let wins = args[1];

    
    await client.CreatePlayer(p, message.guild.id);
    await client.SetWins(p, message.guild.id, wins);
    let embed = require("../utils/embed")(client);
    embed.addField("Wins changed.", `The wins for the player <@${p}> have been set to ${wins}.`);
    await message.channel.send(embed);


}

module.exports.config = {
    name:"setwins",
    description:"Set the total wins for a player.",
    permissions:["ADMINISTRATOR", "MANAGE_GUILD"]
}