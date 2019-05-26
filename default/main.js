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
  let source1 = rm.lookForAt(LOOK_SOURCES, 41, 8);
  let source2 = rm.lookForAt(LOOK_SOURCES, 29, 15);
  let sourcePath1 = Memory.sourcePath1;
  let sourcePath2 = Memory.sourcePath2;
  let storagePath1 = Memory.storagePath1;
  let storagePath2 = Memory.storagePath2;
  let tower1 = Game.getObjectById("5ce73685d7640d2de26e09bf");
  let invaderId = Memory.invaderId;
  let invader = Game.getObjectById(invaderId);
  let pathMainRmToNorthRm =
    Memory.pathMainRmToNorthRm || Game.map.findRoute("E35N31", "E35N31");

  Memory.north = north;
  Memory.enAvail = enAvail;
  Memory.enCap = enCap;
  Memory.numCrps = numCrps;

  if (invader) {
    tower1.attack(invader);
  }
  // [{"event":5,"objectId":"5ce87715e727e3413723b950","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}},{"event":9,"objectId":"5ce87e186a175f1460729f7b","data":{"amount":4,"energySpent":4}},{"event":5,"objectId":"5ce87fad6ee37e76c5ac2738","data":{"targetId":"5bbcaefa9099fc012e639e8f","amount":8}},{"event":5,"objectId":"5ce8812b66e33a3411a808dc","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}}]

  let attackEvent = Object.values(Game.rooms)[0].getEventLog()[0];
  //   console.log(Object.values(Game.rooms)[0])
  invader = Game.getObjectById("5ce9cee004bcde0c8fc5bbef");

  if (attackEvent && attackEvent.event == EVENT_ATTACK) {
    let attacker = attackEvent.objectId;
    invader = attacker;
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
  //   } else if(numCrps < 15 && Object.keys(Memory.creeps).length >= 15){
  //       Game.notify("Less than 15 creeps left.");
  //   }

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("☠︎.", name);
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

  if (enAvail >= 350) {
    let t = Game.time;
    let name = "h" + t;
    let chosenRole = "h";

    if (harvesters.length < 5) {
      //|| harvesters.length < numCrps / 10) {
      harvesters.push(name);
    } else if (roadRepairers.length < 1) {
      chosenRole = "r";
      name = chosenRole + t;
      roadRepairers.push(name);
    } else if (workers.length < 2) {
      chosenRole = "w";
      name = chosenRole + t;
      workers.push(name);
    } else if (upControllers.length < 1) {
      chosenRole = "uc";
      name = chosenRole + t;
      upControllers.push(name);
    } else {
      chosenRole = "h";
      name = chosenRole + t;
      workers.push(name);
    }

    let retval = Game.spawns.Spawn1.spawnCreep(
      [CARRY, CARRY, WORK, MOVE, MOVE, MOVE],
      name,
      {
        memory: { role: chosenRole }
      }
    );

    if (retval == OK) {
      console.log("👶." + name);
    }
  } else if (harvesters.length < 4 && enAvail >= 300) {
    let name = "h" + Game.time;
    Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, WORK, MOVE, MOVE], name, {
      memory: { role: "h" }
    });
    enAvail = 0;
    Memory.enAvail = 0;
    harvesters.push(Game.creeps.name);
  } else if (upControllers.length < 1 && enAvail >= 300) {
    let name = "uc" + Game.time;
    Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, WORK, MOVE, MOVE], name, {
      memory: { role: "uc" }
    });
    enAvail = 0;
    Memory.enAvail = 0;
    upControllers.push(Game.creeps.name);
  } else if (roadRepairers.length < 1 && enAvail >= 300) {
    let name = "r" + Game.time;
    Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, WORK, MOVE, MOVE], name, {
      memory: { role: "r" }
    });
    enAvail = 0;
    Memory.enAvail = 0;
    roadRepairers.push(Game.creeps.name);
  } else if (workers.length < 1 && enAvail >= 300) {
    let name = "w" + Game.time;
    Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, WORK, MOVE, MOVE], name, {
      memory: { role: "w" }
    });
    enAvail = 0;
    Memory.enAvail = 0;
    workers.push(Game.creeps.name);
  }

  crps = Game.creeps;
  numCrps = crps.length;

  if (Game.cpu.getUsed() < Game.cpu.tickLimit) {
    harvesters = [];
    workers = [];
    upControllers = [];
    roadRepairers = [];
    attackers = [];

    for (let name in crps) {
      let creep = crps[name];
      creep.memory.role = "h";
      let roll = creep.memory.role;

      if (roll == "h" || roll == "harvester") {
        creep.memory.role = "harvester";
        harvesters.push(name);
        roleHarvester.run(creep);
      } else if (creep.memory.role == "uc") {
        upControllers.push(name);
        upController(creep);
      } else if (roll == "worker" || roll == "w") {
        workers.push(name);
        roleWorker.run(creep);
      } else if (creep.memory.role == "healer") {
        hele(creep);
      } else if (creep.memory.role == "controller") {
        roleController.run(creep);
      } else if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep);
      } else if (roll == "roadRepairer" || roll == "r") {
        roadRepairers.push(name);
        roleRepairer.run(creep);
      } else if (creep.memory.role == "c") {
        claimers.push(name);
        //   creep.moveTo(Game.flags.north1.pos.lookFor(LOOK_SOURCES))
        // creep.move(TOP);
        //  creep.moveTo(9,6);
        creep.memory.role = "c";
        // getEnergy(creep, Game.getObjectById("5bbcaefa9099fc012e639e8c"));
        // console.log(
        //   creep.claimController(
        //     Game.flags.northController.pos.lookFor(STRUCTURE_CONTROLLER)
        //   )
        // );
      } else if (creep.memory.role == "a") {
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
  }
};
