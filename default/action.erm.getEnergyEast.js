const transferEnergy = require("./transferEnergy.transferEnergy");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const smartMove = require("./move.smartMove");

function vest(creep, flag, path) {
    creep.memory.direction = "east";
    const eastSource = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
    const neSource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0ba");
    const neSource2 = Game.getObjectById("5bbcaf0c9099fc012e63a0bb");
    let ermNeHarvesters = Memory.ermNeHarvesters;
    let ermHarvesters = Memory.ermHarvesters;
    let s2 = Game.getObjectById(Memory.s2);
    const name = creep.name;
    const sourceId = creep.memory.sourceId;

    let target = sourceId ? Game.getObjectById(sourceId) : null;
    let retval = -16;
    let harvey = ermHarvesters.find(n => {
        return n === name;
    });
    // console.log(name + " e " + JSON.stringify(ermHarvesters) + " " + harvey);
    let harveyNe = ermNeHarvesters.find(n => {
        return n === name;
    });
    // console.log(name + " ne " + JSON.stringify(ermNeHarvesters) + " " + harveyNe);
    creep.memory.sourceDir = harvey ? "east" : "north";
    if (creep.memory.sourceDir === "north" && !harveyNe) {
        ermNeHarvesters.push(name);
        Memory.ermNeHarvesters = ermNeHarvesters;
    }


    if (creep.room.name === "E35N31") {
        if (creep.pos.isNearTo(Game.flags.eastExit)) {
            creep.move(RIGHT);
        } else {
            smartMove(creep, Game.flags.eastExit, 1);
        }
        return;
    } else if (
        creep.room.name === "E36N31" &&
        (creep.pos.x < Game.flags.eEntrance2.pos.x - 1 && creep.pos.y >= 21)
    ) {
        smartMove(creep, Game.flags.eEntrance2, 1);
        return;
    } else if (creep.pos.isNearTo(Game.flags.eEntrance2)) {
        if (name === "h154E") {
            console.log(name + " t5:" + target);
        }
    }

    if (_.sum(creep.carry) >= creep.carryCapacity) {
        creep.memory.getEnergy = false;

        if (harvey) {
            if (ermHarvesters.length < 2) {
                creep.memory.buildingRoad = false;
                creep.memory.transfer = true;
            }
        } else if (harveyNe) {
            creep.memory.buildingRoad = false;
            if (ermNeHarvesters.length < 2) {
                creep.memory.transfer = true;
            }
        }

        //   if (creep.memory.buildingRoad) {
        //     let retval = buildRoad(creep);
        //     if (retval != OK) {
        //       creep.memory.transfer = true;
        //       if (harvey || harveyNe) {
        //         transferEnergyeRm(creep);
        //       } else {
        //         transferEnergy(creep);
        //       }
        //     } else {
        //       creep.memory.buildingRoad = true;
        //     }
        //   } else if (creep.memory.transfer) {
        //     transferEnergy(creep);
        //   }
        //   return retval;
    } else {
        creep.memory.transfer = false;
        creep.memory.getEnergy = true;
    }

    if (!target) {
        if (harveyNe) {
            if (creep.memory.nesource === 1) {
                target = neSource1;
            } else {
                target = neSource2;
            }

            if (creep.memory.role === "h") {
                if (neSource1 && neSource2) {
                    let creepsAroundSource1 = neSource1.pos.findInRange(FIND_CREEPS, 2);
                    let creepsAroundSource2 = neSource2.pos.findInRange(FIND_CREEPS, 2);
                    if (neSource1 && creepsAroundSource1.length < 1) {
                        target = neSource1;
                        creep.memory.nesource = 1;
                    } else if (neSource2 && creepsAroundSource2 < 1) {
                        target = neSource2;
                        creep.memory.nesource = 2;
                    } else if (creepsAroundSource1.length < creepsAroundSource2.length) {
                        target = neSource1;
                        creep.memory.nesource = 1;
                    } else {
                        target = neSource2;
                        creep.memory.nesource = 2;
                    }
                    creep.memory.sourceId = target.id;
                } else {
                    target = Game.flags.neSource1;
                }
            }
        } else if (harvey) {
            creep.memory.nesource = null;
            target = eastSource;
        } else {
            target = eastSource;
        }
    }

    if (target) {
        let waitTime = Memory.waitTime || 0;
        if (creep.pos.isNearTo(target)) {
            retval = creep.harvest(target);
            creep.say("h");
            creep.memory.sourceId = target.id;

            return retval;
        } else if (creep.fatigue > 0) {
            creep.say("f." + creep.fatigue);
            waitTime = 0;
            return retval;
        } else {
            retval = smartMove(creep, target, 1, true, "#000fff", 2000, 1000);
            if (creep.pos.inRangeTo(target, 3)) {
                waitTime += 1;
                if (waitTime > 10) {
                    waitTime = 0;
                    creep.memory.sourceId = null;
                    creep.memory.nesource = creep.memory.nesource === 1 ? 2 : 1;
                }
                Memory.waitTime = waitTime;
                creep.say("ch");
            }

            return retval;
        }
    } else if (!target) {
        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (target) {
            if (creep.pos.isNearTo(target.pos)) {
                creep.say("pu");
                retval = creep.pickup(target);
            } else {
                creep.say("pu");
                retval = smartMove(creep, target, 1);
            }

            creep.memory.sourceId = null;
            creep.memory.nesource = null;
            return retval;
        }
    } else {
        console.log("creep.name " + creep.name + " is sad.");
        creep.say("sad");
    }
    return retval;
}

module.exports = vest;