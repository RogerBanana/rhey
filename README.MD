# RHey

**RHey** is an advanced JavaScript/TypeScript array utility library that extends the native `Array` class with powerful methods for manipulating and querying arrays, particularly those containing objects. It introduces several innovations like Python-style indexing, condition-based operations, and comprehensive utility functions.

## Installation

```bash
npm install rhey
```

## Importing

```typescript
import { RHey } from "rhey";
```

## Features

### Array Access Enhancements

#### Properties

- **`first`**: Returns the first element in the array.
- **`last`**: Returns the last element in the array.
- **`center`**: Returns the center element(s) in the array. If the array length is odd, it returns the middle element. If even, it returns an array of the two central elements.

#### Python-Style Indexing, Slicing, and Conditional Filtering

- **Negative Indexing**: Access elements from the end of the array using negative indices.
  - `arr[-1]` gives you the last element.
- **Slicing**: Extract a portion of the array using Python-like slicing syntax.
  - `arr['1:3']` returns a new array from index 1 to 2.
  - `arr[':3']` returns a new array from the start to index 2.
  - `arr['-3:']` returns the last three elements.
- **`where(condition: (item: T) => boolean): RHey<T>`**: Filters the sliced array based on a condition, returning a new filtered array.

#### Example

```typescript
const arr = new RHey(1, 2, 3, 4, 5);
console.log(arr.first); // Output: 1
console.log(arr.last); // Output: 5
console.log(arr.center); // Output: 3

console.log(arr[-1]); // Output: 5
console.log(arr["1:3"]); // Output: [2, 3]
console.log(arr[":3"]); // Output: [1, 2, 3]
console.log(arr["-3:"]); // Output: [3, 4, 5]

// Using where to filter after slicing
console.log(arr[":5"].where((item) => item > 2)); // Output: [3, 4, 5]
```

### Basic Array Operations

#### Methods

- **`addFirst(item: T): this`**: Adds an element to the beginning of the array.
- **`addLast(item: T): this`**: Adds an element to the end of the array.
- **`removeFirst(): T | undefined`**: Removes the first element from the array.
- **`removeLast(): T | undefined`**: Removes the last element from the array.
- **`shuffle(): this`**: Shuffles the array in place.
- **`pickRandom(count: number = 1): T | T[] | undefined`**: Picks one or more random elements from the array.
- **`removeRandom(count: number = 1): T | T[] | undefined`**: Removes one or more random elements from the array.

#### Example

```typescript
const arr = new RHey(1, 2, 3, 4, 5);
arr.addFirst(0); // [0, 1, 2, 3, 4, 5]
arr.addLast(6); // [0, 1, 2, 3, 4, 5, 6]
arr.removeFirst(); // [1, 2, 3, 4, 5, 6]
arr.removeLast(); // [1, 2, 3, 4, 5]

arr.shuffle(); // Randomized order
console.log(arr.pickRandom()); // Single random element
console.log(arr.pickRandom(2)); // Two random elements
```

### Advanced Array Manipulations

#### Methods

- **`removeItems(count: number).from(start: number | (item: T) => boolean): RHey<T>`**: Removes a specified number of items starting from a specific index or condition.
- **`getItems(count: number).from(start: number | (item: T) => boolean): RHey<T>`**: Retrieves a specified number of items without modifying the array, starting from a specific index or condition.
- **`insertItems(items: T[]).from(start: number | (item: T) => boolean): this`**: Inserts multiple items at a specific index or condition.
- **`replaceItems(oldItems: T | ((item: T) => boolean)).with(newItems: T | T[]): this`**: Replaces matching items in the array with new items.
- **`moveItems(count: number).from(start: number | (item: T) => boolean).to(target: number | (item: T) => boolean): this`**: Moves a specified number of items within the array from one index/condition to another.

#### Example

```typescript
const arr = new RHey(1, 2, 3, 4, 5);

// Remove 2 items starting from index 1
arr.removeItems(2).from(1); // [1, 4, 5]

// Get 2 items starting from where item equals 4
console.log(arr.getItems(2).from((item) => item === 4)); // [4, 5]

// Insert [9, 10] at index 1
arr.insertItems([9, 10]).from(1); // [1, 9, 10, 4, 5]

// Replace item 4 with [6, 7]
arr.replaceItems(4).with([6, 7]); // [1, 9, 10, 6, 7, 5]

// Move 2 items from index 1 to before item 5
arr
  .moveItems(2)
  .from(1)
  .to((item) => item === 5); // [1, 6, 7, 9, 10, 5]
```

### Object-Oriented Operations

#### Methods

- **`filterByProperty<K extends keyof T>(property: K, value: T[K]): RHey<T>`**: Filters the array by a specific property and value.
- **`removeByProperty<K extends keyof T>(property: K, value: T[K]): RHey<T>`**: Removes elements that match a specific property and value.
- **`updateByProperty<K extends keyof T>(property: K, value: T[K], update: Partial<T>): RHey<T>`**: Updates elements in the array that match a specific property and value.
- **`groupBy<K extends keyof T>(property: K): { [key: string]: RHey<T> }`**: Groups the array by a specific property.
- **`partition(condition: (item: T) => boolean): [RHey<T>, RHey<T>]`**: Partitions the array into two arrays based on a condition.

#### Example

```typescript
const arr = new RHey(
  { id: 1, type: "fruit", name: "apple" },
  { id: 2, type: "vegetable", name: "carrot" },
  { id: 3, type: "fruit", name: "banana" }
);

// Filter by property
console.log(arr.filterByProperty("type", "fruit")); // [{ id: 1, type: 'fruit', name: 'apple' }, { id: 3, type: 'fruit', name: 'banana' }]

// Remove by property
arr.removeByProperty("name", "carrot"); // [{ id: 1, type: 'fruit', name: 'apple' }, { id: 3, type: 'fruit', name: 'banana' }]

// Update by property
arr.updateByProperty("name", "banana", { name: "grape" }); // [{ id: 1, type: 'fruit', name: 'apple' }, { id: 3, type: 'fruit', name: 'grape' }]

// Group by property
console.log(arr.groupBy("type")); // { fruit: [{ id: 1, type: 'fruit', name: 'apple' }, { id: 3, type: 'fruit', name: 'grape' }] }

// Partition by condition
const [fruits, vegetables] = arr.partition((item) => item.type === "fruit");
console.log(fruits); // [{ id: 1, type: 'fruit', name: 'apple' }, { id: 3, type: 'fruit', name: 'grape' }]
```

### Set Operations

#### Methods

- **`union(array: T[]): RHey<T>`**: Performs a union operation with another array.
- **`intersection(array: T[]): RHey<T>`**: Performs an intersection operation with another array.
- **`difference(array: T[]): RHey<T>`**: Performs a difference operation with another array.
- **`differenceBy<K extends keyof T>(array: T[], property: K): RHey<T>`**: Performs a difference operation based on a property with another array.

#### Example

```typescript
const arr1 = new RHey(1, 2, 3, 4);
const arr2 = new RHey(3, 4, 5, 6);

console.log(arr1.union(arr2)); // [1, 2, 3, 4, 5, 6]
console.log(arr1.intersection(arr2)); // [3, 4]
console.log(arr1.difference(arr2)); // [1, 2]
console.log(
  arr1.differenceBy(
    arr2,

    "id"
  )
); // Assumes arrays of objects with 'id' property
```

### Array Transformation and Comprehension

#### Methods

- **`comprehend<U, V>(mapFn: (item: T) => U, filterFn: (item: U) => boolean, reduceFn?: (accumulator: V, item: U) => V, initialValue?: V): U[] | V`**: Applies a map, filter, and optional reduce operation in one step.
- **`flatten(): RHey<unknown>`**: Flattens a nested array structure.
- **`unique(): RHey<T>`**: Removes duplicate elements from the array.

#### Example

```typescript
const arr = new RHey(1, 2, 3, 4, 5);

const result = arr.comprehend(
  (item) => item * 2, // Map: multiply each item by 2
  (item) => item > 4, // Filter: only keep items > 4
  (sum, item) => sum + item, // Reduce: sum the items (optional)
  0 // Initial value for reduce (optional)
);

console.log(result); // 18 (which is 6 + 8 + 4)
```

### Conditional Operations and Utility Methods

#### Methods

- **`pluck<K extends keyof T>(property: K): RHey<T[K]>`**: Extracts the values of a specific property from all elements in the array.
- **`uniqueByProperty<K extends keyof T>(property: K): RHey<T>`**: Removes duplicate elements based on a specific property.
- **`extractSubset<K extends keyof T>(...properties: K[]): RHey<Pick<T, K>>`**: Extracts a subset of properties from each element in the array.
- **`countByPropertyValue<K extends keyof T>(property: K, condition: (value: T[K]) => boolean): number`**: Counts the number of elements that satisfy a condition on a specific property.
- **`chunk(size: number): RHey<RHey<T>>`**: Splits the array into chunks of a specified size.
- **`toObject<K extends keyof any, V>(): { [key in K]: V }`**: Converts an array of key-value pairs into an object.
- **`where(condition: (item: T) => boolean): RHey<T>`**: Filters the array based on a condition, returning a new filtered array.

#### Example

```typescript
const arr = new RHey(
  { id: 1, name: "apple", price: 100 },
  { id: 2, name: "banana", price: 150 },
  { id: 1, name: "apple", price: 100 },
  { id: 3, name: "cherry", price: 200 }
);

// Pluck
console.log(arr.pluck("name")); // ['apple', 'banana', 'apple', 'cherry']

// Unique by property
console.log(arr.uniqueByProperty("id")); // [{ id: 1, name: 'apple', price: 100 }, { id: 2, name: 'banana', price: 150 }, { id: 3, name: 'cherry', price: 200 }]

// Extract subset
console.log(arr.extractSubset("id", "name")); // [{ id: 1, name: 'apple' }, { id: 2, name: 'banana' }, { id: 3, name: 'cherry' }]

// Count by property value
console.log(arr.countByPropertyValue("price", (price) => price > 100)); // 2

// Chunk
console.log(arr.chunk(2)); // [[{ id: 1, name: 'apple' }, { id: 2, name: 'banana' }], [{ id: 3, name: 'cherry' }]]]

// To Object
const keyValueArr = new RHey(["a", 1], ["b", 2]);
console.log(keyValueArr.toObject()); // { a: 1, b: 2 }

// Where
console.log(arr.where((item) => item.price > 100)); // [{ id: 2, name: 'banana', price: 150 }, { id: 3, name: 'cherry', price: 200 }]
```

## Contribution

Contributions are welcome! If you have suggestions, issues, or improvements, feel free to open an issue or submit a pull request.

## License

RHey is licensed under the MIT License.
