const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("role.harvester");
const roleTower = require("role.tower");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const chainMove = require("./chainMove");
const rezzyContr = require("./action.reserveContr");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");

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
  let westHarvesters = Memory.westHarvesters || [];
  let south = "";
  let southHarvesters = Memory.southHarvesters || [];

  let spawnChainHarvester = Memory.spawnChainHarvester;
  let spawnChainTransferers = Memory.spawnChainHarvesters || [];
  let spawnChainMover = Memory.spawnChainMover;

  let source1 = rm.lookForAt(LOOK_SOURCES, 41, 8).pop();
  let source2 = rm.lookForAt(LOOK_SOURCES, 29, 15).pop();

  let tower1Id = Memory.towerId || "5cecf4602c0c2b401dc70bc6";

  let tower1 = Game.getObjectById(tower1Id);
  let invaderId = Memory.invaderId;
  let invader = invaderId ? Game.getObjectById(invaderId) : null;

  Memory.invaderId = invader ? invaderId : null;
  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.tower1Id = "5cecf4602c0c2b401dc70bc6";
  Memory.north = north;
  Memory.east = east;
  Memory.enAvail = enAvail;
  Memory.enCap = enCap;
  Memory.numCrps = numCrps;
  Memory.source1 = source1;
  Memory.source2 = source2;
  Memory.s1 = s1;

  if (invader) {
    tower1.attack(invader);
  }

  let attackEvent = Object.values(Game.rooms)[0].getEventLog()[0];
  //   console.log(Object.values(Game.rooms)[0])

  if (attackEvent && attackEvent.event == EVENT_ATTACK) {
    let attacker = attackEvent.objectId;
    invader = Game.getObjectById(attacker);
    Memory.invaderId = invader.id;
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
      console.log("del.", name);
      if (name === "harvester1") {
        Memory.harvester1 = null;
      } else if (name === "transferer1") {
        Memory.transferer1 = null;
      } else if (name === "mover1") {
        Memory.mover1 = null;
      }
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

  let harvester1 = Game.creeps.harvester1;
  if (!harvester1 && enAvail >= 500) {
    let name = "harvester1";
    let parts = [WORK, WORK, WORK, WORK, WORK];
    let chosenRole = "hChain";
    let direction = BOTTOM_LEFT;
    let retval = s1.spawnCreep(
      parts,
      name,
      {
        memory: { role: chosenRole }
      },
      [direction]
    );
    console.log("spawning harvester1:" + retval);
  } else if (harvester1 && !Game.creeps["transferer1"] && enAvail >= 50) {
    let name = "transferer1";
    let parts = [CARRY];
    let chosenRole = "transferer";
    let direction = LEFT;
    let retval = s1.spawnCreep(
      parts,
      name,
      {
        memory: { role: chosenRole }
      },
      [direction]
    );
    console.log("spawning transferer1:" + retval);
  } else if (harvester1 && !Game.creeps["transferer2"] && enAvail >= 50) {
    let name = "transferer2";
    let parts = [CARRY];
    let chosenRole = "transferer";
    let direction = LEFT;
    let retval = s1.spawnCreep(
      parts,
      name,
      {
        memory: { role: chosenRole }
      },
      [direction]
    );
  }

  spawnToSource1Chain();

  if (enAvail >= 700) {
    let t = Game.time;
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let spawnDirection = "BOTTOM";
    let waitForRezzy = false;
    let parts = [
      CARRY,
      CARRY,
      WORK,
      WORK,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ];
    if (southHarvesters.length < 1) {
      southHarvesters.push(name);
      parts = [
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        WORK,
        WORK,
        WORK,
        MOVE,
        MOVE
      ];
    } else if (northHarvesters.length < 2) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (eastHarvesters.length < 2) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (westHarvesters.length < 2) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
    } else if (roadRepairers.length < 1) {
      chosenRole = "r";
      name = chosenRole + t;
      parts = [
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        WORK,
        MOVE
      ];
      roadRepairers.push(name);
    } else if (workers.length < 1) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = [
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        WORK,
        WORK,
        MOVE
      ];
      workers.push(name);
    } else if (upControllers.length < 1) {
      chosenRole = "uc";
      name = chosenRole + t;
      parts = [
        CARRY,
        CARRY,
        WORK,
        WORK,
        WORK,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE
      ];
      upControllers.push(name);
    } else if (!Game.creeps["northRezzy"]) {
      console.log("northRezzy");
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "northRezzy";
        name = chosenRole;
        direction = "north";
        parts = [CLAIM, MOVE];
      }
    } else if (!Game.creeps["eastRezzy"]) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "eastRezzy";
        name = chosenRole;
        direction = "east";
        parts = [CLAIM, MOVE];
      }
    } else if (!Game.creeps["westRezzy"]) {
      waitForRezzy = true;
      if (enAvail >= 650) {
        chosenRole = "westRezzy";
        name = chosenRole;
        direction = "west";
        parts = [CLAIM, MOVE];
      }
    } else if (northHarvesters.length < 5) {
      name += "north";
      direction = "north";
      northHarvesters.push(name);
    } else if (eastHarvesters.length < 5) {
      name += "east";
      direction = "east";
      eastHarvesters.push(name);
    } else if (westHarvesters.length < 5) {
      name += "west";
      direction = "west";
      westHarvesters.push(name);
    } else if (workers.length < 4) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = [CARRY, CARRY, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE];
      workers.push(name);
    } else {
      chosenRole = "uc";
      parts = [CARRY, CARRY, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE];
      name = chosenRole + t;
      upControllers.push(name);
    }

    if (!waitForRezzy || name.endsWith("Rezzy")) {
      let retval = Game.spawns.Spawn1.spawnCreep(
        parts,
        name,
        {
          memory: { role: chosenRole, direction: direction }
        },
        [spawnDirection]
      );

      if (retval == OK) {
        console.log("spawned." + name);
      }
    } else {
      console.log("wait for rezzy");
    }
  } else if (numCrps < 12 && enAvail >= 300) {
    let t = Game.time;
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let retval = Game.spawns.Spawn1.spawnCreep(
      [CARRY, WORK, WORK, MOVE],
      name,
      {
        memory: { role: chosenRole, direction: direction }
      },
      [spawnDirection]
    );

    if (retval == OK) {
      console.log("spawned." + name);
    }
  }

  crps = Game.creeps;
  numCrps = Object.keys(crps).length;

  harvesters = [];
  workers = [];
  upControllers = [];
  roadRepairers = [];
  attackers = [];
  claimers = [];
  northHarvesters = [];
  eastHarvesters = [];
  southHarvesters = [];
  westHarvesters = [];

  let i = 0;
  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (Game.cpu.getUsed() > Game.cpu.tickLimit - Game.cpu.tickLimit / 20) {
      return;
    }

    if (roll == "h" || roll == "harvester") {
      if (creep.memory.direction == "north") {
        northHarvesters.push(name);
      } else if (creep.memory.direction == "east") {
        eastHarvesters.push(name);
      } else if (creep.memory.direction == "west") {
        westHarvesters.push(name);
      } else {
        southHarvesters.push(name);
      }
      creep.memory.role = "harvester";
      harvesters.push(name);
      roleHarvester.run(creep);
    } else if (roll == "northRezzy") {
      rezzyContr(
        creep,
        "E35N32",
        Game.flags.northExit,
        TOP,
        "northEntrance1",
        "5bbcaefa9099fc012e639e8b"
      );
    } else if (roll == "eastRezzy") {
      rezzyContr(
        creep,
        "E36N31",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0be"
      );
    } else if (roll == "westRezzy") {
      rezzyContr(
        creep,
        "E34N31",
        Game.flags.westExit,
        LEFT,
        "westEntrance1",
        "5bbcaeeb9099fc012e639c4d"
      );
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
    roleTower.run(tower1);
  }

  if (Game.time % 0 == 0) {
    console.log("Creeps:" + numCrps);
  }
  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.eastHarvesters = eastHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
};
