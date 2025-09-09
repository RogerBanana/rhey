# Rhey 🚀

> **Revolutionary array enhancement for JavaScript & TypeScript**

Transform your arrays into powerful, reactive data structures with Python-like slicing, automatic query updates, and magical object manipulation.

## ✨ Features

🐍 **Python-like Slicing** - `arr['-1']`, `arr['2:5']`, `arr['-3:']`  
⚡ **Reactive Queries** - Auto-updating filtered views  
🔮 **Magic Object Slicing** - `users.obj['age>18']`, `products.obj['category:tech']`  
🎯 **Smart Properties** - `.first`, `.last`, `.center`, `.sum`, `.average`  
📦 **Tiny Bundle** - < 8KB minified + gzipped  
🔧 **TypeScript First** - Full type safety with generics  
🌳 **Tree Shakeable** - Import only what you need

## 🚀 Quick Start

```bash
npm install rhey
```

```javascript
import { rhey } from "rhey";

const users = rhey([
  { name: "Alice", age: 25, role: "admin" },
  { name: "Bob", age: 17, role: "user" },
  { name: "Carol", age: 30, role: "admin" },
]);

// Create reactive queries that auto-update
users.createQuery("adults", (u) => u.age >= 18);
users.createQuery("admins", (u) => u.role === "admin");

console.log(users.query.adults); // [Alice, Carol]
console.log(users.query.admins); // [Alice, Carol]

// Add new user - queries update automatically!
users.push({ name: "Dave", age: 22, role: "admin" });
console.log(users.query.adults); // [Alice, Carol, Dave] ✨
```

## 🐍 Python-like Slicing

```javascript
const items = rhey([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

items[-1]; // 10 (last element)
items["-1"]; // 10 (string notation)
items["2:5"]; // [3, 4, 5]
items[":3"]; // [1, 2, 3] (first 3)
items["3:"]; // [4, 5, 6, 7, 8, 9, 10] (from index 3)
items["-3:"]; // [8, 9, 10] (last 3)
items[":"]; // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] (copy)
```

## 🔮 Magic Object Slicing

```javascript
const products = rhey([
  { name: "Laptop", price: 999, category: "tech" },
  { name: "Mouse", price: 25, category: "tech" },
  { name: "Book", price: 15, category: "education" },
]);

// SQL-like filtering with magical syntax
products.obj["category:tech"]; // All tech products
products.obj["price<50"]; // Products under $50
products.obj["price>100"]; // Products over $100
products.obj["name:*Laptop*"]; // Names containing "Laptop"

// Chain with regular slicing
products.obj["category:tech"][":1"]; // First tech product
```

## ⚡ Reactive Query System

The killer feature that makes Rhey revolutionary:

```javascript
const data = rhey([...]);

// Create queries that automatically update
data.createQuery("filtered", item => item.value > 100);
data.createQuery("recent", item => item.date > lastWeek);

// Queries are always fresh
console.log(data.query.filtered);  // Current results
console.log(data.query.recent);    // Current results

// Modify array - queries update instantly
data.push(newItem);               // Queries refresh automatically
data.splice(0, 1);               // Queries refresh automatically

// Query management
data.deleteQuery("filtered");     // Remove query
data.refreshQuery("recent");      // Manual refresh (usually not needed)
```

## 🎯 Smart Properties

```javascript
const numbers = rhey([1, 5, 3, 9, 2, 8]);

numbers.first; // 1
numbers.last; // 8
numbers.center; // [3, 9] (middle elements for even length)
numbers.min; // 1
numbers.max; // 9
numbers.sum; // 28
numbers.average; // 4.67
numbers.lastIndex; // 5
```

## 📊 Object Array Methods

Perfect for data manipulation:

```javascript
const employees = rhey([
  { name: "Alice", dept: "Engineering", salary: 90000 },
  { name: "Bob", dept: "Marketing", salary: 65000 },
  { name: "Carol", dept: "Engineering", salary: 95000 },
]);

employees.obj.filterBy("dept", "Engineering"); // Filter by property
employees.obj.findBy("name", "Alice"); // Find single object
employees.obj.groupBy("dept"); // Group by department
employees.obj.sortBy("salary", "desc"); // Sort by salary
employees.obj.maxBy("salary"); // Highest paid employee
employees.obj.sumBy("salary"); // Total salary cost
employees.obj.averageBy("salary"); // Average salary
```

## 🔄 Method Chaining

Every operation returns a Rhey instance:

```javascript
const result = users.obj["role:admin"] // Magic object slicing
  .where((u) => u.age > 20) // Additional filtering
  .obj.sortBy("age").first; // Sort by age // Get first result

// Works with queries too
users.createQuery("seniorAdmins", (u) => u.role === "admin" && u.age > 30);
const senior = users.query.seniorAdmins.obj.maxBy("experience");
```

## 🔍 Advanced Filtering

```javascript
const data = rhey([10, 15, 20, 25, 30, 35, 40]);

// Slice then filter
data["2:6"].where((x) => x > 20); // [25, 30]
data[":"].where((x) => x % 2 === 0); // [10, 20, 30, 40]
data["-4:"].where((x) => x < 35); // [25, 30]

// Complex object filtering
const filtered = products.obj["price<100"] // Under $100
  .where((p) => p.inStock) // In stock
  .obj.sortBy("rating", "desc"); // Best rated first
```

## 🎨 TypeScript Support

Full type safety with intelligent inference:

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  active: boolean;
}

const users = rhey<User>([...]);

// Full autocomplete and type checking
users.obj.filterBy('active', true);     // ✅
users.obj.maxBy('age');                 // ✅
users.createQuery("adults", u => u.age >= 18); // ✅

// Type errors caught at compile time
users.obj.filterBy('invalid', true);    // ❌ TypeScript error
users.obj.maxBy('nonexistent');         // ❌ TypeScript error
```

## 📈 Performance

Rhey is built for performance:

- **Lazy Query Evaluation** - Queries computed only when accessed
- **Smart Caching** - Results cached with automatic invalidation
- **Native Methods** - Uses optimized native Array methods
- **Memory Efficient** - Minimal overhead per instance
- **Tree Shaking** - Dead code elimination support

## 🛠 API Reference

### Core Methods

- `rhey(array)` - Create new Rhey instance
- `.array` - Get copy of underlying array
- `.toArray()` - Alias for `.array`
- `.where(condition)` - Filter with condition
- `.length` - Array length

### Smart Properties

- `.first` - First element
- `.last` - Last element
- `.center` - Center element(s)
- `.min` - Minimum value
- `.max` - Maximum value
- `.sum` - Sum of numeric values
- `.average` - Average of numeric values
- `.lastIndex` - Last valid index

### Query System

- `.createQuery(name, condition)` - Create reactive query
- `.deleteQuery(name)` - Remove query
- `.refreshQuery(name)` - Manual refresh
- `.query[name]` - Access query results

### Object Methods

- `.obj.filterBy(prop, value)` - Filter by property
- `.obj.findBy(prop, value)` - Find by property
- `.obj.groupBy(prop)` - Group by property
- `.obj.sortBy(prop, order?)` - Sort by property
- `.obj.maxBy(prop)` - Max by property
- `.obj.minBy(prop)` - Min by property
- `.obj.sumBy(prop)` - Sum by property
- `.obj.averageBy(prop)` - Average by property
- `.obj.countBy(prop)` - Count by property

### Array Methods

All native Array methods available: `push`, `pop`, `shift`, `unshift`, `splice`, `forEach`, `map`, `filter`, etc.

## 🗺 Roadmap

**v1.x** - Core Features ✅

- Python slicing & Magic object slicing
- Reactive query system
- Smart properties & Object methods

**v2.x** - Advanced Math (Coming Soon)

- Statistical functions (`median`, `variance`, `stdDev`)
- Matrix operations (`transpose`, `multiply`)
- Element-wise operations (`elementWiseAdd`, `dotProduct`)

**v3.x** - Advanced Utils (Planned)

- Array manipulation (`chunk`, `zip`, `flatten`)
- Advanced random operations (`partition`, `subset`)
- Query combinations & advanced filtering

## 📄 License

MIT © Marco Rossi

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## 💝 Support

If Rhey makes your JavaScript/TypeScript development better, consider:

- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📝 Improving documentation

---

**Made with ❤️ for the JavaScript community**
