var roleController = require("role.controller");
var createHarvester = require("create.harvester");
var createController = require("create.controller");
var roleWorker = require("role.worker");
var roleRepairer = require("role.repairer");
const hele = require("./action.hele");
const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const upController = require("./action.upgradeController");

module.exports.loop = function() {
  let f1 = Game.flags["Flag1"];
  let f2 = Game.flags["Flag2"];
  let enAvail = Game.rooms.E35N31.energyAvailable;
  let enCap = Game.rooms.E35N31.energyCapacityAvailable;
  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;
  let contr = Game.getObjectById("5bbcaefa9099fc012e639e90");
  let hv = Memory.hv;
  let uc = Memory.uc;

  if (Game.cpu.getUsed() > Game.cpu.tickLimit / 2) {
    console.log(Game.cpu.getUsed() + "," + Game.cpu.tickLimit);
  }

  if (true) {
    // for (let name in crps) {
    //   let cr = crps[name];
    //   if (_.sum(cr.carry) == 0) {
    //     getEnergy(cr);
    //   } else {
    //     upController(crps[name]);
    //   }
    // }
    // if (enAvail >= 300) {
    //   let retval = Game.spawns["Spawn1"].spawnCreep(
    //     [CARRY, WORK, WORK, MOVE],
    //     "uc" + Game.time,
    //     { memory: { role: "up" } }
    //   );
    //   console.log("spawning uc: " + retval);
    // }

  }

  if (contr.level < 2 || contr.ticksToDowngrade < 1000) {
    let cr;
    for (let name in crps) {
      cr = crps[name];
      if (_.sum(cr.carry) == 0) {
        getEnergy(cr);
      } else {
        upController(cr);
      }
    }
  }

  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("del creep memory:", name);
      uc,
        (Memory.uc = _.filter(crps, creep => {
          creep.memory.role == "up";
        }).length);
      hv,
        (Memory.hv = _.filter(crps, creep => {
          creep.memory.role == "harvester";
        }).length);
    }
  }

  if (Game.cpu.getUsed() < Game.cpu.tickLimit / 3) {
    for (var name in Game.creeps) {
      if (Memory.creeps[name]) {
        // if(!Memory.creeps[name].memory.role) {
        //     Memory.creeps[name].memory.role='worker';
        // }
        continue;
      }

      creep = Game.creeps[name];
      Memory.creeps.push(creep.name);
      creep.memory.role='worker';
    }
  }

    console.log(enAvail + "," + enCap);
//   if (enAvail > (enCap * 2) / 3) {
//   } else if (enAvail % 100 == 0) {
//     console.log(enAvail + " , " + enCap);
//   }

  if (enAvail >= 550) {
    let retval = Game.spawns["Spawn1"].spawnCreep(
      [CARRY, WORK, WORK, WORK, WORK, MOVE, MOVE],
      "worker" + Game.time,
      { memory: { role: "worker" } }
    );
    console.log("spawning worker: " + retval);
  } else if (hv < numCrps / 4) {
    let i = 0;

    for (let name in Game.creeps) {
      if (Game.creeps[name]) {
        let creep = Game.creeps[name];
        creep.memory.role = "harvester";
        i = i + 1;
      }

      if (i == numCrps / 4) {
        break;
      }
    }

    if (enAvail >= 300) {
      let retval = Game.spawns["Spawn1"].spawnCreep(
        [CARRY, WORK, WORK, MOVE],
        "harvester" + Game.time,
        { memory: { role: "harvester" } }
      );
      console.log("spawning vester: " + retval);
      if (retval == OK) {
          i = i + 1;
      }
    }
    
    Memory.hv = i;
  } else if (uc < numCrps / 3) {
    let i = 0;

    for (let name in Game.creeps) {
      if (Game.creeps[name]) {
        let creep = Game.creeps[name];
        creep.memory.role = "up";
        i = i + 1;
      }

      if (i == numCrps / 3) {
        break;
      }

      if (enAvail >= 350) {
        let retval = Game.spawns["Spawn1"].spawnCreep(
          [CARRY, WORK, WORK, MOVE, MOVE],
          "uc" + Game.time,
          { memory: { role: "up" } }
        );
        console.log("spawning uc: " + retval);
        if (retval == OK) {
          i = i + 1;
        }
      }
      Memory.uc = i;
    }
  } else if (enCap <= 400 && enAvail >= 400) {
      let retval = Game.spawns["Spawn1"].spawnCreep(
          [CARRY, WORK, MOVE, MOVE, MOVE, MOVE, MOVE],
          "worker" + Game.time,
          { memory: { role: "worker" } }
        );
        console.log("spawning worker: " + retval);
  }

  if (Game.cpu.getUsed() < Game.cpu.tickLimit / 2) {
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];

      if (creep.memory.role == "healer") {
        hele(creep);
      }

      if (creep.memory.role == "worker") {
        roleWorker.run(creep);
      }

      if (creep.memory.role == "controller") {
        roleController.run(creep);
      }

      if (creep.memory.role == "harvester") {
        if (creep.memory.transfer) {
          transferEnergy(creep);
        } else {
          creep.memory.transfer = false;
          getEnergy(creep);
        }
      }

      if (creep.memory.role == "up") {
        upController(creep);
      }

      if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep);
      }

      if (creep.memory.role == "repairer") {
        roleRepairer.run(creep);
      }
    }
  }
};
