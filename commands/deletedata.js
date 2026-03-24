module.exports.run = async (client, message, args) => {
    if(message.channel.id != "697403717535793184" && message.channel.id != "697408563324125234"){
        return;
    }
    message.reply("Are you sure you want to delete all of your data from the database? This cannot be undone. Reply `YES` (not case sensitive) in the next 10 seconds to confirm.");
    let filter = m => m.author.id == message.author.id;
    let collected = await message.channel.awaitMessages(filter, {time:10000, max:1});
    if(collected.size!=1){
        message.channel.send("Your data hasn't been deleted, since you didn't type `YES`.");
        return;
    }
    if(collected.first().content.toLowerCase()!="yes"){
        message.channel.send("Your data hasn't been deleted, since you didn't type `YES`.");
        return;
    }
    await client.db.query("delete from players where user_id=?",[message.author.id]);
    for(let p of ['t1p1', 't1p2', 't1p3', 't2p1', 't2p2', 't2p3']){
        await client.db.query(`update matches set ${p}='undefined' where ${p}=?`,[message.author.id]);
    }
    

    let embed = require("../utils/embed")(client);
    embed.addField("Data successfully deleted!", `Your data has been removed from the database.`);
    await message.channel.send(embed);
}

module.exports.config = {
    name:"deletedata",
    description:"Delete your data from the database.",
}