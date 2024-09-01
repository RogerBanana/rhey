import { RHey } from "./RHey";

export class Slicer<T> {
  private array: RHey<T>;

  constructor(array: RHey<T>) {
    this.array = array;
  }

  where(condition: (item: T) => boolean): this {
    this.array = new RHey(...this.array.filter(condition));
    return this;
  }

  map<U>(callbackfn: (item: T, index: number, array: T[]) => U): RHey<U> {
    return this.array.map(callbackfn) as RHey<U>;
  }

  sort(compareFn?: (a: T, b: T) => number): this {
    this.array.sort(compareFn);
    return this;
  }

  reduce<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U {
    // Explicitly cast the reduce call to ensure type compatibility
    return this.array.reduce<U>(callbackfn as any, initialValue);
  }

  some(callbackfn: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.array.some(callbackfn);
  }

  every(callbackfn: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.array.every(callbackfn);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.array[Symbol.iterator]();
  }

  valueOf(): RHey<T> {
    return this.array;
  }

  toString(): string {
    return this.array.toString();
  }
}
