module.exports.run = async (client, message, args) =>{
    let embed = require("../utils/embed")(client);
    if(args.length > 1){
        embed.addField("Too many arguments!", "If you are trying to change the captains mode for this server, you must use the command with one argument, that being the mode you want to change it to. (`l`eaderboards or `r`andom)");
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
        let mode = args[0];
        
        try {
            await client.SetCaptainsMode(mode, message.guild.id);
        }catch (e){
            embed.addField("Something went wrong!", e);
            await message.channel.send(embed);
            return;
        }
        embed.addField("Captains mode changed!", `Captains mode for this server is now \`${mode}\`.`);
        await message.channel.send(embed);
        return;
    }
    let mode = await client.GetCaptainsMode(message.guild.id);
    embed.addField("Captains Mode", `Captains Mode for this server is \`${mode}\`.`);
    await message.channel.send(embed);
    return;
}

module.exports.config = {
    name:'captains',
    description:"View or change the captains mode for this server. `l`eaderboards or `r`andom."
}