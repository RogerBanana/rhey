import type { RheyArray } from "../core/rhey";
import type { ObjectSlicePattern } from "../types";

export class ObjectHandler<T extends Record<string, any>> {
  constructor(private rheyInstance: RheyArray<T>) {
    return new Proxy(this, {
      get: (target, prop: string) => {
        // Handle magic object slicing like obj['name:Mario']
        if (typeof prop === "string" && this.isSlicePattern(prop)) {
          return this.parseAndFilter(prop);
        }

        // Handle regular method calls
        return target[prop as keyof ObjectHandler<T>];
      },
    });
  }

  /**
   * Check if string matches object slicing pattern
   */
  private isSlicePattern(str: string): boolean {
    return /^[^:]+[:><!=]+[^:]*$/.test(str);
  }

  /**
   * Parse and execute object slice pattern
   */
  private parseAndFilter(pattern: string): RheyArray<T> {
    const { property, operator, value } = this.parseSlicePattern(pattern);

    const filtered = this.rheyInstance.array.filter((item) => {
      const itemValue = item[property];

      switch (operator) {
        case ":":
          return this.handleEquals(itemValue, value);
        case ">":
          return itemValue > this.parseValue(value);
        case "<":
          return itemValue < this.parseValue(value);
        case ">=":
          return itemValue >= this.parseValue(value);
        case "<=":
          return itemValue <= this.parseValue(value);
        case "!=":
          return itemValue !== this.parseValue(value);
        default:
          return false;
      }
    });

    // Return new RheyArray instance
    const RheyConstructor = this.rheyInstance.constructor as new (
      arr: T[]
    ) => RheyArray<T>;
    return new RheyConstructor(filtered);
  }

  /**
   * Parse slice pattern into components
   */
  private parseSlicePattern(pattern: string): {
    property: string;
    operator: string;
    value: string;
  } {
    const operators = [">=", "<=", "!=", ">", "<", ":"];

    for (const op of operators) {
      const index = pattern.indexOf(op);
      if (index !== -1) {
        return {
          property: pattern.slice(0, index),
          operator: op,
          value: pattern.slice(index + op.length),
        };
      }
    }

    throw new Error(`Invalid slice pattern: ${pattern}`);
  }

  /**
   * Handle equals operation with support for multiple values and wildcards
   */
  private handleEquals(itemValue: any, pattern: string): boolean {
    // Multiple values: "category:tech,education,books"
    if (pattern.includes(",")) {
      const values = pattern.split(",").map((v) => v.trim());
      return values.some((val) => this.matchValue(itemValue, val));
    }

    return this.matchValue(itemValue, pattern);
  }

  /**
   * Match value with support for wildcards
   */
  private matchValue(itemValue: any, pattern: string): boolean {
    const strValue = String(itemValue).toLowerCase();
    const strPattern = pattern.toLowerCase();

    // Wildcard matching: *text* (contains), *text (ends with), text* (starts with)
    if (strPattern.includes("*")) {
      const regex = new RegExp(
        strPattern
          .replace(/\*/g, ".*")
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\\\.\\\*/g, ".*")
      );
      return regex.test(strValue);
    }

    // Exact match (case-insensitive for strings)
    return strValue === strPattern;
  }

  /**
   * Parse value to appropriate type
   */
  private parseValue(value: string): any {
    if (value === "true") return true;
    if (value === "false") return false;
    if (value === "null") return null;
    if (value === "undefined") return undefined;

    const num = Number(value);
    if (!isNaN(num)) return num;

    return value;
  }

  // Standard object array methods

  filterBy<K extends keyof T>(property: K, value: T[K]): RheyArray<T> {
    const filtered = this.rheyInstance.array.filter(
      (item) => item[property] === value
    );
    const RheyConstructor = this.rheyInstance.constructor as new (
      arr: T[]
    ) => RheyArray<T>;
    return new RheyConstructor(filtered);
  }

  findBy<K extends keyof T>(property: K, value: T[K]): T | undefined {
    return this.rheyInstance.array.find((item) => item[property] === value);
  }

  groupBy<K extends keyof T>(property: K): Record<string, T[]> {
    const groups: Record<string, T[]> = {};

    for (const item of this.rheyInstance.array) {
      const key = String(item[property]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return groups;
  }

  sortBy<K extends keyof T>(
    property: K,
    order: "asc" | "desc" = "asc"
  ): RheyArray<T> {
    const sorted = [...this.rheyInstance.array].sort((a, b) => {
      const aVal = a[property];
      const bVal = b[property];

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    const RheyConstructor = this.rheyInstance.constructor as new (
      arr: T[]
    ) => RheyArray<T>;
    return new RheyConstructor(sorted);
  }

  countBy<K extends keyof T>(property: K): Record<string, number> {
    const counts: Record<string, number> = {};

    for (const item of this.rheyInstance.array) {
      const key = String(item[property]);
      counts[key] = (counts[key] || 0) + 1;
    }

    return counts;
  }

  maxBy<K extends keyof T>(property: K): T | undefined {
    if (this.rheyInstance.array.length === 0) return undefined;

    return this.rheyInstance.array.reduce((max, item) =>
      item[property] > max[property] ? item : max
    );
  }

  minBy<K extends keyof T>(property: K): T | undefined {
    if (this.rheyInstance.array.length === 0) return undefined;

    return this.rheyInstance.array.reduce((min, item) =>
      item[property] < min[property] ? item : min
    );
  }

  sumBy<K extends keyof T>(property: K): number {
    return this.rheyInstance.array.reduce((sum, item) => {
      const value = item[property];
      return typeof value === "number" ? sum + value : sum;
    }, 0);
  }

  averageBy<K extends keyof T>(property: K): number {
    const sum = this.sumBy(property);
    const count = this.rheyInstance.array.filter(
      (item) => typeof item[property] === "number"
    ).length;

    return count > 0 ? sum / count : 0;
  }
}
