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
  let tr1 = Game.creeps["transferer1"];
  let tr2 = Game.creeps["transferer2"];
  let mv = Game.creeps["mover1"];
  // let movingChain = mv.memory ? mv.memory.movingChain : false;
  let hvNames = ["harvester1"];
  let trNames = ["transferer1", "transferer2"];
  let source1 = Memory.source1;
  let s1 = Memory.s1;
  let energy;
  let needMover = false;
  let extension = Game.getObjectById("5ce6a1f809af315f015a8295");
  if (!hv || !tr1 || !tr2) {
    console.log(
      "spawnToSource1Chain err. missing hr or tr" +
        "\nhv: " +
        JSON.stringify(hv) +
        "\ntr1:" +
        JSON.stringify(tr1) +
        "\ntr2:" +
        JSON.stringify(tr2)
    );
    return;
  }

  needMover = !hv.pos.isNearTo(source1);
  needMover = needMover || !tr1.pos.isNearTo(tr2) || !tr1.pos.isNearTo(hv);
  needMover = needMover || !tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1);

  if (needMover && !mv) {
    console.log("need mover for supply chain");
    if (Memory.enAvail >= 250) {
      Game.spawns.Spawn1.spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE], "mover1", {
        memory: {
          role: "mover",
          directions: LEFT
        }
      });
    }
  } else if (needMover) {
    console.log("Need to move some creeps into place.");
    // we have a mover, let's check if everyone is in the right spot
    if (!hv.pos.isNearTo(source1)) {
      console.log("hv isn't in place.");
      // we need to pull hv into place next to the source to harvest
      if (mv.pos.isNearTo(hv)) {
        console.log(
          "Our puller is next to hv, but hv isnt in next to the source yet." +
            "Help pull her into place."
        );
        if (hv.pos.y < source1.pos.y) {
          console.log(
            "chainMove:" +
              chainMove(
                mv.name,
                hvNames,
                new RoomPosition(
                  source1.pos.x + 1,
                  source1.pos.y + 1,
                  source1.room.name
                ),
                0
              )
          );
        } else {
          console.log(
            "chainMove:" +
              chainMove(
                mv.name,
                hvNames,
                new RoomPosition(
                  source1.pos.x + 1,
                  source1.pos.y - 1,
                  source1.room.name
                ),
                0
              )
          );
        }
      } else {
        console.log("moving to tow position:" + smartMove(mv, hv, 1));
      }
    } else if (!tr1.pos.isNearTo(hv)) {
      console.log("Need to pull tr1 into place next to hv.");
      if (!mv.pos.isNearTo(tr1)) {
        console.log("moving to tow position:" + smartMove(mv, tr1, 1));
      } else if (tr1.pos.y > hv.pos.y) {
        console.log(
          "Tr1 isn't in the right spot. Help pull her into in place."
        );
        console.log(
          "pulling tr1 up." +
            chainMove(
              mv.name,
              [tr1.name],
              new RoomPosition(hv.pos.x + 1, hv.pos.y - 1, hv.room.name),
              0
            )
        );
      } else {
        console.log(
          "pulling tr1 down." +
            chainMove(
              mv.name,
              [tr1.name],
              new RoomPosition(hv.pos.x + 1, hv.pos.y + 1, hv.room.name),
              0
            )
        );
      }
    } else if (!tr2.pos.isNearTo(tr1) || !tr2.pos.isNearTo(s1)) {
      console.log("need to move tr1 or tr2");
      if (!mv.pos.isNearTo(tr2)) {
        console.log("Mover not next to tr2. Moving," + smartMove(mv, tr2, 1));
      } else if (tr2.pos.x <= tr1.pos.x) {
        console.log(
          "Pulling tr2 next right, up:" +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(tr1.pos.x + 1, tr1.pos.y - 1, tr1.room.name),
              0
            )
        );
      } else if (tr2.pos.y < tr1.pos.y) {
        console.log(
          "Pulling tr2 down:" +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(tr1.pos.x + 1, tr1.pos.y + 1, tr1.room.name),
              0
            )
        );
      } else if (tr2.pos.y < tr1.pos.y) {
        console.log(
          "Pulling tr2 down:" +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(tr1.pos.x + 1, tr1.pos.y + 1, tr1.room.name),
              0
            )
        );
      } else if (!tr2.pos.isNearTo(s1)) {
        let y = s1.pos.y + 1;
        let dir = "down";
        if (tr2.pos.y > s1.pos.y) {
          y = s1.pos.y - 1;
          dir = "up";
        }
        console.log(
          "Pulling tr2:" +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(tr1.pos.x + 1, y, tr1.room.name),
              0
            )
        );
      } else {
        console.log(
          "Pulling tr2 up:" +
            chainMove(
              mv.name,
              [tr2.name],
              new RoomPosition(tr1.pos.x + 1, source1.pos.y - 1, tr1.room.name),
              0
            )
        );
      }
    }
  } else {
    let supplyChainRetVal = -16;
    try {
      let hvVal = hv.harvest(source1);
      if (extension.energy < extension.energyCapacity && _.sum(tr1.carry) > 0) {
        supplyChainRetVal = tr1.transfer(extension, RESOURCE_ENERGY);
        if (supplyChainRetVal === OK) tr1.say("s");
      }

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
