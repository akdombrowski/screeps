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
  if (spawns.length <= 1 && spawns[0].spawning) {
    return;
  }

  let linkGets = Memory.linkGets || [];
  let workers = Memory.workers || [];
  let harvesters = Memory.harvesters || [];
  let harvestersSouth = Memory.harvestersSouth || [];
  let harvestersNorth = Memory.harvestersNorth || [];
  let harvestersSouthwest = Memory.harvestersSouthwest || [];
  let harvestersWest = Memory.harvestersWest || [];
  let upControllers = Memory.upControllers || [];
  let upControllersSouth = Memory.upControllersSouth || [];
  let upControllersSouthwest = Memory.upControllersSouthwest || [];
  let roadRepairers = Memory.roadRepairers || [];
  let roadRepairersSouth = Memory.roadRepairersSouth || [];
  let roadRepairersWest = Memory.roadRepairersWest || [];
  let roadRepairersSouthwest = Memory.roadRepairersSouthwest || [];
  let roadBuilders = Memory.roadBuilders || [];
  let reservers = Memory.reservers || [];
  let towerHarvesters = Memory.towerHarvesters || [];
  let claimers = Memory.claimers || [];
  let claimersSouth = Memory.claimersSouth || [];
  let claimersWest = Memory.claimersWest || [];
  let claimersNorth = Memory.claimersNorth || [];
  let claimersSouthwest = Memory.claimersSouthwest || [];
  let viewers = Memory.viewers || [];
  let viewersWest = Memory.viewersWest || [];
  let viewersSouth = Memory.viewersSouth || [];
  let rangedAttackers = Memory.rangedAttackers || [];
  let rangedAttackersSouth = Memory.rangedAttackersSouth || [];
  let rangedAttackersNorth = Memory.rangedAttackersNorth || [];
  let rangedAttackersWest = Memory.rangedAttackersWest || [];
  let rangedAttackersEast = Memory.rangedAttackersEast || [];
  let rangedAttackersSouthwest = Memory.rangedAttackersSouthwest || [];
  let rangedAttackersE59S49 = Memory.rangedAttackersE59S49 || [];
  let attackers = Memory.attackers || [];
  let attackersE59S49 = Memory.attackersE59S49 || [];
  let creepsHome = Memory.creepsHome || [];
  let creepsSouth = Memory.creepsSouth || [];
  let creepsNorth = Memory.creepsNorth || [];
  let creepsSouthwest = Memory.creepsSouthwest || [];
  let creepsWest = Memory.creepsWest || [];

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

  // 300
  let slowMoverParts300 = [];
  addPart(slowMoverParts300, 1, CARRY);
  addPart(slowMoverParts300, 2, WORK);
  addPart(slowMoverParts300, 1, MOVE);

  // 300
  let viewRoom300 = [];
  addPart(viewRoom300, 1, MOVE);
  addPart(viewRoom300, 1, HEAL);

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
  let slowMoverParts550 = [];
  addPart(slowMoverParts550, 1, CARRY);
  addPart(slowMoverParts550, 4, WORK);
  addPart(slowMoverParts550, 2, MOVE);

  // 550
  let fastMoverParts550 = [];
  addPart(fastMoverParts550, 1, CARRY);
  addPart(fastMoverParts550, 2, WORK);
  addPart(fastMoverParts550, 6, MOVE);

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
  let wAttackerId = Memory.invaderIDWest;
  let nAttackerId = Memory.invaderIDNorth;
  let neAttackerId = Memory.neAttackerId;
  let dSAttackerId = Memory.invaderIDE59S49;
  let sAttackerId = Memory.invaderIDSouth;
  let invaderId = Memory.invaderIDHome;

  let retval = -16;

  let northController = Game.getObjectById(Memory.northControllerID);
  let northEastController = Game.getObjectById(Memory.northEastControllerID);
  let southController = Game.getObjectById(Memory.southControllerID);
  let westController = Game.getObjectById(Memory.westControllerID);

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
    let direction = "home";
    let sourceId = Memory.source2;
    let parts = rangedAttackerParts800;
    let spawnDirection = [TOP];
    let group = "rangedAttackers";

    creepsHome.push(name);
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
  if (enAvail >= 800 && rangedAttackersEast.length < 0) {
    logConditionPassedForSpawnCreep(
      "rangedAttackersEast",
      rangedAttackersEast,
      0
    );
    let name = "aRE" + t;
    let chosenRole = "rangedAttacker";
    let direction = "east";
    let sourceId = Memory.dSSource2;
    let parts = rangedAttackerParts800;
    let group = "rangedAttackersEast";
    let spawnDirection = [TOP];

    creepsEast.push(name);
    rangedAttackersEast.push(name);
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

  // ..#######....#####.....#####..
  // .##.....##..##...##...##...##.
  // ........##.##.....##.##.....##
  // ..#######..##.....##.##.....##
  // ........##.##.....##.##.....##
  // .##.....##..##...##...##...##.
  // ..#######....#####.....#####..
  if (enAvail >= 300 && wAttackerId) {
    let name = "vW" + t;
    let chosenRole = "viewer";
    let direction = "west";
    let sourceId = Memory.nsource2;
    let parts = viewRoom300;
    let group = "viewersWest";
    let spawnDirection = [LEFT];

    if (viewersWest.length < 1) {
      logConditionPassedForSpawnCreep("viewersWest", viewersWest, 1);
      viewersWest.push(name);
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
      console.log("energy: 300  parts: " + parts);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // ..#######....#####.....#####..
  // .##.....##..##...##...##...##.
  // ........##.##.....##.##.....##
  // ..#######..##.....##.##.....##
  // ........##.##.....##.##.....##
  // .##.....##..##...##...##...##.
  // ..#######....#####.....#####..
  if (enAvail >= 300 && !invaderId && numOfCreepsTotal < 10) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "home";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvesters.length < 8) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 10);
      name = "h" + t;
      direction = "home";
      group = "harvesters";
      creepsHome.push(name);
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
      console.log("energy: 300  parts: " + parts);
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
  if (enAvail >= 300 && !invaderId && numOfCreepsTotal < 15) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "home";
    let sourceId = Memory.source2;
    let parts = simpleParts300;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (upControllers.length < 1) {
      logConditionPassedForSpawnCreep("upControllers", upControllers, 1);
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 15);
      name = "upC" + t;
      chosenRole = "upC";
      group = "upControllers";
      parts = slowMoverParts300;
      upControllers.push(name);
      creepsHome.push(name);
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
    } else if (roadRepairers.length < 1) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 15);
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      parts = slowMoverParts300;
      creepsHome.push(name);
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
    } else if (harvesters.length < 8) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 15);
      name = "h" + t;
      direction = "home";
      group = "harvesters";
      creepsHome.push(name);
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
    } else if (harvestersWest.length < 8 && !wAttackerId) {
      logConditionPassedForSpawnCreep("harvestersWest", harvestersWest, 8);
      logConditionPassedForSpawnCreep("numOfCreepsTotal", numOfCreepsTotal, 15);
      name = "hW" + t;
      direction = "west";
      group = "harvestersWest";
      creepsWest.push(name);
      harvestersWest.push(name);
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
      console.log("energy: 300  parts: " + parts);
    }
    if (retval === OK || retval === ERR_BUSY) {
      return retval;
    }
  }

  // //   #####     ###      ###
  // //  #     #   #   #    #   #
  // //        #  #     #  #     #
  // //   #####   #     #  #     #
  // //        #  #     #  #     #
  // //  #     #   #   #    #   #
  // //   #####     ###      ###
  // if (enAvail >= 300 && !nAttackerId && northController && northController.my) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "home";
  //   let sourceId = Memory.source2;
  //   let parts = simpleParts300;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (upControllersE59S47.length < 1) {
  //     // when north controller is controlled change this to upControllersN
  //     logConditionPassedForSpawnCreep(
  //       "upControllersE59S47",
  //       upControllersE59S47,
  //       1
  //     );
  //     name = "upCN" + t;
  //     chosenRole = "upCN";
  //     direction = "north";
  //     parts = upContrParts200;
  //     group = "upControllersE59S47";
  //     creepsE59S47.push(name);
  //     upControllersE59S47.push(name);
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
  //     console.log("energy: 200");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

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
  //   let direction = "home";
  //   let sourceId = Memory.source1;
  //   let parts = simpleParts350;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (creepshome.length < 8) {
  //     logConditionPassedForSpawnCreep("creepshome", creepshome, 8);
  //     creepshome.push(name);
  //     harvesters.push(name);
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
  //     console.log("energy: 350");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

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
  //   let direction = "home";
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
  //   } else if (creepshome.length < 10) {
  //     harvesters.push(name);
  //     creepshome.push(name);
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

  // //
  // //
  // //
  // // .##........########...#####..
  // // .##....##..##........##...##.
  // // .##....##..##.......##.....##
  // // .##....##..#######..##.....##
  // // .#########.......##.##.....##
  // // .......##..##....##..##...##.
  // // .......##...######....#####..
  // //
  // //
  // //
  // if (enAvail >= 450 && !invaderId) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "home";
  //   let sourceId = Memory.source2;
  //   let parts = harvesterParts450;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (harvesters.length < 5) {
  //     logConditionPassedForSpawnCreep("harvesters", harvesters, 5);
  //     name = "h" + t;
  //     chosenRole = "h";
  //     direction = "home";
  //     creepshome.push(name);
  //     harvesters.push(name);
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
  //     // } else if (!nAttackerId && harvestersE59S47.length < 2) {
  //     //   name = "hN" + t;
  //     //   harvestersE59S47.push(name);
  //     //   chosenRole = "h";
  //     //   direction = "north";
  //     //   group = "harvestersE59S47";
  //     //   retval = birthCreep(
  //     //     spawns,
  //     //     parts,
  //     //     name,
  //     //     chosenRole,
  //     //     direction,
  //     //     sourceId,
  //     //     spawnDirection,
  //     //     group
  //     //   );
  //   } else if (roadRepairers.length < 1) {
  //     logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 1);
  //     name = "rR" + t;
  //     chosenRole = "roadRepairer";
  //     direction = "home";
  //     group = "roadRepairers";
  //     creepshome.push(name);
  //     roadRepairers.push(name);
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
  //   } else if (roadRepairersE59S49.length < 1 && !dSAttackerId) {
  //     logConditionPassedForSpawnCreep(
  //       "roadRepairersE59S49",
  //       roadRepairersE59S49,
  //       1
  //     );
  //     name = "rRdS" + t;
  //     chosenRole = "roadRepairer";
  //     direction = "deepSouth";
  //     group = "roadRepairersE59S49";
  //     creepsE59S49.push(name);
  //     roadRepairersE59S49.push(name);
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
  //   } else if (creepshome.length < 8) {
  //     logConditionPassedForSpawnCreep("creepshome", creepshome, 8);
  //     name = "h" + t;
  //     chosenRole = "h";
  //     direction = "home";
  //     creepshome.push(name);
  //     harvesters.push(name);
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
  //     // } else if (!nAttackerId && harvestersE59S47.length < 1) {
  //     //   name = "hN" + t;
  //     //   harvestersE59S47.push(name);
  //     //   chosenRole = "h";
  //     //   direction = "north";
  //     //   group = "harvestersE59S47";
  //     //   retval = birthCreep(
  //     //     spawns,
  //     //     parts,
  //     //     name,
  //     //     chosenRole,
  //     //     direction,
  //     //     sourceId,
  //     //     spawnDirection,
  //     //     group
  //     //   );
  //     // } else {
  //     //   parts = workerParts550;
  //     //   name = "rR" + t;
  //     //   roadRepairers.push(name);
  //     //   chosenRole = "roadRepairer";
  //     //   direction = "home";
  //     //   group = "roadRepairers";
  //     //   retval = birthCreep(
  //     //     spawns,
  //     //     parts,
  //     //     name,
  //     //     chosenRole,
  //     //     direction,
  //     //     sourceId,
  //     //     spawnDirection,
  //     //     group
  //     //   );
  //   }

  //   if (retval !== -16) {
  //     console.log("spawningS " + name + " " + retval);
  //     console.log("energy: 450");
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
  if (enAvail >= 550 && !invaderId) {
    let name = "h" + t;
    let chosenRole = "h";
    let direction = "home";
    let sourceId = Memory.source2;
    let parts = fastMoverParts550;
    let group = "harvesters";
    let spawnDirection = [TOP];

    if (harvestersWest.length < 1 && !wAttackerId) {
      logConditionPassedForSpawnCreep("harvestersWest", harvestersWest, 1);
      name = "hW" + t;
      chosenRole = "h";
      direction = "west";
      parts = fastMoverParts550;
      creepsWest.push(name);
      harvestersWest.push(name);
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
    } else if (harvesters.length < 1) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 1);
      name = "h" + t;
      chosenRole = "h";
      direction = "home";
      parts = fastMoverParts550;
      creepsHome.push(name);
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
    } else if (harvestersSouth.length < 2 && !sAttackerId && numOfCreepsTotal < 25) {
      logConditionPassedForSpawnCreep("harvestersSouth", harvestersSouth, 2);
      name = "hS" + t;
      chosenRole = "h";
      direction = "south";
      parts = fastMoverParts550;
      creepsSouth.push(name);
      harvestersSouth.push(name);
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
    } else if (harvestersNorth.length < 2 && !nAttackerId && numOfCreepsTotal < 25) {
      logConditionPassedForSpawnCreep("harvestersNorth", harvestersNorth, 2);
      name = "hN" + t;
      chosenRole = "h";
      direction = "north";
      parts = fastMoverParts550;
      creepsNorth.push(name);
      harvestersNorth.push(name);
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
      parts = slowMoverParts550;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      creepsHome.push(name);
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
    } else if (upControllers.length < 1) {
      logConditionPassedForSpawnCreep("upControllers", upControllers, 2);
      name = "upC" + t;
      chosenRole = "upC";
      direction = "home";
      group = "upControllers";
      parts = slowMoverParts550;
      upControllers.push(name);
      creepsHome.push(name);
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
    } else if (roadRepairersWest.length < 4 && !wAttackerId && numOfCreepsTotal < 25) {
      logConditionPassedForSpawnCreep(
        "roadRepairersWest",
        roadRepairersWest,
        4
      );
      parts = slowMoverParts550;
      name = "rRW" + t;
      chosenRole = "roadRepairer";
      direction = "west";
      group = "roadRepairersWest";
      creepsWest.push(name);
      roadRepairersWest.push(name);
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
    } else if (upControllers.length < 4 && numOfCreepsTotal < 25) {
      logConditionPassedForSpawnCreep("upControllers", upControllers, 4);
      name = "upC" + t;
      chosenRole = "upC";
      direction = "home";
      group = "upControllers";
      parts = slowMoverParts550;
      upControllers.push(name);
      creepsHome.push(name);
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
      // } else if (!wAttackerId) {
      //   console.log("550 no wAttacker");
      //   logConditionPassedForSpawnCreep("harvestersWest", harvestersWest, -1);
      //   name = "hW" + t;
      //   chosenRole = "h";
      //   direction = "west";
      //   parts = fastMoverParts550;
      //   creepsWest.push(name);
      //   harvestersWest.push(name);
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
      //   console.log("550 else");
      //   name = "h" + t;
      //   chosenRole = "h";
      //   direction = "home";
      //   parts = fastMoverParts550;
      //   creepsHome.push(name);
      //   harvesters.push(name);
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

  // //  #######  #######    ###
  // //  #        #         #   #
  // //  #        #        #     #
  // //  ######   ######   #     #
  // //        #        #  #     #
  // //  #     #  #     #   #   #
  // //   #####    #####     ###
  // if (enAvail >= 550 && !nAttackerId && northController && northController.my) {
  //   let name = "upCN" + t;
  //   let chosenRole = "upCN";
  //   let direction = "north";
  //   let sourceId = Memory.source2;
  //   let parts = upContrParts550;
  //   let group = "upControllersN";
  //   let spawnDirection = [TOP];

  //   if (upControllersE59S47.length < 1 && creepshome.length < 13) {
  //     // when north controller is controlled change this to upControllersN
  //     logConditionPassedForSpawnCreep(
  //       "upControllersE59S47",
  //       upControllersE59S47,
  //       2
  //     );
  //     name = "upCN" + t;
  //     chosenRole = "upCN";
  //     direction = "north";
  //     group = "upControllersN";
  //     upControllersE59S47.push(name);
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
  //     console.log("energy: 550");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

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

  // //

  // //   #####   #           #     ###  #     #
  // //  #     #  #          # #     #   ##   ##
  // //  #        #         #   #    #   # # # #
  // //  #        #        #     #   #   #  #  #
  // //  #        #        #######   #   #     #
  // //  #     #  #        #     #   #   #     #
  // //   #####   #######  #     #  ###  #     #
  // if (
  //   enAvail >= 650 &&
  //   !invaderId &&
  //   !sAttackerId &&
  //   southController &&
  //   !southController.my
  // ) {
  //   let name = "hS" + t;
  //   let chosenRole = "h";
  //   let direction = "south";
  //   let sourceId = Memory.nSource2;
  //   let parts = claimerParts650;
  //   let group = "claimers";
  //   let spawnDirection = [BOTTOM];

  //   if (claimersSouth.length < 1) {
  //     logConditionPassedForSpawnCreep("claimersSouth", claimersSouth, 1);
  //     name = "cS" + t;
  //     chosenRole = "claimS";
  //     parts = claimerParts650;
  //     creepsSouth.push(name);
  //     claimersSouth.push(name);
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
  //     console.log("energy: 650");
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
    !wAttackerId &&
    westController &&
    !westController.my
  ) {
    let name = "hW" + t;
    let chosenRole = "h";
    let direction = "west";
    let sourceId = Memory.nSource2;
    let parts = claimerParts650;
    let group = "claimersW";
    let spawnDirection = [LEFT];

    if (claimersWest.length < 1) {
      logConditionPassedForSpawnCreep("claimersWest", claimersWest, 1);
      name = "cW" + t;
      chosenRole = "claimerW";
      parts = claimerParts650;
      creepsWest.push(name);
      claimersWest.push(name);
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

  // //
  // //
  // //
  // // .########.########...#####..
  // // .##....##.##........##...##.
  // // .....##...##.......##.....##
  // // ....##....#######..##.....##
  // // ...##...........##.##.....##
  // // ...##.....##....##..##...##.
  // // ...##......######....#####..
  // //
  // //
  // //
  // if (enAvail >= 750 && !invaderId) {
  //   let name = "h" + t;
  //   let chosenRole = "h";
  //   let direction = "north";
  //   let sourceId = Memory.source2;
  //   let parts = harvesterParts750;
  //   let group = "harvesters";
  //   let spawnDirection = [TOP];

  //   if (harvesters.length < 8) {
  //     logConditionPassedForSpawnCreep("harvesters", harvesters, 8);
  //     name = "h" + t;
  //     chosenRole = "h";
  //     direction = "home";
  //     creepshome.push(name);
  //     harvesters.push(name);
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
  //     // } else if (harvestersE59S47.length < 16) {
  //     //   name = "hN" + t;
  //     //   harvestersE59S47.push(name);
  //     //   chosenRole = "h";
  //     //   direction = "north";
  //     //   group = "harvestersE59S47";
  //     //   retval = birthCreep(
  //     //     spawns,
  //     //     parts,
  //     //     name,
  //     //     chosenRole,
  //     //     direction,
  //     //     sourceId,
  //     //     spawnDirection,
  //     //     group
  //     //   );
  //   } else if (harvestersE59S49.length < 1) {
  //     logConditionPassedForSpawnCreep("harvestersE59S49", harvestersE59S49, 1);
  //     name = "hdS" + t;
  //     chosenRole = "h";
  //     direction = "deepSouth";
  //     group = "harvestersE59S49";
  //     creepshome.push(name);
  //     harvestersE59S49.push(name);
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
  //   } else if (upControllersE59S49.length < 1) {
  //     logConditionPassedForSpawnCreep(
  //       "upControllersE59S49",
  //       upControllersE59S49,
  //       1
  //     );
  //     name = "upCdS" + t;
  //     chosenRole = "upCdS";
  //     direction = "deepSouth";
  //     group = "upControllersE59S49";
  //     creepsE59S49.push(name);
  //     upControllersE59S49.push(name);
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
  //   } else if (roadRepairers.length < 1) {
  //     logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 2);
  //     name = "rR" + t;
  //     chosenRole = "roadRepairer";
  //     direction = "home";
  //     group = "roadRepairers";
  //     creepshome.push(name);
  //     roadRepairers.push(name);
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
  //     // } else if (roadRepairersE59S47.length < 1) {
  //     //   parts = workerParts800;
  //     //   name = "rRN" + t;
  //     //   roadRepairersE59S47.push(name);
  //     //   chosenRole = "roadRepairer";
  //     //   direction = "north";
  //     //   group = "roadRepairersE59S47";
  //     //   retval = birthCreep(
  //     //     spawns,
  //     //     parts,
  //     //     name,
  //     //     chosenRole,
  //     //     direction,
  //     //     sourceId,
  //     //     spawnDirection,
  //     //     group
  //     //   );
  //   } else if (roadRepairersE59S49.length < 1) {
  //     logConditionPassedForSpawnCreep(
  //       "roadRepairersE59S49",
  //       roadRepairersE59S49,
  //       1
  //     );
  //     name = "rRdS" + t;
  //     chosenRole = "roadRepairer";
  //     direction = "deepSouth";
  //     group = "roadRepairersE59S49";
  //     creepshome.push(name);
  //     roadRepairersE59S49.push(name);
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
  //     console.log("energy: 750");
  //   }
  //   if (retval === OK || retval === ERR_BUSY) {
  //     return retval;
  //   }
  // }

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
  if (enAvail >= 800 && !wAttackerId && westController && westController.my) {
    let name = "upCN" + t;
    let chosenRole = "upCN";
    let direction = "north";
    let sourceId = Memory.source2;
    let parts = upContrParts800;
    let group = "upControllersN";
    let spawnDirection = [TOP];

    if (upControllersWest.length < 2) {
      // when north controller is controlled change this to upControllersN
      logConditionPassedForSpawnCreep(
        "upControllersWest",
        upControllersWest,
        2
      );
      name = "upCW" + t;
      chosenRole = "upCW";
      direction = "west";
      group = "upControllersW";
      creepsWest.push(name);
      upControllersWest.push(name);
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

    if (harvesters.length < 4) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 4);
      name = "h" + t;
      chosenRole = "h";
      direction = "home";
      creepsHome.push(name);
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
    } else if (roadRepairers.length < 4) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 4);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      creepsHome.push(name);
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
    } else if (roadRepairersWest.length < 4) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 4);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      creepsHome.push(name);
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
    } else if (harvesters.length < 5) {
      logConditionPassedForSpawnCreep("harvesters", harvesters, 5);
      name = "h" + t;
      chosenRole = "h";
      direction = "home";
      creepsHome.push(name);
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
    } else if (roadRepairers.length < 5) {
      logConditionPassedForSpawnCreep("roadRepairers", roadRepairers, 5);
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      creepsHome.push(name);
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
      direction = "home";
      group = "upControllers";
      parts = upContrParts800;
      creepsHome.push(name);
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
    } else {
      // home road repairer, roadRepairers
      console.log("800 else condition");
      parts = workerParts800;
      name = "rR" + t;
      chosenRole = "roadRepairer";
      direction = "home";
      group = "roadRepairers";
      creepsHome.push(name);
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
  //   let direction = "home";
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
  //   let direction = "home";
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
  Memory.viewersWest = viewersWest;
  Memory.viewersSouth = viewersSouth;
  Memory.roadBuilders = roadBuilders;
  Memory.reservers = reservers;
  Memory.harvesters = harvesters;
  Memory.harvestersSouth = harvestersSouth;
  Memory.harvestersNorth = harvestersNorth;
  Memory.harvestersSouthwest = harvestersSouthwest;
  Memory.harvestersWest = harvestersWest;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersSouth = upControllersSouth;
  Memory.upControllersSouthwest = upControllersSouthwest;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersSouth = roadRepairersSouth;
  Memory.roadRepairersWest = roadRepairersWest;
  Memory.roadRepairersSouthwest = roadRepairersSouthwest;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersSouth = rangedAttackersSouth;
  Memory.rangedAttackersNorth = rangedAttackersNorth;
  Memory.rangedAttackersWest = rangedAttackersWest;
  Memory.rangedAttackersEast = rangedAttackersEast;
  Memory.rangedAttackersSouthwest = rangedAttackersSouthwest;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.claimersSouth = claimersSouth;
  Memory.claimersWest = claimersWest;
  Memory.claimersNorth = claimersNorth;
  Memory.claimersSouthwest = claimersSouthwest;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.creepsHome = creepsHome;
  Memory.creepsSouth = creepsSouth;
  Memory.creepsNorth = creepsNorth;
  Memory.creepsSouthwest = creepsSouthwest;
  Memory.creepsWest = creepsWest;
}
spawnCreepTypes = profiler.registerFN(spawnCreepTypes, "spawnCreepTypes");

module.exports = spawnCreepTypes;
