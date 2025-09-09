import { ObjectHandler } from "../handlers/object-handler";
import { createProxyHandler } from "./proxy-handler";
import type {
  IRheyArray,
  QueryDefinition,
  QueryCondition,
  QueryRegistry,
} from "../types";

export class RheyArray<T = any> implements IRheyArray<T> {
  private _array: T[];
  private _queries: Map<string, QueryDefinition<T>> = new Map();
  private _queryCache: QueryRegistry<T> = {};

  constructor(array: T[]) {
    this._array = [...array]; // Always work with copy
    this._updateQueryProxy();

    // Return proxied instance for magic slicing
    return new Proxy(this, createProxyHandler<T>());
  }

  // ==================== Core Properties ====================

  get array(): T[] {
    return [...this._array]; // Always return copy
  }

  get length(): number {
    return this._array.length;
  }

  // ==================== Smart Properties ====================

  get first(): T | undefined {
    return this._array[0];
  }

  get last(): T | undefined {
    return this._array[this._array.length - 1];
  }

  get center(): T | T[] {
    const len = this._array.length;
    if (len === 0) return undefined;
    if (len === 1) return this._array[0];

    const mid = Math.floor(len / 2);
    if (len % 2 === 1) {
      return this._array[mid];
    } else {
      return [this._array[mid - 1], this._array[mid]];
    }
  }

  get min(): T | undefined {
    if (this._array.length === 0) return undefined;
    return this._array.reduce((min, item) => (item < min ? item : min));
  }

  get max(): T | undefined {
    if (this._array.length === 0) return undefined;
    return this._array.reduce((max, item) => (item > max ? item : max));
  }

  get sum(): number {
    return this._array.reduce((sum, item) => {
      return typeof item === "number" ? sum + item : sum;
    }, 0);
  }

  get average(): number {
    const numbers = this._array.filter(
      (item) => typeof item === "number"
    ) as number[];
    return numbers.length > 0
      ? numbers.reduce((a, b) => a + b) / numbers.length
      : 0;
  }

  get lastIndex(): number {
    return this._array.length - 1;
  }

  // ==================== Query System ====================

  get query(): QueryRegistry<T> {
    return this._queryCache;
  }

  createQuery(name: string, condition: QueryCondition<T>): this {
    const queryDef: QueryDefinition<T> = {
      condition,
      cache: this._array.filter(condition),
      lastUpdated: Date.now(),
    };

    this._queries.set(name, queryDef);
    this._updateQueryProxy();
    return this;
  }

  deleteQuery(name: string): boolean {
    const deleted = this._queries.delete(name);
    if (deleted) {
      this._updateQueryProxy();
    }
    return deleted;
  }

  refreshQuery(name: string): this {
    const queryDef = this._queries.get(name);
    if (queryDef) {
      queryDef.cache = this._array.filter(queryDef.condition);
      queryDef.lastUpdated = Date.now();
      this._updateQueryProxy();
    }
    return this;
  }

  refreshAllQueries(): this {
    for (const [name] of this._queries) {
      this.refreshQuery(name);
    }
    return this;
  }

  /**
   * Update the query proxy cache
   */
  private _updateQueryProxy(): void {
    this._queryCache = {};
    for (const [name, queryDef] of this._queries) {
      this._queryCache[name] = queryDef.cache;
    }
  }

  /**
   * Refresh queries when array is modified
   */
  private _onArrayModified(): void {
    this.refreshAllQueries();
  }

  // ==================== Object Methods ====================

  get obj(): T extends Record<string, any> ? ObjectHandler<T> : never {
    return new ObjectHandler(this as any) as any;
  }

  // ==================== Utility Methods ====================

  where(condition: QueryCondition<T>): RheyArray<T> {
    const filtered = this._array.filter(condition);
    return new RheyArray(filtered);
  }

  toArray(): T[] {
    return this.array;
  }

  // ==================== Array Modification Methods ====================
  // These methods modify the internal array and refresh queries

  push(...items: T[]): this {
    this._array.push(...items);
    this._onArrayModified();
    return this;
  }

  pop(): T | undefined {
    const item = this._array.pop();
    this._onArrayModified();
    return item;
  }

  shift(): T | undefined {
    const item = this._array.shift();
    this._onArrayModified();
    return item;
  }

  unshift(...items: T[]): this {
    this._array.unshift(...items);
    this._onArrayModified();
    return this;
  }

  splice(start: number, deleteCount?: number, ...items: T[]): T[] {
    const removed = this._array.splice(start, deleteCount ?? 0, ...items);
    this._onArrayModified();
    return removed;
  }

  // ==================== Iteration Support ====================

  [Symbol.iterator](): IterableIterator<T> {
    return this._array[Symbol.iterator]();
  }

  forEach(callback: (value: T, index: number, array: T[]) => void): void {
    this._array.forEach(callback);
  }

  map<U>(callback: (value: T, index: number, array: T[]) => U): RheyArray<U> {
    return new RheyArray(this._array.map(callback));
  }

  filter(
    callback: (value: T, index: number, array: T[]) => boolean
  ): RheyArray<T> {
    return new RheyArray(this._array.filter(callback));
  }

  // ==================== Debugging ====================

  toString(): string {
    return `RheyArray(${this._array.length}) [${this._array.join(", ")}]`;
  }

  valueOf(): T[] {
    return this.array;
  }
}
