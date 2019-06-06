/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 *
 */
const chainMove = require("./chainMove");
const smartMove = require("./action.smartMove");
const supplyChain = require("./supplyChain");

function spawnToSource1Chain() {
  let hv = Game.creeps["harvester1"];
  let tr1 = Game.creeps["tr1"];
  let tr2 = Game.creeps["tr2"];
  let mv = Game.creeps["mover1"];
  // let movingChain = mv.memory ? mv.memory.movingChain : false;
  let hvNames = ["harvester1"];
  let trNames = ["tr1", "tr2"];
  let source1 = Memory.source1;
  let s1 = Memory.s1;
  let energy;
  let needMover = false;
  let extension = Game.getObjectById("5ce6a1f809af315f015a8295");
  let extension2 = Game.getObjectById("5cf714bb21281831d9ecd4c0");
  let extension3 = Game.getObjectById("5cf733caf7020f7e680e392f");
  let extensions = [extension, extension2, extension3];
  try {
    if (!hv) {
      console.log("hv");
      supplyChainRetVal = supplyChain([tr1.name, tr2.name], "", source1, s1);
      return;
    } else if (!tr1) {
      console.log("tr1");
      supplyChainRetVal = supplyChain([tr2.name], hv.name, source1, s1);
      return;
    } else if (!tr2) {
      console.log("tr2");
      supplyChainRetVal = supplyChain([tr1.name], hv.name, source1, s1);
      return;
    }
  } catch (e) {
    console.log(e.message);
    return;
  }

  needMover = !hv.pos.isNearTo(source1);
  needMover = needMover || !tr1.pos.isNearTo(tr2) || !tr1.pos.isNearTo(hv);
  needMover = needMover || !tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1);

  if (needMover && !mv) {
    console.log("need mover for supply chain");
    let direction = LEFT;
    if (
      Memory.s1.room.lookForAt(
        LOOK_CREEPS,
        Memory.s1.pos.x - 1,
        Memory.s1.pos.y
      )
    ) {
      if (Memory.enAvail >= 50) {
        Game.spawns.Spawn1.spawnCreep([MOVE], "mover1", {
          memory: {
            role: "mover"
          }
        });
      }
    } else {
      Game.spawns.Spawn1.spawnCreep([MOVE], "mover1", {
        memory: {
          role: "mover",
          directions: direction
        }
      });
    }
  } else if (needMover) {
    // we have a mover, let's check if everyone is in the right spot
    if (!hv.pos.isNearTo(source1)) {
      console.log("hv isn't in place.");
      // we need to pull hv into place next to the source to harvest
      if (!mv.pos.isNearTo(hv)) {
        console.log("mv: tow hv:" + smartMove(mv, hv, 1));
      } else {
        if (
          !mv.pos.isEqualTo(
            new RoomPosition(
              source1.pos.x + 1,
              source1.pos.y,
              source1.room.name
            )
          )
        ) {
          console.log(
            "chainMove hv:" +
              chainMove(
                mv.name,
                hvNames,
                new RoomPosition(
                  source1.pos.x + 1,
                  source1.pos.y,
                  source1.room.name
                ),
                0
              )
          );
        } else {
          try {
            console.log("chainMove hv:" + chainMove(mv.name, hvNames, hv, 0));
          } catch (e) {
            console.log(
              "chainMove hv:" +
                chainMove(
                  mv.name,
                  hvNames,
                  new RoomPosition(45, 5, hv.room.name),
                  0
                )
            );
          }
        }
      }
    } else if (!tr1.pos.isNearTo(hv) || tr1.pos.x <= hv.pos.x) {
      console.log("Need to pull tr1 into place next to hv.");
      if (!mv.pos.isNearTo(tr1)) {
        console.log("moving to tow position:" + smartMove(mv, tr1, 1));
      } else if (
        !mv.pos.isEqualTo(
          new RoomPosition(hv.pos.x + 1, source1.pos.y - 1, hv.room.name)
        )
      ) {
        console.log(
          "pulling tr1." +
            chainMove(
              mv.name,
              [tr1.name],
              new RoomPosition(hv.pos.x + 1, source1.pos.y - 1, hv.room.name),
              0
            )
        );
      } else {
        try {
          console.log("pulling tr1. " + chainMove(mv.name, [tr1.name], tr1, 0));
        } catch (e) {
          console.log(e.message);
          console.log(
            "pulling tr1." +
              chainMove(
                mv.name,
                [tr1.name],
                new RoomPosition(43, 7, hv.room.name),
                0
              )
          );
        }
      }
    } else if (!tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1)) {
      console.log("need to move tr1 or tr2");
      if (!mv.pos.isNearTo(tr2)) {
        console.log("Mover not next to tr2. Moving," + smartMove(mv, tr2, 1));
      } else if (mv.pos.x != 45 && mv.pos.y != 5) {
        console.log(
          "pulling tr2 reset spot . " +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(45, 5, source1.room.name),
              0
            )
        );
      } else if (tr2.pos.x <= tr1.pos.x) {
        console.log(
          "pulling tr2 reset spot. " +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(45, 5, source1.room.name),
              0
            )
        );
      } else {
        console.log(
          "pulling tr2." +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(
                source1.pos.x + 3,
                source1.pos.y,
                source1.room.name
              ),
              0
            )
        );
      }
    }
  } else {
    let supplyChainRetVal = -16;
    try {
      let hvVal = hv.harvest(source1);

      _.forEach(extensions, ext => {
        if (ext.energy < ext.energyCapacity) {
          if (_.sum(tr1.carry) > 0) {
            supplyChainRetVal = tr1.transfer(ext, RESOURCE_ENERGY);
            if (supplyChainRetVal === OK) tr1.say("s");
          } else if (_.sum(tr2.carry) > 0) {
            supplyChainRetVal = tr2.transfer(ext, RESOURCE_ENERGY);
            if (supplyChainRetVal === OK) tr2.say("s");
          }
        }
      });

      supplyChainRetVal = supplyChain(
        [tr1.name, tr2.name],
        hv.name,
        source1,
        s1
      );
    } catch (e) {
      console.log(e + "\nstart supply chain err:" + supplyChainRetVal);
      // ignore
    }
  }
}

module.exports = spawnToSource1Chain;
