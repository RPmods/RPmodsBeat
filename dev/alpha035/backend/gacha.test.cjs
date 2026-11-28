const assert=require("node:assert/strict"),G=require("./gacha.cjs");
const seed=Buffer.alloc(32,7),q={banner:"classic",count:10,requestId:"test-request-0001"},old={wallet:{coins:500,crystals:15}};
const next=G.settle(old,q,seed,1);assert.equal(next.wallet.crystals,5);assert.equal(old.wallet.crystals,15);assert.equal(next.draws[q.requestId].results.length,10);assert.deepEqual(G.settle(old,q,seed,1),next);assert.equal(G.settle(next,q,Buffer.alloc(32,2),2),next);
assert.throws(()=>G.settle(next,{...q,count:1},seed,2),/request-conflict/);assert.throws(()=>G.settle(next,{...q,requestId:"test-request-0002"},seed,2),/insufficient/);
const hard=G.settle({wallet:{coins:0,crystals:1},pity:{limited:{exotic:59,epic:0,guaranteed:true}},inventory:{"exotic-galaxy":true}},{...q,count:1},seed,3);
assert.equal(hard.draws[q.requestId].results[0].id,"exotic-galaxy");assert.equal(hard.shards,20);assert.equal(hard.pity.limited.exotic,0);assert.equal(hard.pity.limited.guaranteed,false);
const epic=G.settle({wallet:{crystals:10}},{...q,banner:"all"},seed,4);assert.ok(epic.draws[q.requestId].results.some(x=>x.rarity!=="rare"));assert.equal(epic.pity.limited,undefined);
assert.equal(G.validRequest({...q,banner:"fake"}),false);assert.equal(G.validRequest({...q,count:100}),false);
console.log("PASS server gacha: debit, deterministic retry, receipt replay, guaranteed cosmetic, duplicates, separate pity");
