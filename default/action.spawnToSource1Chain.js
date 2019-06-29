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
  let exts = Memory.spawnExts;
  let stor1 = Game.getObjectById(Memory.store1);
  let linkEntrance = Game.getObjectById(Memory.linkEntranceId);

  // try {
  //   if (!hv) {
  //     // console.log("hv");
  //     return;
  //   } else if (!tr1) {
  //     // console.log("tr1");
  //     return;
  //   } else if (!tr2 && hv.pos.isNearTo(source1)) {
  //     // console.log("tr2");
  //     supplyChainRetVal = supplyChain([tr1.name], hv.name, source1, s1);
  //     // return;
  //   }
  // } catch (e) {
  //   console.log(e.message);
  //   return;
  // }

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
      if (Memory.enAvail >= 100) {
        Game.spawns.Spawn1.spawnCreep([MOVE, MOVE], "mover1", {
          memory: {
            role: "mover",
          },
        });
      }
    } else {
      Game.spawns.Spawn1.spawnCreep([MOVE, MOVE], "mover1", {
        memory: {
          role: "mover",
          directions: direction,
        },
      });
    }
  } else if (needMover) {
    // we have a mover, let's check if everyone is in the right spot
    if (hv && !hv.pos.isNearTo(source1)) {
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
    } else if (tr1 && (!tr1.pos.isNearTo(hv) || tr1.pos.x <= hv.pos.x)) {
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
    } else if (tr2 && (!tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1))) {
      console.log("need to move tr1 or tr2");
      if (!mv.pos.isNearTo(tr2)) {
        console.log("Mover not next to tr2. Moving," + smartMove(mv, tr2, 1));
      } else if ((mv.pos.x != 45 && mv.pos.y != 5) ||(tr2.pos.x <= tr1.pos.x)) {
        console.log(
          "pulling tr2 reset spot . " +
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
                source1.pos.y - 1,
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
      let extRetVal = -16;
      supplyChainRetVal = supplyChain(
        [tr1.name, tr2.name],
        hv.name,
        source1,
        s1
      );

      _.forEach(exts, (ext) => {
        let e = Game.getObjectById(ext);

        if (e.energy < e.energyCapacity) {
          if (tr1.pos.isNearTo(e) && _.sum(tr1.carry) > 0) {
            extRetVal = tr1.transfer(e, RESOURCE_ENERGY);
            if (extRetVal === OK) {
              tr1.say("s");
            } else {
              console.log("tr1 fail ext: " + extChainRetVal);
            }
          } else if (tr2.pos.isNearTo(e) && _.sum(tr2.carry) > 0) {
            extRetVal = tr2.transfer(e, RESOURCE_ENERGY);
            if (extRetVal === OK) {
              tr2.say("s");
            } else {
              console.log("tr2 fail ext: " + e.pos + " " + extRetVal);
            }
          }
        }
      });
      let retval;
      if (extRetVal != OK) {
        if (Memory.linkGets.length > 0 && _.sum(tr1.carry) > 0) {
          retval = tr1.transfer(linkEntrance, RESOURCE_ENERGY);
          tr1.say("l." + retval);
        } else if (
          Object.keys(Game.creeps).length < 10 &&
          linkEntrance.energy > 0
        ) {
          retval = tr1.withdraw(linkEntrance, RESOURCE_ENERGY);
          tr1.say("wdL." + retval);
        }

        if (extRetVal != OK && retval != OK) {
          if (tr1.pos.isNearTo(stor1)) {
            retval = tr1.transfer(stor1, RESOURCE_ENERGY);
            tr1.say("st1");
          }

          if (tr2.pos.isNearTo(stor1)) {
            retval = tr2.transfer(stor1, RESOURCE_ENERGY);
            tr2.say("st1");
          }
        }
      }
    } catch (e) {
      console.log(e + "\nstart supply chain err:" + supplyChainRetVal);
      // ignore
    }
  }
}

module.exports = spawnToSource1Chain;
