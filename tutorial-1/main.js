const checkInvaders = require("./checkInaders");
const supplyChain = require("supplyChain");

module.exports.loop = function() {
  let s1 = Game.spawns.Spawn1;
  let rm = s1.room;
  let hostiles = rm.find(FIND_HOSTILE_CREEPS);
  console.log(JSON.stringify(hostiles));
  if (hostiles) {
    console.log(hostiles[0].name);
  }
  // let source = Game.getObjectById("c74462de77a233f84b73266d");

  // let harvester = "a";
  // let transferers = ["b", "c", "d", "e", "f"];
  // let spawn = Game.spawns.s;
  // let storage = Game.getObjectById("442aca55dfba27c5bdf65702");
  // Memory.x = Memory.x;
  // // console.log("x:" + Memory.x);
  // if(!Memory.x) {
  //     // supplyChain(transferers,"f", "a", source, storage);
  // }
  // let source2 = storage;
  // let harvester2 = Game.creeps.g;
  // let harvester3 = Game.creeps.h;
  // let g = Game.creeps.g;
  // let h = Game.creeps.h;
  // let i = Game.creeps.i;
  // let j = Game.creeps.j;
  // let k = Game.creeps.k;
  // let l = Game.creeps.l;
  // let g2 = Game.creeps.g2;
  // let m = Game.creeps.Lucy;
  // let n = Game.creeps.n;
  // let o = Game.creeps.o;
  // let p = Game.creeps.p;
  // // console.log("g withdraw: " + harvester2.withdraw(source2, RESOURCE_ENERGY));
  // // console.log("g transfer from storage: " + harvester2.transfer(Game.creeps.j, RESOURCE_ENERGY));
  // // console.log("h withdraw: " + harvester3.withdraw(source2, RESOURCE_ENERGY));
  // // console.log("h transfer from storage: " + harvester3.transfer(Game.creeps.i, RESOURCE_ENERGY));

  // // console.log("j transfer: " + harvester2.transfer(Game.creeps.j.pos.y - 1, RESOURCE_ENERGY));

  // console.log("k pull: " + k.pull(j));
  // console.log("j pull: " + j.pull(g2));
  // console.log("g2 pull: " + g2.pull(g));
  // console.log("g pull: " + g.pull(0));

  // console.log("o move: " + o.move(g));

  // console.log("g move: " + g.move(g2));
  // console.log("g2 move: " + g2.move(j));
  // console.log("j move: " + j.move(k));
  // console.log("k move: " + k.move(n));

  // console.log("l pull: " + l.pull(p));
  // console.log("p pull: " + p.pull(i));

  // console.log("i pull: " + i.pull(h));
  // console.log("h pull: " + h.pull(m));
  // console.log("m pull: " + m.pull(n));
  // console.log("n pull: " + n.pull(k));
  // console.log("n move: " + n.move(m));
  // console.log("m move: " + m.move(h));
  // console.log("h move: " + h.move(i));
  // console.log("i move: " + i.move(p));
  // console.log("p move: " + p.move(l));

  // console.log("l move: " + l.move(TOP));
  // console.log("o fatigue: " + o.fatigue);
  // console.log("k fatigue: " + k.fatigue);
  // console.log("l fatigue: " + l.fatigue);
};
