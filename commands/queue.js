
module.exports.run = async (client, message, args) => {
    let embed = require("../utils/embed")(client);
    await client.CreatePlayer(message.author.id, message.guild.id);
    try {
        await client.AddPlayerToQueue(message.author.id, message.guild.id);
    } catch (e){
        
        embed.addField("You are already in the queue.", `Current queue members: ${await client.PlayerArrayToString(await client.GetQueue(message.guild.id))}`);
        await message.channel.send(embed);
        return;
    }
    let queue = await client.GetQueue(message.guild.id);
    let team_size = await client.GetTeamSize(message.guild.id);
    let playersPerLobby = team_size*2;
    switch(queue.length){
        case 1:
            embed.addField("New queue started!", `<@${message.author.id}> has started a new queue! Type \`${message.prefix}q\` to join.`);
            await message.channel.send(embed);
            break;
        case playersPerLobby:
            let lobbyQueue = await client.GetQueue(message.guild.id);
            await client.ClearQueue(message.guild.id);
            message.channel.send(`${playersPerLobby} people joined the queue and so the lobby is full. ${await client.PlayerArrayToString(lobbyQueue)}`);
            //old code
            message.channel.send(`Captains or Random? Type ${message.prefix}c for Captains, ${message.prefix}r for random. First to reach ${team_size} votes is chosen. If after 2 minutes neither reach ${team_size} votes, the ${playersPerLobby} mans will be cancelled. `);
			const filter = m => m.content == `${message.prefix}c` || m.content == `${message.prefix}r`;
			let collector = message.channel.createMessageCollector(filter, {time:120000});
            let playersVoted = new Array(0);
            let teamSelectionMode = "";
            let votesForR = 0;
            let votesForC = 0;
            collector.on("collect", m=>{
                if(playersVoted.includes(m.author.id)) return;
                if(!lobbyQueue.includes(m.author.id)) return;
                switch(m.content){
                    case `${message.prefix}r`:
                        votesForR += 1;
                        console.log("rand");
                        break;
                    case `${message.prefix}c`:
                        votesForC += 1;
                        console.log("capt");
                        break;
                }
                if(votesForR == team_size){
                    teamSelectionMode = "random";

                    collector.stop();
                }
                if(votesForC == team_size){
                    teamSelectionMode = "captains";
                    
                    collector.stop();
                }
                playersVoted.push(m.author.id);
                return;
                
            });
         
            collector.on("end", async function (collected){
                
                console.log()
                if(votesForC < team_size && votesForR < team_size){
                    
                    console.log("time ran out.");
                    message.channel.send(`Time ran out. ${playersPerLobby} mans was cancelled.`);

                    return;
                }
                let Team1 = new Array();
                let Team2 = new Array();
                let res;
                let match_id;
                if(teamSelectionMode == "random"){
                    message.channel.send("Random teams have been selected.");
                    res = await randomTeams(lobbyQueue, client, message);
                    Team1 = res[0];
                    Team2 = res[1];
                    match_id = res[2];
                }

                if(teamSelectionMode == "captains"){
                    message.channel.send("Captains have been selected.");
                    try{
                        res = await captainedTeams(lobbyQueue, client, message);
                    }catch(e){
                        embed.addField("Something went wrong!", e);
                        await message.channel.send(embed);
                        return;
                    }
                    
                    Team1 = res[0];
                    Team2 = res[1];
                    match_id = res[2];
                }
                embed.addField("Team 1", await client.PlayerArrayToString(Team1));
                embed.addField("Team 2", await client.PlayerArrayToString(Team2));
                embed.addField("Match ID (use this when reporting the score)", match_id.match_id);
                    
                await message.channel.send(embed);
                [Team1, Team2].forEach(t=>{
                    t.forEach(async p=>{
                        await (await client.users.fetch(p)).send(embed);
                    });
                });

            });
            break;
        default:
            let queue = await client.GetQueue(message.guild.id);
            embed.addField("Player joined the queue.", `<@${message.author.id}> joined the queue.`);
            embed.addField(`Current queue members: ${queue.length}`, await client.PlayerArrayToString(await client.GetQueue(message.guild.id)));
            await message.channel.send(embed);
            break;
    }
    
}

module.exports.config = {
    name: "queue",
    aliases: ["q"],
    description:"Join the queue."
}

async function randomTeams(queue, client, message){
    let team_size = await client.GetTeamSize(message.guild.id);
    let Team1 = new Array();
    let Team2 = new Array();
    for(let i = 0; i < team_size; i++){
        let randomNumber = Math.floor(Math.random() * queue.length);
        Team1.push(queue[randomNumber]);
        queue.splice(randomNumber,1);
    }
    Team2 = queue;
    return await client.CreateMatch(Team1, Team2, message.guild.id);
}

async function captainedTeams(queue, client, message){
    let Team1 = new Array();
    let Team2 = new Array();

    let guild_id = message.guild.id;
    let team_size = await client.GetTeamSize(message.guild.id);
    let lobby = await client.OrderedLobby(queue, guild_id);
    console.log(lobby);
    let Captain1 = "";
    let Captain2 = "";
    switch(await client.GetCaptainsMode(guild_id)){
        case "l":
            Captain1 = lobby.shift();
            Captain2 = lobby.shift();
            Team1.push(Captain1);
            Team2.push(Captain2);
            break;
        case "r":
            let randomNumber = Math.floor(Math.random() * lobby.length);
            Team1.push(lobby[randomNumber]);
            Captain1 = lobby[randomNumber];  
            lobby.splice(randomNumber,1);

            randomNumber = Math.floor(Math.random() * lobby.length);
            Team2.push(lobby[randomNumber]);
            Captain2 = lobby[randomNumber];  
            lobby.splice(randomNumber,1);
            break;
        default:
            throw "Captains mode wasn't `l` or `r`.";
    
    }

    message.channel.send(`Captains are <@${Captain1}> and <@${Captain2}>. <@${Captain1}> gets first pick, and <@${Captain2}> will get the next two. The remaining player will be placed on <@${Captain1}>'s team.`);
    
    //1st captain pick
    let tempMsg = "Pick one player to be on your team. Type the number corresponding to that player.";
    for(i=1; i<=(2 * team_size) - 2; i++){
        tempMsg += `\n${i}. <@${lobby[i-1]}>`;
    }
    await (await client.users.fetch(Captain1)).send(tempMsg);

    //await message
    let filter = m => parseInt(m.content) > 0 && parseInt(m.content) <= (2 * team_size) - 2;
    const Captain1DMChannel = await (await client.users.fetch(Captain1)).createDM();
    const collected1 = await Captain1DMChannel.awaitMessages(filter, {time:1200000, max:1});
    if(collected1.size !== 1){
        throw "Captain 1 didn't pick a player in time. The match was cancelled.";
    }

    let choice = parseInt(collected1.first().content) - 1;

    Team1.push(lobby[choice]);
    lobby.splice(choice, 1);
    Captain1DMChannel.send("Thank you for picking a player.");  

    //2nd captain 1st pick
    for(let i = 1; i < team_size; i++){
        if(team_size==2) break;  

        tempMsg = "Pick a player to be on your team. Type the number corresponding to the player you want to pick.";
        for(j=1; j<=lobby.length; j++){
            tempMsg += `\n${j}. <@${lobby[j-1]}>`;
        }
        await(await client.users.fetch(Captain2)).send(tempMsg);

        //await message
        
        filter = m => parseInt(m.content) > 0 && parseInt(m.content) <= (2 * team_size) - 2 - i;
        const Captain2DMChannel = await (await client.users.fetch(Captain2)).createDM();
        const collected2 = await Captain2DMChannel.awaitMessages(filter, {time:1200000, max:1});
        if(collected2.size !== 1){
            throw "Captain 2 didn't pick a player in time. The match was cancelled.";
        }

        choice = parseInt(collected2.first().content) - 1;

        Team2.push(lobby[choice]);
        lobby.splice(choice, 1);
    }
    //add remaining player to 1st team

    
    if(Team1.length < Team2.length){
        Team1.push(lobby[0]);
    } else{
        Team2.push(lobby[0]);
    }

    console.log(Team1);
    console.log(Team2);
    console.log(lobby);
    return await client.CreateMatch(Team1, Team2, message.guild.id);


}