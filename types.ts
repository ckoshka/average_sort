export type SortConfig<T> = {
    hashBy?: (item: T) => string | number;
    ifMissing: "fail" | "omit" | number;
    ifNonUnique: "fail" | "use_first" | "use_last";
}

export type SortErrors = "all_empty" | "missing_items" | "non_unique";

export type ArrayAndWeight<T> = [T[], number];