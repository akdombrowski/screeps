const spawnBackupCreeps = require("./spawnBackupCreeps");
const profiler = require("./screeps-profiler");
const {
  logConditionPassedForSpawnCreep,
} = require("./logConditionPassedForSpawnCreep");

function addPart(arr, count, part) {
  for (let i = 0; i < count; i++) {
    arr.push(part);
  }
}
addPart = profiler.registerFN(addPart, "addPart");

function deepSouthbirthCreep(
  spawns,
  parts,
  name,
  chosenRole,
  direction,
  sourceId,
  spawnDirection,
  group
) {
  let retval = -16;
  let enAvail = -1;

  for (const spawn of spawns) {
    try {
      let spawningPositionBlocked = spawn.room.lookForAt(
        LOOK_CREEPS,
        spawn.pos.x,
        spawn.pos.y - 1
      );

      enAvail = spawn.room.energyAvailable;

      if (!spawningPositionBlocked || spawningPositionBlocked.length <= 0) {
        retval = spawn.spawnCreep(parts, name, {
          memory: {
            role: chosenRole,
            direction: direction,
            sourceId: sourceId,
            group: group,
          },
          directions: spawnDirection,
        });
      } else {
        retval = spawn.spawnCreep(parts, name, {
          memory: {
            role: chosenRole,
            direction: direction,
            sourceId: sourceId,
          },
        });
      }

      if (retval === OK) {
        console.log(
          "dSSpawn1ed." +
            name +
            " " +
            chosenRole +
            " " +
            group +
            " " +
            direction +
            " " +
            spawnDirection
        );
        return retval;
      }
    } catch (e) {
      // likely not actually a spawn in the array
      // console.log("spawns " + spawn)
    }
  }
  return retval;
}
deepSouthbirthCreep = profiler.registerFN(
  deepSouthbirthCreep,
  "deepSouthbirthCreep"
);

function deepSouthspawnCreepTypes(enAvail, spawns) {
  if (Game.spawns.deepSouthSpawn1.spawning || enAvail < 300) {
    return;
  }

  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let harvestersE59S47 = Memory.harvestersE59S47 || [];
  let harvestersE59S49 = Memory.harvestersE59S49 || [];
  let harvestersE58S49 = Memory.harvestersE58S49 || [];
  let upControllers = Memory.upControllers || [];
  let upControllersE59S47 = Memory.upControllersE59S47 || [];
  let upControllersE59S49 = Memory.upControllersE59S49 || [];
  let upControllersE58S49 = Memory.upControllersE58S49 || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersE59S47 = Memory.roadRepairersE59S47 || [];
  let roadRepairersE59S49 = Memory.roadRepairersE59S49 || [];
  let roadRepairersE58S49 = Memory.roadRepairersE58S49 || [];
  let roadBuilders = Memory.roadBuilders || [];
  let reservers = Memory.reservers || [];
  let towerHarvesters = Memory.towerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersE58S49 = Memory.claimersE58S49 || [];
  let rangedAttackers = Memory.rangedAttackers || [];
  let rangedAttackersE59S47 = Memory.rangedAttackersE59S47 || [];
  let rangedAttackersE59S49 = Memory.rangedAttackersE59S49 || [];
  let attackers = Memory.attackers || [];
  let attackersE59S47 = Memory.attackersE59S47 || [];
  let attackersE59S49 = Memory.attackersE59S49 || [];
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let nwAttackDurationSafeCheck = Memory.nwAttackDurationSafeCheck;
  let nwwAttackDurationSafeCheck = Memory.nwwAttackDurationSafeCheck;
  let creepsE59S48 = Memory.creepsE59S48;
  let creepsE59S47 = Memory.creepsE59S47;
  let creepsE59S49 = Memory.creepsE59S49;
  let creepsE58S49 = Memory.creepsE58S49;

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.deepSouthSpawn1;

  // 200
  let upContrParts200 = [];
  addPart(upContrParts200, 1, CARRY);
  addPart(upContrParts200, 1, WORK);
  addPart(upContrParts200, 1, MOVE);

  // 200
  let rangedAttackerParts200 = [];
  addPart(rangedAttackerParts200, 1, MOVE);
  addPart(rangedAttackerParts200, 1, RANGED_ATTACK);

  // 290
  let attackerParts290 = [];
  addPart(attackerParts290, 1, MOVE);
  addPart(attackerParts290, 3, ATTACK);

  // 300
  let linkGetsParts300 = [];
  addPart(linkGetsParts300, 1, CARRY);
  addPart(linkGetsParts300, 1, WORK);
  addPart(linkGetsParts300, 3, MOVE);

  // 350
  let rangedAttackerParts350 = [];
  addPart(rangedAttackerParts350, 1, MOVE);
  addPart(rangedAttackerParts350, 2, RANGED_ATTACK);

  // 400
  let rangedAttackerParts400 = [];
  addPart(rangedAttackerParts400, 2, MOVE);
  addPart(rangedAttackerParts400, 2, RANGED_ATTACK);

  // 450
  let harvester450 = [];
  addPart(harvester450, 1, CARRY);
  addPart(harvester450, 2, WORK);
  addPart(harvester450, 4, MOVE);

  // 450
  let repairer450 = [];
  addPart(repairer450, 1, CARRY);
  addPart(repairer450, 2, WORK);
  addPart(repairer450, 4, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 1, CARRY);
  addPart(workerParts500, 3, WORK);
  addPart(workerParts500, 3, MOVE);

  // 500
  let attackerParts500 = [];
  addPart(attackerParts500, 5, MOVE);
  addPart(attackerParts500, 3, ATTACK);

  // 550
  let rangedAttackerParts550 = [];
  addPart(rangedAttackerParts550, 2, MOVE);
  addPart(rangedAttackerParts550, 3, RANGED_ATTACK);

  // 550
  let workerParts550 = [];
  addPart(workerParts550, 1, CARRY);
  addPart(workerParts550, 3, WORK);
  addPart(workerParts550, 4, MOVE);

  // 550
  let harvesterParts550 = [];
  addPart(harvesterParts550, 1, CARRY);
  addPart(harvesterParts550, 3, WORK);
  addPart(harvesterParts550, 4, MOVE);

  // 650
  let claimerParts650 = [];
  addPart(claimerParts650, 1, MOVE);
  addPart(claimerParts650, 1, CLAIM);

  // 800
  let rangedAttackerParts800 = [];
  addPart(rangedAttackerParts800, 4, MOVE);
  addPart(rangedAttackerParts800, 4, RANGED_ATTACK);

  // 800
  let harvesterParts800 = [];
  addPart(harvesterParts800, 1, CARRY);
  addPart(harvesterParts800, 5, WORK);
  addPart(harvesterParts800, 5, MOVE);

  // 800
  let workerParts800 = [];
  addPart(workerParts800, 1, CARRY);
  addPart(workerParts800, 5, WORK);
  addPart(workerParts800, 5, MOVE);

  // 800
  let upContrParts800 = [];
  addPart(upContrParts800, 1, CARRY);
  addPart(upContrParts800, 5, WORK);
  addPart(upContrParts800, 5, MOVE);

  // 850
  let harvesterParts850 = [];
  addPart(harvesterParts850, 1, CARRY);
  addPart(harvesterParts850, 5, WORK);
  addPart(harvesterParts850, 6, MOVE);

  // 850
  let workerParts850 = [];
  addPart(workerParts850, 1, CARRY);
  addPart(workerParts850, 5, WORK);
  addPart(workerParts850, 6, MOVE);

  // 850
  let upContrParts850 = [];
  addPart(upContrParts850, 1, CARRY);
  addPart(upContrParts850, 5, WORK);
  addPart(upContrParts850, 6, MOVE);

  // 1100
  let medsouthHvParts1100 = [];
  addPart(medsouthHvParts1100, 1, CARRY);
  addPart(medsouthHvParts1100, 6, WORK);
  addPart(medsouthHvParts1100, 9, MOVE);

  // 2500
  let moverParts2500 = [];
  addPart(moverParts2500, 50, MOVE);

  // 2750
  let newhvParts2750 = [];
  addPart(newhvParts2750, 1, CARRY);
  addPart(newhvParts2750, 25, WORK);
  addPart(newhvParts2750, 24, MOVE);

  // 2900
  let workerParts2900 = [];
  addPart(workerParts2900, 1, CARRY);
  addPart(workerParts2900, 25, WORK);
  addPart(workerParts2900, 27, MOVE);

  // 3000
  let bigclaimerParts3000 = [];
  addPart(bigclaimerParts3000, 6, MOVE);
  addPart(bigclaimerParts3000, 4, CLAIM);

  // 3000
  let upContrPartsBig3000 = [];
  addPart(upContrPartsBig3000, 16, CARRY);
  addPart(upContrPartsBig3000, 12, WORK);
  addPart(upContrPartsBig3000, 22, MOVE);

  // 3000
  let repairerParts3000 = [];
  addPart(repairerParts3000, 1, CARRY);
  addPart(repairerParts3000, 25, WORK);
  addPart(repairerParts3000, 24, MOVE);

  // 3000
  let travelhvParts3000 = [];
  addPart(travelhvParts3000, 1, CARRY);
  addPart(travelhvParts3000, 25, WORK);
  addPart(travelhvParts3000, 24, MOVE);

  // 3000
  let largeLinkGetsParts3000 = [];
  addPart(largeLinkGetsParts3000, 20, CARRY);
  addPart(largeLinkGetsParts3000, 10, WORK);
  addPart(largeLinkGetsParts3000, 20, MOVE);

  // 3250
  let bigAttackerParts3250 = [];
  addPart(bigAttackerParts3250, 25, MOVE);
  addPart(bigAttackerParts3250, 25, ATTACK);

  // 3750
  let southHvParts3750 = [];
  addPart(southHvParts3750, 1, CARRY);
  addPart(southHvParts3750, 25, WORK);
  addPart(southHvParts3750, 24, MOVE);

  let rezzyParts = [CLAIM, MOVE];
  let basicCarry300 = [CARRY, CARRY, CARRY, WORK, MOVE];
  let basicHv200 = [CARRY, WORK, MOVE];
  let simpleParts300 = [CARRY, WORK, MOVE, MOVE, MOVE];
  let simpleParts350 = [CARRY, WORK, MOVE, MOVE, MOVE, MOVE];
  let simpleParts400 = [CARRY, WORK, WORK, MOVE, MOVE, MOVE];
  let simpleParts500 = [CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.invaderIDE59S47;
  let neAttackerId = Memory.neAttackerId;
  let dSAttackerId = Memory.invaderIDE59S49;
  let invaderId = Memory.invaderIDE59S48;

  let retval = -16;

  const contrW = Game.getObjectById("5bbcaeeb9099fc012e639c4d");
  const contrNW = Game.getObjectById("5bbcaeeb9099fc012e639c4a");
  const contrNWW = Game.getObjectById("5bbcaedb9099fc012e639a93");

  const timeDigitsSlice = 2;
  const t = Game.time.toString().slice(timeDigitsSlice);

  const numOfCreepsTotal = Object.keys(Game.creeps).length;

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 800 && rangedAttackersE59S49.length < 1) {
    logConditionPassedForSpawnCreep(
      "rangedAttackersE59S49",
      rangedAttackersE59S49,
      1
    );
    let name = "aRdS" + t;
    let chosenRole = "rangedAttacker";
    let direction = "deepSouth";
    let sourceId = Memory.nSource2;
    let parts = rangedAttackerParts800;
    let group = "rangedttackersE59S49";
    let spawnDirection = [TOP];

    creepsE59S49.push(name);
    rangedAttackersE59S49.push(name);
    retval = deepSouthbirthCreep(
      spawns,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection,
      group
    );

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 800");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 550 && rangedAttackers.length < 0) {
    logConditionPassedForSpawnCreep("rangedAttackers", rangedAttackers, 0);
    let name = "aR" + t;
    let chosenRole = "rangedAttacker";
    let direction = "south";
    let sourceId = Memory.nSource2;
    let parts = rangedAttackerParts550;
    let group = "rangedttackersE59S48";
    let spawnDirection = [TOP];

    creepsE59S48.push(name);
    rangedAttackers.push(name);
    retval = deepSouthbirthCreep(
      spawns,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection,
      group
    );

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 550");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //     #     #######  #######     #      #####   #    #
  //    # #       #        #       # #    #     #  #   #
  //   #   #      #        #      #   #   #        #  #
  //  #     #     #        #     #     #  #        ###
  //  #######     #        #     #######  #        #  #
  //  #     #     #        #     #     #  #     #  #   #
  //  #     #     #        #     #     #   #####   #    #
  if (enAvail >= 500 && attackersE59S49.length < 0 && Memory.dSAttackerId) {
    logConditionPassedForSpawnCreep("attackersE59S49", attackersE59S49, 0);
    let name = "att" + t;
    let chosenRole = "attacker";
    let direction = "north";
    let sourceId = Memory.nSource2;
    let parts = attackerParts500;
    let group = "attackersN";
    let spawnDirection = [TOP];

    attackersE59S49.push(name);
    retval = deepSouthbirthCreep(
      spawns,
      parts,
      name,
      chosenRole,
      direction,
      sourceId,
      spawnDirection,
      group
    );

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 500");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####     ###      ###
  //  #     #   #   #    #   #
  //        #  #     #  #     #
  //   #####   #     #  #     #
  //        #  #     #  #     #
  //  #     #   #   #    #   #
  //   #####     ###      ###
  if (enAvail >= 300 && !Memory.dSAttackerId) {
    let name = "hdS" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (creepsE59S49.length < 6) {
      logConditionPassedForSpawnCreep(
        "creepsE59S49",
        harvescreepsE59S49tersE59S49,
        6
      );
      parts = simpleParts300;
      group = "harvestersE59S49";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (creepsE59S48.length < 6) {
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 6);
      name = "h" + t;
      parts = simpleParts300;
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 300");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####     ###      ###
  //  #     #   #   #    #   #
  //        #  #     #  #     #
  //   #####   #     #  #     #
  //        #  #     #  #     #
  //  #     #   #   #    #   #
  //   #####     ###      ###
  if (enAvail >= 300 && !Memory.dSAttackerId) {
    let name = "hdS" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvestersE59S49";
    let spawnDirection = [TOP];

    if (upControllersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "upControllersE59S49",
        upControllersE59S49,
        1
      );
      name = "upCdS" + t;
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      parts = simpleParts300;
      creepsE59S49.push(name);
      upControllersE59S49.push(name);

      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S49",
        roadRepairersE59S49,
        1
      );
      parts = simpleParts300;
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (creepsE59S49.length < 8) {
      logConditionPassedForSpawnCreep("creepsE59S49", creepsE59S49, 8);
      parts = simpleParts300;
      direction = "deepSouth";
      group = "harvestersE59S49";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 300");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // //   #####   #######    ###
  // //  #     #  #         #   #
  // //        #  #        #     #
  // //   #####   ######   #     #
  // //        #        #  #     #
  // //  #     #  #     #   #   #
  // //   #####    #####     ###
  // if (enAvail >= 350 && !Memory.dSAttackerId) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source1;
  //   let parts = simpleParts350;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (upControllersE59S49.length < 1) {
  //     name = "upCdS" + t;
  //     chosenRole = "upCdS";
  //     direction = "deepSouth";
  //     group = "upControllersE59S49";
  //     parts = simpleParts350;
  //     creepsE59S49.push(name);
  //     upControllersE59S49.push(name);

  //     retval = deepSouthbirthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   } else if (harvestersE59S49.length < 4) {
  //     parts = simpleParts350;
  //     direction = "deepSouth";
  //     chosenRole = "h";
  //     creepsE59S49.push(name);
  //     harvestersE59S49.push(name);
  //     retval = deepSouthbirthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   } else if (roadRepairersE59S49.length < 1) {
  //     parts = simpleParts350;
  //     name = "rRdS" + t;
  //     chosenRole = "roadRepairer";
  //     direction = "deepSouth";
  //     group = "roadRepairersE59S49";
  //     creepsE59S49.push(name);
  //     roadRepairersE59S49.push(name);
  //     retval = deepSouthbirthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningdS " + name + " " + retval);
  // console.log("energy: 350");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  // //
  // //
  // //
  // // .##..........#####.....#####..
  // // .##....##...##...##...##...##.
  // // .##....##..##.....##.##.....##
  // // .##....##..##.....##.##.....##
  // // .#########.##.....##.##.....##
  // // .......##...##...##...##...##.
  // // .......##....#####.....#####..
  // //
  // //
  // //
  // if (enAvail >= 400 && !Memory.dSAttackerId) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source1;
  //   let parts = simpleParts400;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (upControllersE59S49.length < 1) {
  //     logConditionPassedForSpawnCreep(
  //       "upControllersE59S49",
  //       upControllersE59S49,
  //       1
  //     );
  //     name = "upCdS" + t;
  //     chosenRole = "upCdS";
  //     direction = "deepSouth";
  //     group = "upControllersE59S49";
  //     parts = simpleParts400;
  //     creepsE59S49.push(name);
  //     upControllersE59S49.push(name);

  //     retval = deepSouthbirthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   } else if (harvestersE59S49.length < 7 && creepsE59S49.length < 13) {
  //     logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 7);
  //     logConditionPassedForSpawnCreep("creepsE59S49", creepsE59S49, 13);
  //     parts = simpleParts400;
  //     direction = "deepSouth";
  //     chosenRole = "h";
  //     creepsE59S49.push(name);
  //     harvestersE59S49.push(name);
  //     retval = deepSouthbirthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningdS " + name + " " + retval);
  //     console.log("energy: 400");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  //
  //
  //
  // .##........########...#####..
  // .##....##..##........##...##.
  // .##....##..##.......##.....##
  // .##....##..#######..##.....##
  // .#########.......##.##.....##
  // .......##..##....##..##...##.
  // .......##...######....#####..
  //
  //
  //
  if (enAvail >= 450 && !Memory.dSAttackerId) {
    let name = "hdS" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.source1;
    let parts = harvester450;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (roadRepairersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S49",
        roadRepairersE59S49,
        1
      );
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvestersE59S49.length < 5) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 5);
      direction = "deepSouth";
      chosenRole = "h";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "upControllersE59S49",
        upControllersE59S49,
        1
      );
      name = "upCdS" + t;
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      creepsE59S49.push(name);
      upControllersE59S49.push(name);

      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvesters.length < 4) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 4);
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 450");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // if (enAvail >= 650 && !invaderId) {
  //   let name = "resN" + t;
  //   let chosenRole = "reserver";
  //   let direction = "north";
  //   let sourceId = Memory.source2;
  //   let parts = simpleParts500;
  //   let group = "reservers";
  //   let spawnDirection = [TOP];

  //   if (reservers.length < 1) {
  //     reservers.push(name);
  //     parts = claimerParts;
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection,
  //       group
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningdS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  //  #######  #######    ###
  //  #        #         #   #
  //  #        #        #     #
  //  ######   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 550 && !Memory.dSAttackerId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts550;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (creepsE59S48.length < 10 && roadRepairers.length < 6) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 6);
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 15);
      parts = workerParts550;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      roadRepairers.push(name);
      creepsE59S48.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvestersE59S49.length < 8) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 10);
      name = "hdS" + t;
      group = "harvestersE59S49";
      direction = "deepSouth";
      chosenRole = "h";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );

      // } else if (harvestersE59S47.length < 1) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = deepSouthbirthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (harvestersE58S49.length < 4) {
      logConditionPassedForSpawnCreep("harvestersE58S49", harvestersE58S49, 4);
      name = "hSW" + t;
      group = "harvesterse58S49";
      direction = "e58s49";
      chosenRole = "h";
      creepsE59S48.push(name);
      harvestersE58S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvesters.length < 6) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 6);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "upControllersE59S49",
        upControllersE59S49,
        1
      );
      name = "upCdS" + t;
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      parts = upContrParts200;
      creepsE59S49.push(name);
      upControllersE59S49.push(name);

      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else {
      console.log("550 else condition");
      parts = workerParts550;
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 550");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #           #     ###  #     #
  //  #     #  #          # #     #   ##   ##
  //  #        #         #   #    #   # # # #
  //  #        #        #     #   #   #  #  #
  //  #        #        #######   #   #     #
  //  #     #  #        #     #   #   #     #
  //   #####   #######  #     #  ###  #     #
  let northController = Game.getObjectById("59bbc5d22052a716c3cea133");
  let deepSouthController = Game.getObjectById("59bbc5d22052a716c3cea13a");
  if (
    enAvail >= 650 &&
    !invaderId &&
    deepSouthController &&
    !deepSouthController.my
  ) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.source2;
    let parts = simpleParts500;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      logConditionPassedForSpawnCreep("claimers", claimers, 1);
      name = "c" + t;
      chosenRole = "c";
      direction = "deepSouth";
      parts = claimerParts650;
      creepsE59S49.push(name);
      claimers.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 650");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #           #     ###  #     #
  //  #     #  #          # #     #   ##   ##
  //  #        #         #   #    #   # # # #
  //  #        #        #     #   #   #  #  #
  //  #        #        #######   #   #     #
  //  #     #  #        #     #   #   #     #
  //   #####   #######  #     #  ###  #     #
  let e58s49Controller = Game.getObjectById("59bbc5c12052a716c3ce9faa");
  if (
    enAvail >= 650 &&
    !invaderId &&
    deepSouthController &&
    !deepSouthController.my
  ) {
    let name = "hSW" + t;
    let chosenRole = "h";
    let direction = "e58s49";
    let sourceId = Memory.source2;
    let parts = simpleParts500;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      logConditionPassedForSpawnCreep("claimers", claimers, 1);
      name = "cSW" + t;
      chosenRole = "c";
      direction = "e58s49";
      parts = claimerParts650;
      claimers.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 650");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //
  //
  //
  // ..#######....#####.....#####..
  // .##.....##..##...##...##...##.
  // .##.....##.##.....##.##.....##
  // ..#######..##.....##.##.....##
  // .##.....##.##.....##.##.....##
  // .##.....##..##...##...##...##.
  // ..#######....#####.....#####..
  //
  //
  //
  if (enAvail >= 800 && !Memory.dSAttackerId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts800;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 6) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 6);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvestersE59S49.length < 12) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 12);
      name = "hdS" + t;
      chosenRole = "h";
      directoin = "deepSouth";
      group = "harvestersE59S49";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllersE59S49.length < 2) {
      logConditionPassedForSpawnCreep(
        "upControllersE59S49",
        upControllersE59S49,
        2
      );
      name = "upCdS" + t;
      chosenRole = "upCdS";
      direction = "deepSouth";
      group = "upControllersE59S49";
      parts = upContrParts800;
      creepsE59S49.push(name);
      upControllersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 2) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 2);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairersE59S49.length < 12) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S49",
        roadRepairersE59S49,
        12
      );
      parts = workerParts800;
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 12) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 12);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (upControllers.length < 4) {
      logConditionPassedForSpawnCreep("upControllers", upControllers, 4);
      name = "upC" + t;
      chosenRole = "upC";
      direction = "south";
      group = "upControllers";
      parts = upContrParts800;
      creepsE59S48.push(name);
      upControllers.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairersE59S47.length < 5) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S47",
        roadRepairersE59S47,
        5
      );
      parts = workerParts800;
      name = "rRN" + t;
      chosenRole = "roadRepairer";
      direction = "north";
      group = "roadRepairersE59S47";
      creepsE59S47.push(name);
      roadRepairersE59S47.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else {
      console.log("800 else condition");
      // south road repairer, roadRepairers
      parts = workerParts800;
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "north";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    }

    if (retval !== -16) {
      console.log("spawningdS " + name + " " + retval);
      console.log("energy: 800");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // if (enAvail >= 1100) {
  //   let t = Game.time.toString().slice(4);
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source2;
  //   let parts = medsouthHvParts;
  //   let spawnDirection = [TOP];

  //   if (harvestersS.length < 3) {
  //     harvestersS.push(name);
  //     birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   }
  // }

  // if (enAvail >= 650) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source2;
  //   let parts = simpleParts;
  //   let spawnDirection = [TOP];

  //   if (claimersW.length < 1 && (!contrW || !contrW.my)) {
  //     parts = claimerParts;
  //     name = "claimW" + t;
  //     chosenRole = "claimW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNWW.length < 1 && (!contrNWW || !contrNWW.my)) {
  //     parts = claimerParts;
  //     name = "claimNWW" + t;
  //     chosenRole = "claimNWW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNW.length < 1 && (!contrNW || !contrNW.my)) {
  //     parts = claimerParts;
  //     name = "claimNW" + t;
  //     chosenRole = "claimNW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   } else if (claimersNWW.length < 2 && (!contrNWW || !contrNWW.my)) {
  //     parts = claimerParts;
  //     name = "claimNWW" + t;
  //     chosenRole = "claimNWW";
  //     claimersNW.push(name);
  //     retval = birthCreep(
  //       spawns,
  //       parts,
  //       name,
  //       chosenRole,
  //       direction,
  //       sourceId,
  //       spawnDirection
  //     );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningdS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  if (enAvail >= 3750 && !invaderId) {
    let name = "hXL" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = newhvParts2750;
    let spawnDirection = [TOP];
    let birth = false;
    let buildRoom = "E36N32";

    if (linkGets.length < 1 && Memory.harvester1) {
      chosenRole = "linkGet";
      name = "linkget" + t;
      parts = largeLinkGetsParts3000;
      linkGets.push(name);
      birth = true;
    } else if (claimersNW.length < 2 && (!contrNW || !contrNW.my)) {
      parts = bigclaimerParts3000;
      name = "claimNW" + t;
      chosenRole = "claimNW";
      claimersNW.push(name);
      birth = true;
    } else if (
      claimersNWW.length < 3 &&
      (!contrNWW || !contrNWW.my) &&
      (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
    ) {
      parts = bigclaimerParts3000;
      name = "claimNWW" + t;
      chosenRole = "claimNWW";
      claimersNW.push(name);
      birth = true;
    } else if (claimersW.length < 2 && (!contrW || !contrW.my)) {
      parts = bigclaimerParts3000;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersNW.push(name);
      birth = true;
    } else if (harvestersS.length < 2) {
      harvestersS.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (harvestersS.length < 3) {
      harvestersS.push(name);
      direction = "ntoS";
      parts = southHvParts3750;
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts3000;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 5) {
      name += "NWW";
      parts = travelhvParts3000;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 5) {
      name += "NW";
      parts = travelhvParts3000;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (harvestersNWW.length < 6) {
      name += "NWW";
      parts = travelhvParts3000;
      direction = "nww";
      harvestersNWW.push(name);
      birth = true;
    } else if (harvestersNW.length < 6) {
      name += "NW";
      parts = travelhvParts3000;
      direction = "nw";
      harvestersNW.push(name);
      birth = true;
    } else if (southtowerHarvesters.length < 3) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (workers.length < 3) {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts2900;
      workers.push(name);
      birth = true;
    } else if (harvestersS.length < 4) {
      harvestersS.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (
      claimersW.length < 1 &&
      (!Game.getObjectById("5bbcaeeb9099fc012e639c4d") ||
        !Game.getObjectById("5bbcaeeb9099fc012e639c4d").my)
    ) {
      parts = claimerParts650;
      name = "claimW" + t;
      chosenRole = "claimW";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersW.length < 1 &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d") &&
      Game.getObjectById("5bbcaeeb9099fc012e639c4d").my &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig3000;
      name = "upCW" + t;
      chosenRole = "upCW";
      birth = true;
      upControllersW.push(name);
    } else if (
      claimersN.length < 1 &&
      !Game.getObjectById("5bbcaefa9099fc012e639e8b").my
    ) {
      parts = claimerParts650;
      name = "claimN" + t;
      chosenRole = "claimN";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersN.length < 1 &&
      Game.getObjectById("5bbcaefa9099fc012e639e8b").my &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig3000;
      name = "upCN" + t;
      chosenRole = "upCN";
      birth = true;
      upControllersN.push(name);
    } else if (
      claimersNE.length < 1 &&
      !Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my
    ) {
      parts = claimerParts650;
      name = "claimNE" + t;
      chosenRole = "claimNE";
      claimersN.push(name);
      birth = true;
    } else if (
      upControllersNE.length < 1 &&
      Game.getObjectById("5bbcaf0c9099fc012e63a0b9").my &&
      (!neAttackerId || Game.time >= neAttackDurationSafeCheck)
    ) {
      parts = upContrPartsBig3000;
      name = "upCNE" + t;
      chosenRole = "upCNE";
      birth = true;
      upControllersNE.push(name);
    } else if (southtowerHarvesters.length < 2) {
      chosenRole = "southtowerHarvester";
      name = "sth" + t;
      harvesters.push(name);
      southtowerHarvesters.push(name);
      parts = southHvParts3750;
      birth = true;
    } else if (attackers.length < 2 && Memory.nAttackerId) {
      parts = bigAttackerParts3250;
      name = "att" + t;
      chosenRole = "attacker";
      direction = "north";
      attackers.push(name);
      birth = true;
    } else if (
      harvestersN.length < 2 &&
      (!nAttackerId || Game.time >= nAttackDurationSafeCheck)
    ) {
      name += "N";
      parts = travelhvParts3000;
      direction = "north";
      harvestersN.push(name);
      birth = true;
    } else if (
      harvestersW.length < 3 &&
      (!wAttackerId || Game.time >= wAttackDurationSafeCheck)
    ) {
      name += "W";
      parts = travelhvParts3000;
      direction = "west";
      harvestersW.push(name);
      birth = true;
    } else if (neworkers.length < 3) {
      neworkers.push(name);
      chosenRole = "neBuilder";
      buildRoom = "E36N32";
      name = chosenRole + t;
      parts = workerParts2900;
      birth = true;
    } else {
      chosenRole = "w";
      name = chosenRole + t;
      parts = workerParts2900;
      workers.push(name);
      birth = true;
    }

    if (birth) {
      retval = deepSouthbirthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection
      );
      if (retval !== -16) {
        console.log("spawningdS " + name + " " + retval);
      }
      if (retval === OK || retval === ERR_BUSY) {
        return retval;
      }
    } else {
      console.log("south wait for rezzy");
    }
  }

  Memory.roadBuilders = roadBuilders;
  Memory.reservers = reservers;
  Memory.harvesters = harvesters;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.harvestersE59S49 = harvestersE59S49;
  Memory.harvestersE58S49 = harvestersE58S49;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.upControllersE59S49 = upControllersE59S49;
  Memory.upControllersE58S49 = upControllersE58S49;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadRepairersE59S49 = roadRepairersE59S49;
  Memory.roadRepairersE58S49 = roadRepairersE58S49;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersE59S47 = rangedAttackersE59S47;
  Memory.rangedAttackersE59S49 = rangedAttackersE59S49;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersE58S49 = claimersE58S49;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.creepsE59S48 = creepsE59S48;
  Memory.creepsE59S47 = creepsE59S47;
  Memory.creepsE59S49 = creepsE59S49;
  Memory.creepsE58S49 = creepsE58S49;
}
deepSouthspawnCreepTypes = profiler.registerFN(
  deepSouthspawnCreepTypes,
  "deepSouthspawnCreepTypes"
);
module.exports = deepSouthspawnCreepTypes;
