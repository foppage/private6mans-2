module.exports.run = async (client, message, args) => {
    let query = await client.db.query("select count(distinct players.user_id) as players, count(distinct matches.match_id) as matches, count(distinct players.guild_id) as totalservers from players, matches;");
    let {players, matches, totalservers} = query[0][0];

    //discord stats
    let users = client.users.cache.size;
    let currentguilds = client.guilds.cache.size;

    let embed = require("../utils/embed")(client);
    embed.setTitle("Bot Stats");
    embed.addField("Total unique players", players, true);
    embed.addField("Total matches played", matches, true);
    embed.addField("Total servers used in", totalservers, true);
    embed.addField("Total discord users cached", users, true);
    embed.addField("Current server count", currentguilds, true);
    await message.channel.send(embed);

}

module.exports.config = {
    name:"botstats",
    aliases:['bs'],
    tris_only:true
}