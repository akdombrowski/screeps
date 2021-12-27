const profiler = require("./screeps-profiler");

function towersAttackInvader(invader, towers) {
  console.log("tower spotted invader: " + invader);
  if (invader) {
    for (let i = 0; i < towers.length; i++) {
      towers[i].attack(invader);
    }
  }
}

towersAttackInvader = profiler.registerFN(
  towersAttackInvader,
  "towersAttackInvader"
);
exports.towersAttackInvader = towersAttackInvader;
