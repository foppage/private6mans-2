module.exports = async (client) => {

    client.CreatePlayer = async (user_id, guild_id) => {
        console.log("here");
        let [id] = await client.db.query("select id from players where user_id=? and guild_id=?", [user_id, guild_id]);
        if(id.length!==0){
            console.log("Player already exists in the DB.");
            return;
        }
        await client.db.query("insert into players values (default, ?, ?, default, default, default)", [user_id, guild_id]);
        console.log("Player inserted into the DB.");

    }

    client.GetQueue = async (guild_id) => {
        let [rows, fields] = await client.db.query("select * from queues where guild_id=?", [guild_id]);
        let queue = new Array();
        queue.push(rows[0].p1);
        queue.push(rows[0].p2);
        queue.push(rows[0].p3);
        queue.push(rows[0].p4);
        queue.push(rows[0].p5);
        queue.push(rows[0].p6);

        for(let i = 0; i < queue.length; i++){
            if(queue[i]==null){
                queue.splice(i, 1);
                i=-1;
            }
        }
        return queue;
    }

    client.AddPlayerToQueue = async (user_id, guild_id) => {

        if(await client.IsPlayerInQueue(user_id,guild_id)) throw `<@${user_id}> is already in the queue!`;
        let queue = await client.GetQueue(guild_id);
        queue.push(user_id);
        await client.UpdateQueue(guild_id,queue);
        return `<@${user_id}> has been added to the queue.`;
    }

    client.RemovePlayerFromQueue = async (user_id, guild_id) => {

        if(!await client.IsPlayerInQueue(user_id,guild_id)) throw `<@${user_id}> isn't in the queue`;
        let queue = await client.GetQueue(guild_id);
        queue.splice(queue.indexOf(user_id), 1);
        await client.UpdateQueue(guild_id,queue);
        return `<@${user_id}> has been removed from the queue.`;
    }

    client.IsPlayerInQueue = async (user_id, guild_id) => {
        let queue = await client.GetQueue(guild_id);
        if(queue.indexOf(user_id) > -1) {
            return true;
        }
        return false;
    }

    client.ClearQueue = async (guild_id) => {
        let emptyQueue = new Array();
        await client.UpdateQueue(guild_id, emptyQueue);
        return "Cleared queue";
    }

    client.UpdateQueue = async (guild_id, queue) => {
        let queryQueue = new Array();
        queue.forEach(p=>{
            if(p!==null) queryQueue.push(p);
        });
        while(queryQueue.length < 6){
            queryQueue.push(null);
        }
        queryQueue.push(guild_id);
        await client.db.query("update queues set p1=?, p2=?, p3=?, p4=?, p5=?, p6=? where guild_id=?", queryQueue);
    }

    client.PlayerArrayToString = async (array) => {
        let tempString = "";
        array.forEach(p=>{
            tempString += `<@${p}> `;
        })
        return tempString;
    }

    client.GetMatchDetails = async (match_id) => {
        let [rows, fields] = await client.db.query("select * from matches where match_id=?", [match_id]);
        if(rows.length==0){
            throw `Match ${match_id} doesn't exist!`;
        };
        let Team1 = new Array();
        let Team2 = new Array();
        let row = rows[0];

        Team1.push(row.t1p1);
        Team1.push(row.t1p2);
        if(row.t1p3 != "undefined") Team1.push(row.t1p3);

        Team2.push(row.t2p1);
        Team2.push(row.t2p2);
        if(row.t2p3 != "undefined") Team2.push(row.t2p3);

        let reported = row.reported;
        let winner = row.winner;
        let matchtime = row.matchtime;
        let guild_id = row.guild_id;
        return [[Team1, Team2], reported, winner, matchtime, guild_id];
    }

    client.SetWins = async (user_id, guild_id, wins) => {
        await client.db.query("update players set wins=? where user_id=? and guild_id=?", [wins, user_id, guild_id]);
    }

    client.SetLosses = async (user_id, guild_id, wins) => {
        await client.db.query("update players set losses=? where user_id=? and guild_id=?", [wins, user_id, guild_id]);
    }

    client.AddWin = async (user_id, guild_id) => {
        await client.db.query("update players set wins=wins+1 where user_id=? and guild_id=?", [user_id, guild_id]);
    }

    client.RemoveWin = async (user_id, guild_id) => {
        await client.db.query("update players set wins=wins-1 where user_id=? and guild_id=?", [user_id, guild_id]);
    }

    client.AddLoss = async (user_id, guild_id) => {
        await client.db.query("update players set losses=losses+1 where user_id=? and guild_id=?", [user_id, guild_id]);
    }

    client.RemoveLoss = async (user_id, guild_id) => {
        await client.db.query("update players set losses=losses-1 where user_id=? and guild_id=?", [user_id, guild_id]);
    }

    client.EditScore = async (user_id, guild_id, wins, losses) => {
        await client.db.query("update players set wins=?, losses=? where user_id=? and guild_id=?", [wins, losses, user_id, guild_id]);
    }

    client.CreateMatch = async (Team1, Team2, guild_id) => {

        let date = new Date();
        let dateString = date.toISOString();
        let queryString = `insert into matches values (default, '${Team1[0]}', '${Team1[1]}', '${Team1[2]}', '${Team2[0]}', '${Team2[1]}', '${Team2[2]}', default, default, '${dateString}', '${guild_id}');`;
        await client.db.query(queryString);
                  
        let res = await client.db.query("select match_id from matches where matchtime=?;", [dateString])
        let match_id = res[0][0]
        return [Team1, Team2, match_id];
    
    }

    client.SetMatchAsReported = async (match_id, winner) => {
        await client.db.query("update matches set reported=1, winner=? where match_id=?",[winner, match_id]);
    }

    client.SetMatchAsUnreported = async (match_id) => {
        await client.db.query("update matches set reported=0, winner=NULL where match_id=?",[match_id]);
    }

    client.ReportScore = async (reporter_id, match_id, win, guild_id) => {
        let matchDetails = await client.GetMatchDetails(match_id);
        if(matchDetails[4]!=guild_id) throw `You can't report the score of a match that wasn't played in this server.`;
        if(matchDetails[1]==1) throw `Match ${match_id}'s score has already been reported!`;
        let Teams = matchDetails[0];
        let playerTeam=-1;
        let winningTeam=-1;
        if(Teams[0].indexOf(reporter_id) > -1) playerTeam = 0;
        if(Teams[1].indexOf(reporter_id) > -1) playerTeam = 1;
        if(playerTeam < 0) throw "Person reporting the score must have been in the lobby!";

        switch(win){
            case "win":
                winningTeam=playerTeam;
                break;
            case "loss":
                winningTeam=1-playerTeam;
                break;
            default:
                winningTeam = -1;
                break;
        }
        if(winningTeam<0) throw "You must report either a `win` or a `loss`!";

        for(let p of Teams[winningTeam]){
            await client.AddWin(p, guild_id);
        }
        for(let p of Teams[1-winningTeam]){
            await client.AddLoss(p, guild_id);
        }

        await client.SetMatchAsReported(match_id, winningTeam+1);
        return `Team ${winningTeam+1} won, and the scores have been reported.`;
    }

    client.OrderedLobby = async (lobby, guild_id) => {
        let args = lobby;
        while(args.length < 6){
            args.push(null);
        }
        args.push(guild_id)
        let rows = await client.db.query("select user_id from players where user_id in(?,?,?,?,?,?) and guild_id=? order by (wins-losses) desc, wins desc;", args);
        let queue = new Array();
        try{
            queue.push(rows[0][0].user_id);
            queue.push(rows[0][1].user_id);
            queue.push(rows[0][2].user_id);
            queue.push(rows[0][3].user_id);
            queue.push(rows[0][4].user_id);
            queue.push(rows[0][5].user_id);
            return queue;
        }catch(e){
            return queue;
        }

    }

    client.ResetLeaderboards = async (guild_id) => {
        client.db.query("delete from players where guild_id=?;",[guild_id]);
    }

    client.CreateGuild = async (guild_id) => {
        let [rows] = await client.db.query("select prefix, team_size from config where guild_id=?", [guild_id]);
        if(rows.length!==0){
            //console.log("Entry already exists in the DB for this server.");
            return;
        }
        await client.db.query("insert into config values (?, default, default, default)", [guild_id]);
        //console.log("Prefix set to ! and team size set to 3 and captains mode set to l created for this server.");
        let [id] = await client.db.query("select guild_id from queues where guild_id=?", [guild_id]);
        if(id.length!==0){
            //console.log("Queue already exists in the DB for this server.");
            return;
        }
        await client.db.query("insert into queues values (?, null, null, null, null, null, null)", [guild_id]);
        //console.log("Empty queue created for this server.");

    }

    client.SetPrefix = async (prefix, guild_id) => {
        if(prefix.length > 5){
            throw `Prefix ${prefix} is too long. Must be 5 characters or less.`;
        }
        await client.db.query("update config set prefix=? where guild_id=?", [prefix, guild_id]);
        console.log("Prefix ! created for this server.");
    }

    client.GetPrefix = async (guild_id) => {
        let rows = await client.db.query("select prefix from config where guild_id=?", [guild_id]);
        let prefix = rows[0][0].prefix;
        return prefix;
    }

    client.SetTeamSize = async (team_size, guild_id) => {
        try{
            if(parseInt(team_size) > 3 ||  parseInt(team_size) < 2 ){
                throw `Team size has to be 2 or 3.`;
            }
        } catch (e){
            throw `Team size has to be 2 or 3.`;
        }
       
        await client.db.query("update config set team_size=? where guild_id=?", [team_size, guild_id]);
        console.log("Team size for this server was changed.");
    }

    client.GetTeamSize = async (guild_id) => {
        let rows = await client.db.query("select team_size from config where guild_id=?", [guild_id]);
        let team_size = rows[0][0].team_size;
        return team_size;
    }

    client.SetCaptainsMode = async (mode, guild_id) => {
        if(mode != "l" && mode != "r") throw "Mode must be `l`eaderboards or `r`andom";
       
        await client.db.query("update config set captains=? where guild_id=?", [mode, guild_id]);
        console.log("Captains mode for this server was changed.");
    }

    client.GetCaptainsMode = async (guild_id) => {
        let rows = await client.db.query("select captains from config where guild_id=?", [guild_id]);
        let captains = rows[0][0].captains;
        return captains;
    }

    client.GetActiveMatches = async (guild_id) => {
        let rows = await client.db.query("select match_id from matches where guild_id=? and reported=0;", [guild_id]);
        console.log(rows);
        let matches = new Array();
        rows[0].forEach(r=>{
            matches.push(r.match_id);
        });
        return matches;
    }


    /*
    client.GetMatchHistory = async (user_id, guild_id) => {
        var rows = await client.db.query("select match_id from matches where guild_id=? and (t1p1=? or t1p2=? or t1p3=? or t2p1=? or t2p2=? or t2p3=?) order by match_id desc;", [guild_id, user_id, user_id, user_id, user_id, user_id, user_id]);
        var matchesfromdb = rows[0];
        var matches = new Map();
        matchesfromdb.forEach(async m =>{
            var details = await client.GetMatchDetails(m.match_id);
            details.push(m.match_id);
            matches.set(m.match_id, details);
        });
        return matches;
    }
    */
}