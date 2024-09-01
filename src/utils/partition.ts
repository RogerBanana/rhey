import { RHey } from "../RHey";

export function partition<T>(
  array: RHey<T>,
  condition: (item: T) => boolean
): [RHey<T>, RHey<T>] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach((item) => (condition(item) ? pass : fail).push(item));
  return [new RHey(...pass), new RHey(...fail)];
}
