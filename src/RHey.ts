import { Slicer } from "./Slicer";
import { groupBy } from "./utils/groupBy";
import { partition } from "./utils/partition";
import {
  union,
  intersection,
  difference,
  differenceBy,
} from "./utils/setOperations";
import { comprehend } from "./utils/comprehend";

/**
 * RHey is an extension of the native JavaScript Array with additional
 * utility methods for easier manipulation of arrays, particularly with arrays of objects.
 */
export class RHey<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
    Object.setPrototypeOf(this, RHey.prototype);
    return new Proxy(this, {
      get: (target, prop, receiver) => this._getHandler(target, prop, receiver),
      set: (target, prop, value, receiver) =>
        this._setHandler(target, prop, value, receiver),
    });
  }

  private _getHandler(
    target: RHey<T>,
    prop: string | symbol,
    receiver: any
  ): any {
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      let index = Number(prop);
      if (index < 0) {
        index = target.length + index; // Handle negative indexing
      }
      return Reflect.get(target, index, receiver);
    } else if (typeof prop === "string" && prop.includes(":")) {
      const [startStr, endStr, stepStr] = prop.split(":");
      const start = startStr ? Number(startStr) : 0;
      const end = endStr ? Number(endStr) : target.length;
      const step = stepStr ? Number(stepStr) : 1;

      const normalizedStart = start < 0 ? target.length + start : start;
      const normalizedEnd = end < 0 ? target.length + end : end;

      const slicedArray = new RHey(
        ...target
          .slice(normalizedStart, normalizedEnd)
          .filter((_, i) => i % step === 0)
      );

      return new Slicer(slicedArray);
    }
    return Reflect.get(target, prop, receiver);
  }

  private _setHandler(
    target: RHey<T>,
    prop: string | symbol,
    value: any,
    receiver: any
  ): boolean {
    if (typeof prop === "string" && !isNaN(Number(prop))) {
      let index = Number(prop);
      if (index < 0) {
        index = target.length + index; // Handle negative indexing
      }
      return Reflect.set(target, index, value, receiver);
    }
    return Reflect.set(target, prop, value, receiver);
  }

  // Properties

  /**
   * Gets the first element in the array.
   */
  get first(): T | undefined {
    return this.length > 0 ? this[0] : undefined;
  }

  /**
   * Gets the last element in the array.
   */
  get last(): T | undefined {
    return this.length > 0 ? this[this.length - 1] : undefined;
  }

  /**
   * Gets the center element(s) in the array.
   * If the array length is odd, returns the middle element.
   * If the array length is even, returns an array of the two central elements.
   */
  get center(): T | T[] | undefined {
    if (this.length === 0) return undefined;
    const mid = Math.floor(this.length / 2);
    return this.length % 2 === 0 ? [this[mid - 1], this[mid]] : this[mid];
  }

  // Methods

  /**
   * Shuffles the array in place, randomizing the order of its elements.
   * @returns The shuffled RHey.
   */
  shuffle(): this {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
  }

  /**
   * Picks one or more random elements from the array.
   * @param count The number of elements to pick. Defaults to 1.
   * @returns A single element or an array of elements, or undefined if the count is invalid.
   */
  pickRandom(count: number = 1): T | T[] | undefined {
    if (count <= 0) return undefined;
    if (count === 1) {
      return this[Math.floor(Math.random() * this.length)];
    }
    const result: T[] = [];
    const clonedArray = [...this];
    for (let i = 0; i < count && clonedArray.length > 0; i++) {
      const index = Math.floor(Math.random() * clonedArray.length);
      result.push(clonedArray.splice(index, 1)[0]);
    }
    return result;
  }

  /**
   * Removes one or more random elements from the array.
   * @param count The number of elements to remove. Defaults to 1.
   * @returns A single removed element or an array of removed elements, or undefined if the count is invalid.
   */
  removeRandom(count: number = 1): T | T[] | undefined {
    if (count <= 0) return undefined;
    const result: T[] = [];
    for (let i = 0; i < count && this.length > 0; i++) {
      const index = Math.floor(Math.random() * this.length);
      result.push(this.splice(index, 1)[0]);
    }
    return count === 1 ? result[0] : result;
  }

  /**
   * Adds an element to the beginning of the array.
   * @param item The element to add.
   * @returns The updated RHey.
   */
  addFirst(item: T): this {
    this.unshift(item);
    return this;
  }

  /**
   * Removes the first element from the array.
   * @returns The removed element or undefined if the array is empty.
   */
  removeFirst(): T | undefined {
    return this.shift();
  }

  /**
   * Adds an element to the end of the array.
   * @param item The element to add.
   * @returns The updated RHey.
   */
  addLast(item: T): this {
    this.push(item);
    return this;
  }

  /**
   * Removes the last element from the array.
   * @returns The removed element or undefined if the array is empty.
   */
  removeLast(): T | undefined {
    return this.pop();
  }

  /**
   * Adds multiple elements to the beginning of the array.
   * @param items An array of elements to add.
   * @returns The updated RHey.
   */
  addItemsFirst(items: T[]): this {
    this.unshift(...items);
    return this;
  }

  /**
   * Adds multiple elements to the end of the array.
   * @param items An array of elements to add.
   * @returns The updated RHey.
   */
  addItemsLast(items: T[]): this {
    this.push(...items);
    return this;
  }

  /**
   * Initiates a remove operation to remove `count` items from the array.
   * @param count The number of items to remove.
   * @returns An object with a `from` method to specify the starting index.
   */
  removeItems(count: number): {
    from: (start: number | ((item: T) => boolean)) => RHey<T>;
  } {
    return {
      from: (start: number | ((item: T) => boolean)) => {
        const startIndex = this._getStartIndex(start);
        const removed = this.splice(startIndex, count);
        return new RHey(...removed);
      },
    };
  }

  /**
   * Initiates a get operation to retrieve `count` items from the array without modifying it.
   * @param count The number of items to retrieve.
   * @returns An object with a `from` method to specify the starting index.
   */
  getItems(count: number): {
    from: (start: number | ((item: T) => boolean)) => RHey<T>;
  } {
    return {
      from: (start: number | ((item: T) => boolean)) => {
        const startIndex = this._getStartIndex(start);
        const items = this.slice(startIndex, startIndex + count);
        return new RHey(...items);
      },
    };
  }

  /**
   * Private helper to determine the starting index.
   * @param start A number representing the start index or a function to find the index.
   * @returns The starting index as a number.
   */
  private _getStartIndex(start: number | ((item: T) => boolean)): number {
    if (typeof start === "number") {
      return start;
    } else if (typeof start === "function") {
      const index = this.findIndex(start);
      if (index === -1) {
        throw new Error("No matching item found for the provided condition.");
      }
      return index;
    } else {
      throw new Error(
        "Invalid start parameter. Must be a number or a function."
      );
    }
  }

  /**
   * Private helper to determine the target index.
   * @param target A number representing the target index or a function to find the index.
   * @returns The target index as a number.
   */
  private _getTargetIndex(target: number | ((item: T) => boolean)): number {
    if (typeof target === "number") {
      return target;
    } else if (typeof target === "function") {
      const index = this.findIndex(target);
      if (index === -1) {
        throw new Error(
          "No matching target item found for the provided condition."
        );
      }
      return index;
    } else {
      throw new Error(
        "Invalid target parameter. Must be a number or a function."
      );
    }
  }

  /**
   * Filters the array by a specific property and value.
   * @param property The property to filter by.
   * @param value The value to match.
   * @returns A new RHey with elements that match the specified property and value.
   */
  filterByProperty<K extends keyof T>(property: K, value: T[K]): RHey<T> {
    return this.filter((item) => item[property] === value) as RHey<T>;
  }

  /**
   * Removes elements from the array that match a specific property and value.
   * @param property The property to filter by.
   * @param value The value to exclude.
   * @returns A new RHey with elements that do not match the specified property and value.
   */
  removeByProperty<K extends keyof T>(property: K, value: T[K]): RHey<T> {
    return this.filter((item) => item[property] !== value) as RHey<T>;
  }

  /**
   * Updates elements in the array that match a specific property and value.
   * @param property The property to filter by.
   * @param value The value to match.
   * @param update An object with the properties to update.
   * @returns A new RHey with updated elements.
   */
  updateByProperty<K extends keyof T>(
    property: K,
    value: T[K],
    update: Partial<T>
  ): RHey<T> {
    return this.map((item) =>
      item[property] === value ? { ...item, ...update } : item
    ) as RHey<T>;
  }

  /**
   * Groups the array by a specific property.
   * @param property The property to group by.
   * @returns An object where the keys are the values of the specified property and the values are RHey arrays of elements that share that property.
   */
  groupBy<K extends keyof T>(property: K) {
    return groupBy(this, property);
  }

  /**
   * Partitions the array into two arrays based on a condition.
   * @param condition The condition to partition by.
   * @returns An array containing two RHey arrays: one with elements that satisfy the condition and one with elements that do not.
   */
  partition(condition: (item: T) => boolean): [RHey<T>, RHey<T>] {
    return partition(this, condition);
  }

  /**
   * Performs a union operation with another array.
   * @param array The array to union with.
   * @returns A new RHey array containing the union of both arrays.
   */
  union(array: T[]): RHey<T> {
    return union(this, array);
  }

  /**
   * Performs an intersection operation with another array.
   * @param array The array to intersect with.
   * @returns A new RHey array containing the intersection of both arrays.
   */
  intersection(array: T[]): RHey<T> {
    return intersection(this, array);
  }

  /**
   * Performs a difference operation with another array.
   * @param array The array to differ from.
   * @returns A new RHey array containing the difference between both arrays.
   */
  difference(array: T[]): RHey<T> {
    return difference(this, array);
  }

  /**
   * Performs a difference operation based on a property with another array.
   * @param array The array to differ from.
   * @param property The property to use for the difference.
   * @returns A new RHey array containing the difference based on the property.
   */
  differenceBy<K extends keyof T>(array: T[], property: K): RHey<T> {
    return differenceBy(this, array, property);
  }

  /**
   * Creates a new array by applying the given map and filter functions,
   * and optionally reducing the result.
   * @param mapFn The map function to apply.
   * @param filterFn The filter function to apply.
   * @param reduceFn The reduce function to apply (optional).
   * @param initialValue The initial value for reduce (optional).
   * @returns The result of the comprehension.
   */
  comprehend<U, V>(
    mapFn: (item: T) => U,
    filterFn: (item: U) => boolean,
    reduceFn?: (accumulator: V, item: U) => V,
    initialValue?: V
  ): U[] | V {
    return comprehend(this, mapFn, filterFn, reduceFn, initialValue);
  }

  /**
   * Finds the first element that matches a specific property and value.
   * @param property The property to filter by.
   * @param value The value to match.
   * @returns The first element that matches the specified property and value, or undefined if no match is found.
   */
  findByProperty<K extends keyof T>(property: K, value: T[K]): T | undefined {
    return this.find((item) => item[property] === value);
  }

  /**
   * Extracts the values of a specific property from all elements in the array.
   * @param property The property to pluck.
   * @returns A new RHey containing the values of the specified property.
   */
  pluck<K extends keyof T>(property: K): RHey<T[K]> {
    return this.map((item) => item[property]) as RHey<T[K]>;
  }

  /**
   * Removes duplicate elements based on a specific property.
   * @param property The property to check for uniqueness.
   * @returns A new RHey with only unique elements based on the specified property.
   */
  uniqueByProperty<K extends keyof T>(property: K): RHey<T> {
    const seen = new Set<T[K]>();
    return this.filter((item) => {
      const value = item[property];
      if (seen.has(value)) {
        return false;
      } else {
        seen.add(value);
        return true;
      }
    }) as RHey<T>;
  }

  /**
   * Extracts a subset of properties from each element in the array.
   * @param properties The properties to extract.
   * @returns A new RHey containing objects with only the specified properties.
   */
  extractSubset<K extends keyof T>(...properties: K[]): RHey<Pick<T, K>> {
    return this.map((item) => {
      const subset: Partial<T> = {};
      properties.forEach((prop) => {
        subset[prop] = item[prop];
      });
      return subset as Pick<T, K>;
    }) as RHey<Pick<T, K>>;
  }

  /**
   * Counts the number of elements that satisfy a condition on a specific property.
   * @param property The property to check.
   * @param condition A condition function to evaluate on the property value.
   * @returns The count of elements that satisfy the condition.
   */
  countByPropertyValue<K extends keyof T>(
    property: K,
    condition: (value: T[K]) => boolean
  ): number {
    return this.reduce((count, item) => {
      if (condition(item[property])) {
        count++;
      }
      return count;
    }, 0);
  }

  /**
   * Flattens a nested array structure.
   * @returns A new RHey with all sub-array elements concatenated into it.
   */
  flatten(): RHey<unknown> {
    return new RHey(...this.flat());
  }

  /**
   * Removes duplicate elements from the array.
   * @returns A new RHey with unique elements.
   */
  unique(): RHey<T> {
    return new RHey(...new Set(this));
  }

  /**
   * Splits the array into chunks of a specified size.
   * @param size The size of each chunk.
   * @returns A new RHey of arrays, each containing `size` elements.
   */
  chunk(size: number): RHey<RHey<T>> {
    const chunks = [];
    for (let i = 0; i < this.length; i += size) {
      chunks.push(new RHey(...this.slice(i, i + size)));
    }
    return new RHey(...chunks);
  }

  /**
   * Converts an array of key-value pairs into an object.
   * Assumes each element is an array of two elements: [key, value].
   * @returns An object composed of the key-value pairs.
   */
  toObject<K extends keyof any, V>(): { [key in K]: V } {
    return Object.fromEntries(this as unknown as [K, V][]) as { [key in K]: V };
  }
}
