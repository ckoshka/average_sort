import * as Sort from "./mod.ts";

const a1 = [
	"fillet of a fenny snake",
	"eye of newt",
	"toe of frog",
	"wool of bat",
	"tongue of dog",
];

const a2 = [
	"wool of bat",
	"tongue of dog",
	"eye of newt",
	"fillet of a fenny snake",
];

// note: all of these have defaults which can be configured
// to prioritise correctness, or to prioritise performance

const sortFn = Sort.createSorter<string>({
	hashBy: (n) => n.normalize(),
	// this has to return a valid key-type for an object
	// i.e, strings, numbers, or Symbols

	ifMissing: "omit",
	// can also be:
	// - "omit"
	// i.e just chuck that item out, only return those that are
	// common to both lists.
	// - "guess"
	// i.e use any position information available in the lists
	// which *do* have the item
	// - any number that can be used as a replacement

	ifNonUnique: "fail",
	// can also be:
	// - "use_first"
	// - "use_last",
	// - "use_average"
});

console.log(sortFn(
	[[a1, 0.5], [a2, 0.5]],
));

// give them each a weighting of 0.5
// (but they don't need to add to one)

// this will return:
// { ok: [... your sorted list], err: null }
// or { ok: null, err: "all_empty" | "missing_items" | "non_unique" }

// ***

const c1 = [
	{ city: "Tlön" },
	{ city: "Uqbar" },
	{ city: "Orbis Tertius" },
];

const c2 = [
	{ city: "Orbis Tertius" },
    { city: "Tlön" },
	{ city: "Tlön" },
];

// this function is very suspicious, very strict, and deterministic.

// defaults:

// - hashBy: hashed using the very cool object-hash library
// - failBy: "enum"
// - ifMissing, ifNonUnique: "fail"

console.log(Sort.sortCorrect(
	[
		[c1, 1.5],
		[c2, 2.5],
	],
));

// this one doesn't fail and therefore just returns T[]

console.log(Sort.sortInfallible(
	[
		[c1, 1.5],
		[c2, 2.5],
	],
));
