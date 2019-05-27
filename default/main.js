var roleController = require("role.controller");
var roleWorker = require("role.worker");
var roleRepairer = require("role.repairer");
let roleHarvester = require("role.harvester");
let roleTower = require("role.tower");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");

module.exports.loop = function() {
  let lastEnAvail = Memory.enAvail || 0;
  let s1 = Game.spawns.Spawn1;
  let rm = Game.rooms.E35N31;
  let enAvail = Game.rooms.E35N31.energyAvailable;
  let enCap = Game.rooms.E35N31.energyCapacityAvailable;
  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;
  let harvesters = Memory.harvesters || [];
  let upControllers = Memory.upControllers || [];
  let workers = Memory.workers || [];
  let roadRepairers = Memory.roadRepairers || [];
  let claimers = Memory.claimers || [];
  let north = Game.flags.north1;
  let northHarvesters = Memory.northHarvesters || [];
  let east = Game.flags.east;
  let eastHarvesters = Memory.eastHarvesters || [];
  let south = "";
  let southHarvesters = Memory.southHarvesters || [];
  let source1 = rm.lookForAt(LOOK_SOURCES, 41, 8);
  let source2 = rm.lookForAt(LOOK_SOURCES, 29, 15);
  let sourcePath1 = Memory.sourcePath1;
  let sourcePath2 = Memory.sourcePath2;
  let storagePath1 = Memory.storagePath1;
  let tower1Id = Memory.towerId;
  let storagePath2 = Memory.storagePath2;
  let tower1 = Game.getObjectById(tower1Id);
  let invaderId = Game.getObjectById(Memory.invaderId)
    ? Memory.invaderId
    : null;
  let invader = invaderId ? Game.getObjectById(invaderId) : null;
  let pathMainRmToNorthRm =
    Memory.pathMainRmToNorthRm || Game.map.findRoute("E35N31", "E35N31");

  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.tower1Id = "5ce73685d7640d2de26e09bf";
  Memory.north = north;
  Memory.east = east;
  Memory.enAvail = enAvail;
  Memory.enCap = enCap;
  Memory.numCrps = numCrps;

  if (invader) {
    tower1.attack(invader);
  }
  // [{"event":5,"objectId":"5ce87715e727e3413723b950","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}},{"event":9,"objectId":"5ce87e186a175f1460729f7b","data":{"amount":4,"energySpent":4}},{"event":5,"objectId":"5ce87fad6ee37e76c5ac2738","data":{"targetId":"5bbcaefa9099fc012e639e8f","amount":8}},{"event":5,"objectId":"5ce8812b66e33a3411a808dc","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}}]

  let attackEvent = Object.values(Game.rooms)[0].getEventLog()[0];
  //   console.log(Object.values(Game.rooms)[0])

  if (attackEvent && attackEvent.event == EVENT_ATTACK) {
    let attacker = attackEvent.objectId;
    invader = attacker;
    Memory.invaderId = invader.id;
  }

  if (sourcePath1) {
    sourcePath1 = rm.findPath(s1, source1);
    Memory.sourcePath1 = sourcePath1;
  }

  if (storagePath1) {
    storagePath1 = rm.findPath(source1, s1);
    Memory.storagePath1 = storagePath1;
  }

  if (sourcePath2) {
    sourcePath2 = rm.findPath(s1, source2);
    Memory.sourcePath1 = sourcePath2;
  }

  if (storagePath2) {
    Memory.storagePath1 = storagePath1;
    storagePath2 = rm.findPath(source2, s1);
  }

  if (Math.abs(enAvail - lastEnAvail) > 10) {
    console.log(enAvail + "," + enCap);
  }

  if (numCrps < 4 && Object.keys(Memory.creeps).length >= 4) {
    Game.notify("Creeps are dying.");
  } else if (numCrps < 10 && Object.keys(Memory.creeps).length >= 10) {
    Game.notify("Less than 10 creeps left.");
  }

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("â ï¸.", name);
    }
  }

  if (invader) {
    let attackers = Memory.attackers || [];
    if (enAvail >= 260) {
      let kreep;
      let t = Game.time;
      let name = "a" + t;
      let chosenRole = "a";
      let retval = Game.spawns.Spawn1.spawnCreep(
        [ATTACK, ATTACK, MOVE, MOVE],
        name,
        {
          memory: { role: chosenRole }
        }
      );
      attackers.push(name);
    }

    Memory.attackers = attackers;
  }

  // if(enAvail >= 650) {
  //   let t = Game.time;
  //   let name = "c" + t;
  //   let chosenRole = "c";
  //   let retval = Game.spawns.Spawn1.spawnCreep(
  //     [MOVE, CLAIM],
  //     name,
  //     {
  //       memory: { role: chosenRole , north: true, east: false}
  //     }
  //   );

  //   if (retval == OK) {
  //     console.log("ð¶." + name);
  //   }
  // }

  if (enAvail >= 800) {
    let t = Game.time;
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";

    if (southHarvesters.length < 1) {
      southHarvesters.push(name);
    } else if (northHarvesters.length < 3) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (eastHarvesters.length < 3) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (roadRepairers.length < 1) {
      chosenRole = "r";
      name = chosenRole + t;
      roadRepairers.push(name);
    } else if (workers.length < 1) {
      chosenRole = "w";
      name = chosenRole + t;
      workers.push(name);
    } else if (upControllers.length < 1) {
      chosenRole = "uc";
      name = chosenRole + t;
      upControllers.push(name);
    } 
    // else if (eastHarvesters.length < numCrps / 3) {
    //   chosenRole = "h";
    //   name = chosenRole + t + "east";
    //   eastHarvesters.push(name);
    // } else if (northHarvesters.length < numCrps / 3) {
    //   chosenRole = "h";
    //   name = chosenRole + t + "north";
    //   direction = "north";
    //   eastHarvesters.push(name);
    // } 
    else {
      chosenRole = "w";
      name = chosenRole + t;
      workers.push(name);
    }

    let retval = Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, CARRY, MOVE, MOVE, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE],
      name,
      {
        memory: { role: chosenRole, direction: direction }
      }
    );

    if (retval == OK) {
      console.log("ð¶." + name);
    }
  }

  crps = Game.creeps;
  numCrps = crps.length;

  harvesters = [];
  workers = [];
  upControllers = [];
  roadRepairers = [];
  attackers = [];
  claimers = [];
  northHarvesters = [];
  eastHarvesters = [];
  southHarvesters = [];

  let i = 0;
  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (Game.cpu.getUsed() > Game.cpu.tickLimit - Game.cpu.tickLimit / 20) {
      return;
    }

    if (roll == "h" || roll == "harvester" || name.startsWith("h")) {
      if (creep.memory.direction == "north") {
        northHarvesters.push(name);
      } else if (creep.memory.direction == "east") {
        eastHarvesters.push(name);
      } else {
        southHarvesters.push(name);
      }
      creep.memory.role = "harvester";
      harvesters.push(name);
      roleHarvester.run(creep);
    } else if (creep.memory.role == "uc" || name.startsWith("uc")) {
      upControllers.push(name);
      upController(creep);
    } else if (roll == "worker" || roll == "w" || name.startsWith("w")) {
      workers.push(name);
      roleWorker.run(creep);
    } else if (creep.memory.role == "healer" || name.startsWith("he")) {
      hele(creep);
    } else if (creep.memory.role == "controller" || name.startsWith("co")) {
      roleController.run(creep);
    } else if (creep.memory.role == "upgrader" || name.startsWith("up")) {
      roleUpgrader.run(creep);
    } else if (
      roll == "roadRepairer" ||
      roll == "r" //||
      // name.startsWith("r")
    ) {
      roadRepairers.push(name);
      roleRepairer.run(creep);
    } else if (creep.memory.role == "c" || name.startsWith("c")) {
      claimers.push(name);
      creep.memory.role = "c";
      if (creep.memory.east) {
        if (creep.pos.isNearTo(Game.flags.eastExit)) {
          creep.move(RIGHT);
        } else if (creep.room.name == "E36N31") {
          if (creep.pos.isNearTo(Game.flags.eastController)) {
            creep.say(
              creep.reserveController(
                Game.getObjectById("5bbcaf0c9099fc012e63a0be")
              )
            );
          } else {
            creep.moveTo(Game.flags.eastController);
          }
        } else {
          creep.moveTo(Game.flags.eastExit);
        }
      } else {
        if (creep.pos.isNearTo(Game.flags.northExit)) {
          creep.move(RIGHT);
        } else if (creep.room.name == "E35N32") {
          if (creep.pos.isNearTo(Game.flags.northController)) {
            creep.say(
              creep.reserveController(
                Game.getObjectById("5bbcaefa9099fc012e639e8b")
              )
            );
          } else {
            creep.moveTo(Game.flags.northController);
          }
        } else {
          creep.moveTo(Game.flags.northController);
        }
      }
    } else if (creep.memory.role == "a" || name.startsWith("a")) {
      attackers.push(creep);
      if (creep.pos.isNearTo(invader)) {
        creep.attack(invader);
      } else if (invader) {
        creep.moveTo(invader, { range: 1 });
      } else {
        creep.moveTo(Game.spawns.Spawn1, { range: 1 });
        if (Game.spawns.Spawn1.pos.isNearTo(creep)) {
          Game.spawns.Spawn1.recycleCreep(creep);
        }
      }
    }
  }

  if (tower1) {
    roleTower.run();
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
};
