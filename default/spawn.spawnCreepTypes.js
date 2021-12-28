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

function birthCreep(
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
          "spawn1ed." +
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
birthCreep = profiler.registerFN(birthCreep, "birthCreep");

function spawnCreepTypes(enAvail, spawns) {
  if (Game.spawns.Spawn1.spawning) {
    return;
  }

  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let harvestersE59S47 = Memory.harvestersE59S47 || [];
  let harvestersE59S49 = Memory.harvestersE59S49 || [];
  let upControllers = Memory.upControllers || [];
  let upControllersE59S47 = Memory.upControllersE59S47 || [];
  let upControllersE59S49 = Memory.upControllersE59S49 || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersE59S47 = Memory.roadRepairersE59S47 || [];
  let roadRepairersE59S49 = Memory.roadRepairersE59S49 || [];
  let roadBuilders = Memory.roadBuilders || [];
  let reservers = Memory.reservers || [];
  let towerHarvesters = Memory.towerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersE59S47 = Memory.claimersE59S47 || [];
  let claimersE59S49 = Memory.claimersE59S49 || [];
  let viewers = Memory.viewers || [];
  let viewersE59S47 = Memory.viewersE59S47 || [];
  let viewersE59S49 = Memory.viewersE59S49 || [];
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
  let creepsE59S48 = Memory.creepsE59S48 || [];
  let creepsE59S49 = Memory.creepsE59S49 || [];
  let creepsE59S47 = Memory.creepsE59S47 || [];

  let crps = Game.creeps;
  let numCrps = Object.keys(crps).length;

  let s1 = Game.spawns.deepSouthSpawn1;

  // 200
  let viewRoom50 = [];
  addPart(viewRoom50, 1, MOVE);

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

  // 400
  let harvesterParts400 = [];
  addPart(harvesterParts400, 1, CARRY);
  addPart(harvesterParts400, 2, WORK);
  addPart(harvesterParts400, 3, MOVE);

  // 450
  let harvesterParts450 = [];
  addPart(harvesterParts450, 1, CARRY);
  addPart(harvesterParts450, 2, WORK);
  addPart(harvesterParts450, 4, MOVE);

  // 500
  let workerParts500 = [];
  addPart(workerParts500, 1, CARRY);
  addPart(workerParts500, 2, WORK);
  addPart(workerParts500, 5, MOVE);

  // 500
  let attackerParts500 = [];
  addPart(attackerParts500, 5, MOVE);
  addPart(attackerParts500, 3, ATTACK);

  // 550
  let rangedAttackerParts550 = [];
  addPart(rangedAttackerParts550, 5, TOUGH);
  addPart(rangedAttackerParts550, 7, MOVE);
  addPart(rangedAttackerParts550, 1, RANGED_ATTACK);

  // 550
  let upContrParts550 = [];
  addPart(upContrParts550, 1, CARRY);
  addPart(upContrParts550, 3, WORK);
  addPart(upContrParts550, 4, MOVE);

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

  // 750
  let harvesterParts750 = [];
  addPart(harvesterParts750, 1, CARRY);
  addPart(harvesterParts750, 4, WORK);
  addPart(harvesterParts750, 6, MOVE);

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
  addPart(newhvParts2750, 3, CARRY);
  addPart(newhvParts2750, 15, WORK);
  addPart(newhvParts2750, 22, MOVE);

  // 2900
  let workerParts2900 = [];
  addPart(workerParts2900, 1, CARRY);
  addPart(workerParts2900, 20, WORK);
  addPart(workerParts2900, 17, MOVE);

  // 3000
  let upContrPartsBig3000 = [];
  addPart(upContrPartsBig3000, 1, CARRY);
  addPart(upContrPartsBig3000, 25, WORK);
  addPart(upContrPartsBig3000, 11, MOVE);

  // 3000
  let bigclaimerParts3000 = [];
  addPart(bigclaimerParts3000, 6, MOVE);
  addPart(bigclaimerParts3000, 4, CLAIM);

  // 3000
  let travelhvParts3000 = [];
  addPart(travelhvParts3000, 1, CARRY);
  addPart(travelhvParts3000, 25, WORK);
  addPart(travelhvParts3000, 24, MOVE);

  // 3000
  let repairerParts3000 = [];
  addPart(repairerParts3000, 1, CARRY);
  addPart(repairerParts3000, 25, WORK);
  addPart(repairerParts3000, 9, MOVE);

  // 3000
  let largeLinkGetsParts3000 = [];
  addPart(largeLinkGetsParts3000, 4, CARRY);
  addPart(largeLinkGetsParts3000, 25, WORK);
  addPart(largeLinkGetsParts3000, 6, MOVE);

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
  let basicCarry300 = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE];
  let basicHv200 = [CARRY, WORK, MOVE];
  let simpleParts300 = [CARRY, WORK, MOVE, MOVE, MOVE];
  let simpleParts350 = [CARRY, WORK, MOVE, MOVE, MOVE, MOVE];
  let simpleParts500 = [CARRY, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE];
  let simpleParts550 = [CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE];

  let eAttackerId = Memory.eAttackerId;
  let wAttackerId = Memory.wAttackerId;
  let nAttackerId = Memory.invaderIDE59S47;
  let neAttackerId = Memory.neAttackerId;
  let dSAttackerId = Memory.invaderIDE59S49;
  let invaderId = Memory.invaderIDE59S48;

  let retval = -16;

  let northController = Game.getObjectById("59bbc5d22052a716c3cea133");
  let deepSouthController = Game.getObjectById("59bbc5d22052a716c3cea13a");

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
  if (enAvail >= 800 && rangedAttackers.length < 1) {
    logConditionPassedForSpawnCreep("rangedAttackers", rangedAttackers, 1);
    let name = "aR" + t;
    let chosenRole = "rangedAttacker";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = rangedAttackerParts800;
    let spawnDirection = [TOP];
    let group = "rangedAttackers";

    creepsE59S48.push(name);
    rangedAttackers.push(name);
    retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
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
  if (enAvail >= 550 && attackersE59S49.length < 0) {
    logConditionPassedForSpawnCreep("attackersE59S49", attackersE59S49, 0);
    let name = "aRdS" + t;
    let chosenRole = "rangedAttacker";
    let direction = "deepSouth";
    let sourceId = Memory.dSSource2;
    let parts = rangedAttackerParts550;
    let group = "rangedAttackersE59S49";
    let spawnDirection = [TOP];

    creepsE59S49.push(name);
    rangedAttackersE59S49.push(name);
    retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 550");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // // .########...#####..
  // // .##........##...##.
  // // .##.......##.....##
  // // .#######..##.....##
  // // .......##.##.....##
  // // .##....##..##...##.
  // // ..######....#####..
  // if (enAvail >= 50) {
  //   let name = "vN" + t;
  //   let chosenRole = "viewer";
  //   let direction = "north";
  //   let sourceId = Memory.nsource2;
  //   let parts = viewRoom50;
  //   let group = "viewersE59S47";
  //   let spawnDirection = [TOP];

  //   if (viewersE59S47.length < 1) {
  //     viewersE59S47.push(name);
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
  //     console.log("spawningS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  // ..#######....#####.....#####..
  // .##.....##..##...##...##...##.
  // ........##.##.....##.##.....##
  // ..#######..##.....##.##.....##
  // ........##.##.....##.##.....##
  // .##.....##..##...##...##...##.
  // ..#######....#####.....#####..
  if (enAvail >= 300 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 4 && creepsE59S48.length < 10) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 4);
      name = "hdS" + t;
      direction = "south";
      group = "harvesters";
      creepsE59S48.push(name);
      harvesters.push(name);
      parts = simpleParts300;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (
      harvestersE59S49.length < 2 &&
      !dSAttackerId &&
      creepsE59S49.length < 10
    ) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 2);
      name = "hdS" + t;
      direction = "deepSouth";
      group = "harvestersE59S49";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      parts = simpleParts300;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (numOfCreepsTotal < 10) {
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 10);
      creepsE59S48.push(name);
      harvesters.push(name);
      parts = simpleParts300;
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
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
  if (enAvail >= 300 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (upControllers.length < 1) {
      logConditionPassedForSpawnCreep("upControllers", upControllers, 1);
      name = "upC" + t;
      chosenRole = "upC";
      group = "upControllers";
      parts = upContrParts200;
      upControllers.push(name);
      creepsE59S48.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (
      //   northController &&
      //   northController.my &&
      //   !nAttackerId &&
      //   upControllersE59S47.length < 1
      // ) {
      //   // when north controller is controlled change this to upControllersN
      //   name = "upCN" + t;
      //   chosenRole = "upCN";
      //   upControllersE59S47.push(name);
      //   direction = "north";
      //   parts = upContrParts200;
      //   group = "upControllersN";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (upControllersE59S49.length < 1 && !dSAttackerId) {
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
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
      name = "rR" + t;
      chosenRole = "roadRepairer";
      group = "roadRepairers";
      parts = simpleParts300;
      roadRepairers.push(name);
      creepsE59S48.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (creepsE59S48.length < 9) {
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 9);
      name = "h" + t;
      group = "harvesters";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      parts = simpleParts300;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvestersE59S49.length < 4 && !dSAttackerId) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 4);
      name = "hdS" + t;
      group = "harvesters";
      direction = "deepSouth";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      parts = simpleParts300;
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
      name = "rR" + t;
      chosenRole = "roadRepairer";
      group = "roadRepairers";
      parts = simpleParts300;
      roadRepairers.push(name);
      creepsE59S48.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
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
  if (enAvail >= 300 && !nAttackerId && northController && northController.my) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (upControllersE59S47.length < 1) {
      // when north controller is controlled change this to upControllersN
      logConditionPassedForSpawnCreep(
        "upControllersE59S47",
        upControllersE59S47,
        1
      );
      name = "upCN" + t;
      chosenRole = "upCN";
      direction = "north";
      parts = upContrParts200;
      group = "upControllersE59S47";
      creepsE59S47.push(name);
      upControllersE59S47.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 200");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //   #####   #######    ###
  //  #     #  #         #   #
  //        #  #        #     #
  //   #####   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 350 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source1;
    let parts = simpleParts350;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (creepsE59S48.length < 11) {
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 11);
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 350");
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
  // if (enAvail >= 350 && !invaderId) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.source1;
  //   let parts = simpleParts350;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (harvestersE59S49.length < 2 && !dSAttackerId) {
  //     name = "hdS" + t;
  //     direction = "deepSouth";
  //     group = "harvestersE59S49";
  //     harvestersE59S49.push(name);
  //     creepsE59S49.push(name);
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
  //   } else if (creepsE59S48.length < 10) {
  //     harvesters.push(name);
  //     creepsE59S48.push(name);
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
  //     console.log("spawningS " + name + " " + retval);
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
  if (enAvail >= 450 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = harvesterParts450;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 6) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 6);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (!nAttackerId && harvestersE59S47.length < 2) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairersE59S49.length < 1 && !dSAttackerId) {
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
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (creepsE59S48.length < 12) {
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 12);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (!nAttackerId && harvestersE59S47.length < 1) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
      // } else {
      //   parts = workerParts550;
      //   name = "rR" + t;
      //   roadRepairers.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "south";
      //   group = "roadRepairers";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 450");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //  #######  #######    ###
  //  #        #         #   #
  //  #        #        #     #
  //  ######   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 550 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "south";
    let sourceId = Memory.source2;
    let parts = harvesterParts550;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 8 && creepsE59S48.length < 13) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
      logConditionPassedForSpawnCreep("creepsE59S48", creepsE59S48, 13);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
      parts = workerParts550;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (
      roadRepairersE59S47.length < 8 &&
      northController.my &&
      !nAttackerId
    ) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S47",
        roadRepairersE59S47,
        8
      );
      parts = workerParts550;
      name = "rRN" + t;
      chosenRole = "roadRepairer";
      direction = "north";
      group = "roadRepairersE59S47";
      creepsE59S47.push(name);
      roadRepairersE59S47.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (harvesters.length < 8) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
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
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
      // } else {
      //   parts = workerParts550;
      //   name = "rR" + t;
      //   roadRepairers.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "south";
      //   group = "roadRepairers";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    }

    if (retval !== -16) {
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 550");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //  #######  #######    ###
  //  #        #         #   #
  //  #        #        #     #
  //  ######   ######   #     #
  //        #        #  #     #
  //  #     #  #     #   #   #
  //   #####    #####     ###
  if (enAvail >= 550 && !nAttackerId && northController && northController.my) {
    let name = "upCN" + t;
    let chosenRole = "upCN";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = upContrParts550;
    let group = "upControllersN";
    let spawnDirection = [TOP];

    if (upControllersE59S47.length < 2 && creepsE59S48.length < 13) {
      // when north controller is controlled change this to upControllersN
      logConditionPassedForSpawnCreep(
        "upControllersE59S47",
        upControllersE59S47,
        2
      );
      name = "upCN" + t;
      chosenRole = "upCN";
      direction = "north";
      group = "upControllersN";
      upControllersE59S47.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 550");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //
  //
  //
  // .########..########..######.
  // .##.....##.##.......##....##
  // .##.....##.##.......##......
  // .########..######....######.
  // .##...##...##.............##
  // .##....##..##.......##....##
  // .##.....##.########..######.
  //
  //
  //
  // if (enAvail >= 650 && !invaderId) {
  //   let name = "resN" + t;
  //   let chosenRole = "reserver";
  //   let direction = "north";
  //   let sourceId = Memory.source2;
  //   let parts = claimerParts;
  //   let group = "reservers";
  //   let spawnDirection = [TOP];

  //   if (reservers.length < 1) {
  //     reservers.push(name);
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
  //     console.log("spawningS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  //   #####   #           #     ###  #     #
  //  #     #  #          # #     #   ##   ##
  //  #        #         #   #    #   # # # #
  //  #        #        #     #   #   #  #  #
  //  #        #        #######   #   #     #
  //  #     #  #        #     #   #   #     #
  //   #####   #######  #     #  ###  #     #
  if (
    enAvail >= 650 &&
    !invaderId &&
    !nAttackerId &&
    (!northController ||
      (northController &&
        !northController.my &&
        (!northController.safeMode || northController.safeMode <= 0)))
  ) {
    let name = "hN" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.nSource2;
    let parts = claimerParts650;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      logConditionPassedForSpawnCreep("claimers", claimers, 1);
      name = "cN" + t;
      chosenRole = "claimerN";
      claimers.push(name);
      direction = "north";
      parts = claimerParts650;
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
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
  if (
    enAvail >= 650 &&
    !invaderId &&
    !dSAttackerId &&
    deepSouthController &&
    !deepSouthController.my
  ) {
    let name = "hdS" + t;
    let chosenRole = "h";
    let direction = "deepSouth";
    let sourceId = Memory.nSource2;
    let parts = claimerParts650;
    let group = "claimers";
    let spawnDirection = [TOP];

    if (claimers.length < 1) {
      logConditionPassedForSpawnCreep("claimers", claimers, 1);
      name = "cdS" + t;
      chosenRole = "claim";
      parts = claimerParts650;
      creepsE59S49.push(name);
      claimers.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 650");
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  //
  //
  //
  // .########.########...#####..
  // .##....##.##........##...##.
  // .....##...##.......##.....##
  // ....##....#######..##.....##
  // ...##...........##.##.....##
  // ...##.....##....##..##...##.
  // ...##......######....#####..
  //
  //
  //
  if (enAvail >= 750 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts750;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 8) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (harvestersE59S47.length < 16) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (harvestersE59S49.length < 1) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 1);
      name = "hdS" + t;
      chosenRole = "h";
      direction = "deepSouth";
      group = "harvestersE59S49";
      creepsE59S48.push(name);
      harvestersE59S49.push(name);
      retval = birthCreep(
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
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 2);
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (roadRepairersE59S47.length < 1) {
      //   parts = workerParts800;
      //   name = "rRN" + t;
      //   roadRepairersE59S47.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "north";
      //   group = "roadRepairersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (roadRepairersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S49",
        roadRepairersE59S49,
        1
      );
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S48.push(name);
      roadRepairersE59S49.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
      console.log("energy: 750");
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
  if (enAvail >= 800 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = harvesterParts800;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 12) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 12);
      name = "h" + t;
      chosenRole = "h";
      direction = "south";
      creepsE59S48.push(name);
      harvesters.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (harvestersE59S47.length < 16) {
      //   name = "hN" + t;
      //   harvestersE59S47.push(name);
      //   chosenRole = "h";
      //   direction = "north";
      //   group = "harvestersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (harvestersE59S49.length < 4) {
      logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 4);
      name = "hdS" + t;
      chosenRole = "h";
      direction = "deepSouth";
      group = "harvestersE59S49";
      creepsE59S49.push(name);
      harvestersE59S49.push(name);
      retval = birthCreep(
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
      parts = upContrParts800;
      creepsE59S49.push(name);
      upControllersE59S49.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 20) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 20);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (roadRepairersE59S47.length < 1) {
      //   parts = workerParts800;
      //   name = "rRN" + t;
      //   roadRepairersE59S47.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "north";
      //   group = "roadRepairersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else if (roadRepairersE59S49.length < 1) {
      logConditionPassedForSpawnCreep(
        "roadRepairersE59S49",
        roadRepairersE59S49,
        1
      );
      parts = workerParts800;
      name = "rRdS" + t;
      chosenRole = "roadRepairer";
      direction = "deepSouth";
      group = "roadRepairersE59S49";
      creepsE59S49.push(name);
      roadRepairersE59S49.push(name);
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
    } else if (roadRepairers.length < 21) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 21);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
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
      retval = birthCreep(
        spawns,
        parts,
        name,
        chosenRole,
        direction,
        sourceId,
        spawnDirection,
        group
      );
      // } else if (roadRepairersE59S47.length < 1) {
      //   parts = workerParts800;
      //   name = "rRN" + t;
      //   roadRepairersE59S47.push(name);
      //   chosenRole = "roadRepairer";
      //   direction = "north";
      //   group = "roadRepairersE59S47";
      //   retval = birthCreep(
      //     spawns,
      //     parts,
      //     name,
      //     chosenRole,
      //     direction,
      //     sourceId,
      //     spawnDirection,
      //     group
      //   );
    } else {
      // south road repairer, roadRepairers
      console.log("800 else condition");
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "south";
      group = "roadRepairers";
      creepsE59S48.push(name);
      roadRepairers.push(name);
      retval = birthCreep(
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
      console.log("spawningS " + name + " " + retval);
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
  //   let spawnDirection = [BOTTOM];

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
  //   let spawnDirection = [BOTTOM];

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
  //     console.log("spawningS " + name + " " + retval);
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

  Memory.viewers = viewers;
  Memory.viewersE59S47 = viewersE59S47;
  Memory.viewersE59S49 = viewersE59S49;
  Memory.roadBuilders = roadBuilders;
  Memory.reservers = reservers;
  Memory.harvesters = harvesters;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.harvestersE59S49 = harvestersE59S49;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.upControllersE59S49 = upControllersE59S49;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadRepairersE59S49 = roadRepairersE59S49;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersE59S47 = rangedAttackersE59S47;
  Memory.rangedAttackersE59S49 = rangedAttackersE59S49;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersE59S47 = claimersE59S47;
  Memory.claimersE59S49 = claimersE59S49;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.creepsE59S48 = creepsE59S48;
  Memory.creepsE59S49 = creepsE59S49;
  Memory.creepsE59S47 = creepsE59S47;
}
spawnCreepTypes = profiler.registerFN(spawnCreepTypes, "spawnCreepTypes");

module.exports = spawnCreepTypes;
