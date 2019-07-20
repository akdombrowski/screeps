

function spawn() {
    let retval = Game.spawns.s1.spawnCreep([MOVE,MOVE,MOVE,CARRY,WORK], 'a' + Game.time);     
    console.log("spawn:"+retval);
}

module.exports = spawn;