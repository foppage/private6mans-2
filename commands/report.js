module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    if(args.length !== 2){
        message.reply("Make sure you have 2 arguments with this command.");
        return;
    }
    try {
        let scoresReported = await client.ReportScore(message.author.id, args[0], args[1], message.guild.id);
        embed.addField("Scores reported.", scoresReported);
    } catch (e) {
        embed.addField("Something went wrong!", e);
    }
    await message.channel.send(embed);

}

module.exports.config = {
    name:"report",
    description:`Report the score of a match.`
}