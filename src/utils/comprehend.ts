import { RHey } from "../RHey";

export function comprehend<T, U, V>(
  array: RHey<T>,
  mapFn: (item: T) => U,
  filterFn: (item: U) => boolean,
  reduceFn?: (accumulator: V, item: U) => V,
  initialValue?: V
): U[] | V {
  const mapped = array.map(mapFn);
  const filtered = mapped.filter(filterFn);
  if (reduceFn && initialValue !== undefined) {
    return filtered.reduce(reduceFn, initialValue);
  }
  return filtered;
}
