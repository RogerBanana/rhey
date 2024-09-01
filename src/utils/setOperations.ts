import { RHey } from "../RHey";

export function union<T>(array1: RHey<T>, array2: T[]): RHey<T> {
  return new RHey(...new Set([...array1, ...array2]));
}

export function intersection<T>(array1: RHey<T>, array2: T[]): RHey<T> {
  return new RHey(...array1.filter((item) => array2.includes(item)));
}

export function difference<T>(array1: RHey<T>, array2: T[]): RHey<T> {
  return new RHey(...array1.filter((item) => !array2.includes(item)));
}

export function differenceBy<T, K extends keyof T>(
  array1: RHey<T>,
  array2: T[],
  property: K
): RHey<T> {
  const set = new Set(array2.map((item) => item[property]));
  return new RHey(...array1.filter((item) => !set.has(item[property])));
}
