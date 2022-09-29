import { ArrayAndWeight, SortConfig, SortErrors } from "./types.ts";
import { Result } from "../enums/mod.ts";
import { hash } from "./deps.ts";
export const createSorter = <T>(cfg: SortConfig<T>) => {
	return (
		arrs: [...ArrayAndWeight<T>[], ArrayAndWeight<T>],
	): Result<T[], SortErrors> => {
		type SHA1Hash = string;
		type PositionInArray = number;

		type Lookup = Record<SHA1Hash, PositionInArray>;
		const idx: Array<Lookup> = [];
		const objs: Record<SHA1Hash, T> = {};

        const hashfn = cfg.hashBy ?? hash;

		try {
			if (arrs.map((a) => a[0].length).reduce((a, b) => a + b) === 0) {
				return { err: "all_empty", ok: null };
			}
			arrs.forEach((a, i) => {
				a[0].forEach((item, j) => {
					const lookup: Lookup = idx[i] || {};
					const sha1 = hashfn(item);
					if (lookup[sha1] !== undefined) {
						switch (cfg.ifNonUnique) {
							case "fail": {
								throw "non_unique";
							}
							case "use_first": {
								// ignore any further instances
								return;
							}
							case "use_last": {
								break;
							}
						}
					}
					lookup[sha1] = j;
					objs[sha1] = item;
					idx[i] = lookup;
				});
			});

			const weightings = Object.keys(objs)
				.filter((sha) =>
					idx.map((lookup) => {
						if (lookup[sha] === undefined) {
							if (typeof cfg.ifMissing === "number") {
								return true;
							} else if (cfg.ifMissing === "fail") {
								throw "missing_items";
							} else {
								return false;
							}
						}
						return true;
					}).every(a => a)
				).map((sha) =>
					[
						sha,
						idx.map((lookup) => {
							return lookup[sha] !== undefined
								? lookup[sha]
								: cfg.ifMissing as number;
						}).reduce((a, b) => a + b) / idx.length,
					] as [string, number]
				);

			weightings.sort((a, b) => a[1] - b[1]);

			return { err: null, ok: weightings.map((a) => objs[a[0]]) };
		} catch (e) {
			return { err: e, ok: null };
		}
	};
};

export const sortCorrect = createSorter({
    ifMissing: "fail",
    ifNonUnique: "fail"
});

export const sortInfallible = <T>(
    arrs: [...ArrayAndWeight<T>[], ArrayAndWeight<T>],
) => createSorter<T>({
    ifMissing: 0,
    ifNonUnique: "use_first"
})(arrs).ok as T[];