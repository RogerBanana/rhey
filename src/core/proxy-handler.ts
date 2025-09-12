import type { RheyArray } from './rhey';
import type { SliceNotation, SliceResult } from '../types';

export function createProxyHandler<T>() {
  return {
    get(target: RheyArray<T>, prop: string | symbol): any {
      // Handle numeric indices and string slice notation
      if (
        typeof prop === 'string' &&
        (isNumericIndex(prop) || isSliceNotation(prop))
      ) {
        return handleSlicing(target, prop);
      }

      // Handle negative numeric access like obj[-1]
      if (typeof prop === 'number' && prop < 0) {
        const index = target.array.length + prop;
        return index >= 0 ? target.array[index] : undefined;
      }

      // Regular property access
      return target[prop as keyof RheyArray<T>];
    }
  };
}

/**
 * Check if prop is a numeric index
 */
function isNumericIndex(prop: string): boolean {
  return /^-?\d+$/.test(prop);
}

/**
 * Check if prop is slice notation
 */
function isSliceNotation(prop: string): boolean {
  // Patterns: '2:5', ':3', '3:', ':', '-1:', ':-1', etc.
  return /^-?\d*:-?\d*$/.test(prop) || prop === ':';
}

/**
 * Handle array slicing with Python-like syntax
 */
function handleSlicing<T>(target: RheyArray<T>, prop: string): SliceResult<T> {
  // Handle multiple slices: ':2,5:7,8:'
  if (prop.includes(',')) {
    return handleMultipleSlices(target, prop);
  }

  // Handle single numeric index (including negative)
  if (isNumericIndex(prop)) {
    const index = parseInt(prop);
    if (index < 0) {
      const actualIndex = target.array.length + index;
      return actualIndex >= 0 ? target.array[actualIndex] : undefined;
    }
    return target.array[index];
  }

  // Handle single slice
  return handleSingleSlice(target, prop);
}

/**
 * Handle multiple slice notation: ':2,5:7,8:'
 */
function handleMultipleSlices<T>(target: RheyArray<T>, prop: string): T[][] {
  const slices = prop.split(',').map((s) => s.trim());
  const results: T[][] = [];

  for (const slice of slices) {
    const result = handleSingleSlice(target, slice);
    results.push(Array.isArray(result) ? result : [result]);
  }

  return results;
}

/**
 * Handle single slice notation: '2:5', ':3', '3:', ':'
 */
function handleSingleSlice<T>(target: RheyArray<T>, slice: string): T[] {
  const array = target.array;
  const length = array.length;

  // Full array copy
  if (slice === ':') {
    return [...array];
  }

  const [startStr, endStr] = slice.split(':');

  // Parse start index
  let start: number;
  if (startStr === '') {
    start = 0;
  } else {
    start = parseInt(startStr);
    if (start < 0) start = Math.max(0, length + start);
  }

  // Parse end index
  let end: number;
  if (endStr === '') {
    end = length;
  } else {
    end = parseInt(endStr);
    if (end < 0) end = Math.max(0, length + end);
  }

  // Ensure valid range
  start = Math.max(0, Math.min(start, length));
  end = Math.max(start, Math.min(end, length));

  return array.slice(start, end);
}
