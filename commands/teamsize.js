module.exports.run = async (client, message, args) =>{
    let embed = require("../utils/embed")(client);
    if(args.length > 1){
        embed.addField("Too many arguments!", "If you are trying to change the team size for this server, you must use the command with one argument, that being the team size you want to change it to.");
        await message.channel.send(embed);
        return;
    }
    if(args.length == 1){
        let allowed = false;
        let perms = ["ADMINISTRATOR", "MANAGE_GUILD"];
        perms.forEach(p =>{
            if(message.member.permissions.has(p)) allowed=true;
        });
        if (!allowed) return message.channel.send(`**Error:** \`No permissions: ${perms.toString()}\``);
        let team_size = parseInt(args[0]);
        try {
            await client.SetTeamSize(team_size, message.guild.id);
        }catch (e){
            embed.addField("Something went wrong!", e);
            await message.channel.send(embed);
            return;
        }
        embed.addField("Team size changed!", `Team size for this server is now \`${team_size}\`, and the queue has been cleared.`);
        await client.ClearQueue(message.guild.id);
        await message.channel.send(embed);
        return;
    }
    let team_size = await client.GetTeamSize(message.guild.id);
    embed.addField("Team size", `Team size for this server is \`${team_size}\`.`);
    await message.channel.send(embed);

}

module.exports.config = {
    name:'teamsize',
    aliases:['ts'],
    description:"View or change the team size for this server."
}