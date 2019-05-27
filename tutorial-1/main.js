module.exports.loop = function () {
   let creepNames = Object.keys(Game.creeps);
   let creeps = Object.values(Game.creeps);
   let s1 = Game.spawns.s1;
   if(creepNames.length < 2) {
       s1.spawnCreep([MOVE, CARRY, WORK], "h" + String(Game.time).substring(0,2));
   } else if (s1.room.energyAvailable >= 260) {
       s1.spawnCreep([ATTACK, ATTACK, MOVE, MOVE], "a" + String(Game.time).substring(0,3));
   }
   
   
   let h1 = Game.creeps.h1;
   let source1 = Game.getObjectById("953fd835ae79115cf96445b1");
   for (let n in Game.creeps) {
       let creep = Game.creeps[n];
       if(n.startsWith("h")) {
           if(_.sum(creep.carry) >= creep.carryCapacity || creep.memory.transfer) {
               creep.memory.transfer = true;
            if(creep.pos.isNearTo(s1)) {
                creep.transfer(s1, RESOURCE_ENERGY);
            }     else {
                creep.moveTo(s1);
            }
            if (_.sum(creep.carry) <= 0) creep.memory.transfer = false;
           } else {
              creep.memory.transfer = false;
              if(creep.pos.isNearTo(source1)) {
                  creep.harvest(source1);
              } else {
                  creep.moveTo(source1);
              }
           }
       } else {
           console.log("id: " + Memory.invaderId);
           let id = Memory.invaderId;
           
           if(id) {
               let invader = Game.getObjectById(Memory.invaderId);
               console.log(invader);
               if(!invader) Memory.invaderId = null;
               console.log(creep.attack(invader));
               console.log(creep.moveTo(invader));
               console.log("attack");
           } else {
               
            creep.moveTo(Game.getObjectById("e83c30071858c4d9d173b614"))
           }
       }
   }
   if(Game.rooms.sim.getEventLog()[0].event == EVENT_ATTACK) {
       console.log("event attack");
       Memory.invaderId = Game.rooms.sim.getEventLog()[0].objectId;
       console.log(Game.rooms.sim.getEventLog()[0].objectId);
   }
//   console.log(JSON.stringify(Game.getObjectById(Game.rooms.sim.getEventLog()[0].objectId)));
}