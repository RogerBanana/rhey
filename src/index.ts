// Main exports
export { RheyArray } from "./core/rhey";
export * from "./types";

// Import for internal use
import { RheyArray } from "./core/rhey";

// Factory function for creating Rhey arrays
export function rhey<T = any>(array: T[]): RheyArray<T> {
  return new RheyArray(array);
}

// Default export for convenience
export default rhey;
