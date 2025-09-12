// Core types
export type RheyItem = any;
export type QueryCondition<T> = (item: T) => boolean;

// Query system types
export interface QueryDefinition<T> {
  condition: QueryCondition<T>;
  cache: T[];
  lastUpdated: number;
}

export interface QueryRegistry<T> {
  [queryName: string]: T[];
}

// Slicing types
export type SliceNotation = string | number;
export type SliceResult<T> = T | T[] | T[][] | undefined;

// Object slicing types
export type ObjectSliceOperator = ':' | '>' | '<' | '>=' | '<=' | '!=';
export type ObjectSlicePattern = `${string}${ObjectSliceOperator}${string}`;

// Forward declaration for circular reference
export declare class RheyArray<T = any> {
  constructor(array: T[]);
}

// Property access types for objects
export interface ObjectArrayMethods<T extends Record<string, any>> {
  filterBy<K extends keyof T>(property: K, value: T[K]): RheyArray<T>;
  findBy<K extends keyof T>(property: K, value: T[K]): T | undefined;
  groupBy<K extends keyof T>(property: K): Record<string, T[]>;
  sortBy<K extends keyof T>(property: K, order?: 'asc' | 'desc'): RheyArray<T>;
  countBy<K extends keyof T>(property: K): Record<string, number>;
  maxBy<K extends keyof T>(property: K): T | undefined;
  minBy<K extends keyof T>(property: K): T | undefined;
  sumBy<K extends keyof T>(property: K): number;
  averageBy<K extends keyof T>(property: K): number;
}

// Main class interface
export interface IRheyArray<T> {
  // Core properties
  readonly array: T[];
  readonly length: number;

  // Smart properties
  readonly first: T | undefined;
  readonly last: T | undefined;
  readonly center: T | T[] | undefined;
  readonly min: T | undefined;
  readonly max: T | undefined;
  readonly sum: number;
  readonly average: number;
  readonly lastIndex: number;

  // Query system
  readonly query: QueryRegistry<T>;
  createQuery(name: string, condition: QueryCondition<T>): RheyArray<T>;
  deleteQuery(name: string): boolean;
  refreshQuery(name: string): RheyArray<T>;
  refreshAllQueries(): RheyArray<T>;

  // Object methods (when T extends object)
  readonly obj: T extends Record<string, any> ? ObjectArrayMethods<T> : never;

  // Utility methods
  where(condition: QueryCondition<T>): RheyArray<T>;
  toArray(): T[];
}
