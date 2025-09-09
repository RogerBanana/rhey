# Rhey

> **Enhanced array functionality for JavaScript & TypeScript**

A comprehensive library that extends JavaScript arrays with Python-inspired slicing syntax, reactive query capabilities, and advanced object manipulation methods.

## Overview

Rhey emerged from a vision to bridge the gap between JavaScript's native array capabilities and the intuitive data manipulation patterns found in other languages. This library provides a seamless way to work with arrays through familiar syntax while maintaining full TypeScript compatibility and performance optimization.

## Features

- **Python-inspired Slicing**: Negative indexing and range notation (`arr['-1']`, `arr['2:5']`)
- **Reactive Query System**: Self-updating filtered views that maintain consistency
- **Object Array Methods**: Specialized operations for arrays containing objects
- **Smart Properties**: Computed properties for common operations (`.first`, `.last`, `.sum`)
- **Full TypeScript Support**: Complete type safety with generic inference
- **Performance Optimized**: Lazy evaluation and intelligent caching

## Installation

```bash
npm install rhey
```

## Basic Usage

```javascript
import { rhey } from "rhey";

const users = rhey([
  { name: "Alice", age: 25, role: "admin" },
  { name: "Bob", age: 17, role: "user" },
  { name: "Carol", age: 30, role: "admin" },
]);

// Create reactive queries
users.createQuery("adults", (u) => u.age >= 18);
users.createQuery("admins", (u) => u.role === "admin");

console.log(users.query.adults); // [Alice, Carol]

// Queries update automatically when data changes
users.push({ name: "Dave", age: 22, role: "admin" });
console.log(users.query.adults); // [Alice, Carol, Dave]
```

## Slicing Operations

### Basic Slicing

```javascript
const items = rhey([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

// Negative indexing
items[-1];        // 10 (last element)
items["-1"];      // 10 (string notation)

// Range slicing
items["2:5"];     // [3, 4, 5]
items[":3"];      // [1, 2, 3] (first 3 elements)
items["3:"];      // [4, 5, 6, 7, 8, 9, 10] (from index 3)
items["-3:"];     // [8, 9, 10] (last 3 elements)
items[":"];       // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] (full copy)
```

### Object Slicing

For arrays containing objects, Rhey provides query-like syntax:

```javascript
const products = rhey([
  { name: "Laptop", price: 999, category: "tech" },
  { name: "Mouse", price: 25, category: "tech" },
  { name: "Book", price: 15, category: "education" },
]);

// Property-based filtering
products.obj["category:tech"];     // All tech products
products.obj["price<50"];          // Products under $50
products.obj["price>100"];         // Products over $100
products.obj["name:*Laptop*"];     // Names containing "Laptop"

// Combine with regular slicing
products.obj["category:tech"][":1"]; // First tech product
```

## Reactive Query System

The query system maintains filtered views that automatically update when the underlying data changes:

```javascript
const data = rhey([...]);

// Create named queries
data.createQuery("highValue", item => item.value > 1000);
data.createQuery("recent", item => item.date > lastMonth);

// Access current results
console.log(data.query.highValue);
console.log(data.query.recent);

// Data modifications trigger automatic query updates
data.push(newItem);               // All queries refresh
data.splice(0, 1);               // All queries refresh

// Query management
data.deleteQuery("highValue");    // Remove query
data.refreshQuery("recent");      // Force refresh (rarely needed)
```

## Smart Properties

Computed properties provide instant access to common array operations:

```javascript
const numbers = rhey([1, 5, 3, 9, 2, 8]);

numbers.first;      // 1
numbers.last;       // 8
numbers.center;     // [3, 9] (middle elements)
numbers.min;        // 1
numbers.max;        // 9
numbers.sum;        // 28
numbers.average;    // 4.67
numbers.lastIndex;  // 5
```

## Object Array Methods

Specialized methods for working with arrays of objects:

```javascript
const employees = rhey([
  { name: "Alice", dept: "Engineering", salary: 90000 },
  { name: "Bob", dept: "Marketing", salary: 65000 },
  { name: "Carol", dept: "Engineering", salary: 95000 },
]);

// Filtering and searching
employees.obj.filterBy("dept", "Engineering");
employees.obj.findBy("name", "Alice");

// Aggregation
employees.obj.groupBy("dept");
employees.obj.maxBy("salary");
employees.obj.minBy("salary");
employees.obj.sumBy("salary");
employees.obj.averageBy("salary");
employees.obj.countBy("dept");

// Sorting
employees.obj.sortBy("salary", "desc");
employees.obj.sortBy("name"); // ascending by default
```

## Method Chaining

All operations return Rhey instances, enabling fluent method chaining:

```javascript
const result = users
  .obj["role:admin"]           // Filter admins
  .where(u => u.age > 25)      // Additional filtering
  .obj.sortBy("experience")    // Sort by experience
  .first;                      // Get first result

// Chain with queries
users.createQuery("seniorAdmins", u => u.role === "admin" && u.age > 30);
const topSenior = users.query.seniorAdmins.obj.maxBy("experience");
```

## TypeScript Integration

Rhey provides complete type safety with intelligent generic inference:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const users = rhey<User>([...]);

// Full autocomplete and type checking
users.obj.filterBy('active', true);        // ✓ Valid
users.obj.maxBy('age');                     // ✓ Valid
users.createQuery("adults", u => u.age >= 18); // ✓ Valid

// Compile-time error detection
users.obj.filterBy('invalid', true);       // ✗ TypeScript error
users.obj.maxBy('nonexistent');            // ✗ TypeScript error
```

## Performance Characteristics

- **Lazy Evaluation**: Query results computed only when accessed
- **Intelligent Caching**: Results cached with automatic invalidation on data changes
- **Native Method Usage**: Leverages optimized native Array methods where possible
- **Memory Efficiency**: Minimal overhead per Rhey instance
- **Tree Shaking Support**: Import only the methods you need

## API Reference

### Constructor
- `rhey<T>(array: T[])` - Create new Rhey instance

### Core Properties
- `.array: T[]` - Get copy of underlying array
- `.length: number` - Array length
- `.lastIndex: number` - Last valid index

### Smart Properties
- `.first: T` - First element
- `.last: T` - Last element  
- `.center: T | T[]` - Center element(s)
- `.min: T` - Minimum value
- `.max: T` - Maximum value
- `.sum: number` - Sum (numeric arrays)
- `.average: number` - Average (numeric arrays)

### Core Methods
- `.toArray(): T[]` - Get array copy
- `.where(condition: (item: T) => boolean): Rhey<T>` - Filter elements

### Query System
- `.createQuery(name: string, condition: (item: T) => boolean): void`
- `.deleteQuery(name: string): void`
- `.refreshQuery(name: string): void`
- `.query: { [name: string]: Rhey<T> }`

### Object Methods (when T extends object)
- `.obj.filterBy<K extends keyof T>(prop: K, value: T[K]): Rhey<T>`
- `.obj.findBy<K extends keyof T>(prop: K, value: T[K]): T | undefined`
- `.obj.groupBy<K extends keyof T>(prop: K): { [key: string]: Rhey<T> }`
- `.obj.sortBy<K extends keyof T>(prop: K, order?: 'asc' | 'desc'): Rhey<T>`
- `.obj.maxBy<K extends keyof T>(prop: K): T`
- `.obj.minBy<K extends keyof T>(prop: K): T`
- `.obj.sumBy<K extends keyof T>(prop: K): number`
- `.obj.averageBy<K extends keyof T>(prop: K): number`
- `.obj.countBy<K extends keyof T>(prop: K): { [key: string]: number }`

### Native Array Methods
All standard Array methods are available: `push`, `pop`, `shift`, `unshift`, `splice`, `forEach`, `map`, `filter`, `reduce`, `find`, `indexOf`, etc.

## Examples

### Data Analysis
```javascript
const sales = rhey([
  { product: "Laptop", amount: 1200, region: "North", date: "2024-01-15" },
  { product: "Mouse", amount: 25, region: "South", date: "2024-01-16" },
  // ... more data
]);

// Create analytical queries
sales.createQuery("highValue", s => s.amount > 500);
sales.createQuery("recent", s => new Date(s.date) > lastWeek);

// Generate reports
const totalSales = sales.obj.sumBy("amount");
const avgSale = sales.obj.averageBy("amount");
const topProduct = sales.obj.maxBy("amount");
const salesByRegion = sales.obj.groupBy("region");
```

### Complex Filtering
```javascript
const inventory = rhey([...]);

// Multi-step filtering with chaining
const criticalItems = inventory
  .obj["category:electronics"]     // Electronics only
  .where(item => item.stock < 10)  // Low stock
  .obj.sortBy("priority", "desc")  // Sort by priority
  [":5"];                          // Top 5 items

// Dynamic queries
inventory.createQuery("lowStock", item => item.stock < item.minStock);
inventory.createQuery("overstock", item => item.stock > item.maxStock * 2);
```

## License

MIT