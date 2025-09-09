import { rhey, RheyArray } from "../src";

describe("Rhey Core Functionality", () => {
  describe("Basic Creation", () => {
    it("should create RheyArray from regular array", () => {
      const arr = rhey([1, 2, 3, 4, 5]);
      expect(arr).toBeInstanceOf(RheyArray);
      expect(arr.array).toEqual([1, 2, 3, 4, 5]);
      expect(arr.length).toBe(5);
    });

    it("should work with empty arrays", () => {
      const arr = rhey([]);
      expect(arr.length).toBe(0);
      expect(arr.array).toEqual([]);
    });
  });

  describe("Smart Properties", () => {
    const numbers = rhey([1, 5, 3, 9, 2, 8]);

    it("should return correct first and last elements", () => {
      expect(numbers.first).toBe(1);
      expect(numbers.last).toBe(8);
      expect(numbers.lastIndex).toBe(5);
    });

    it("should calculate min and max correctly", () => {
      expect(numbers.min).toBe(1);
      expect(numbers.max).toBe(9);
    });

    it("should calculate sum and average correctly", () => {
      expect(numbers.sum).toBe(28);
      expect(numbers.average).toBe(28 / 6);
    });

    it("should handle center element(s)", () => {
      const evenLength = rhey([1, 2, 3, 4]);
      const oddLength = rhey([1, 2, 3, 4, 5]);

      expect(evenLength.center).toEqual([2, 3]);
      expect(oddLength.center).toBe(3);
    });
  });

  describe("Python-like Slicing", () => {
    const arr = rhey([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    it("should handle negative indices", () => {
      expect(arr[-1]).toBe(10);
      expect(arr["-1"]).toBe(10);
      expect(arr[-2]).toBe(9);
    });

    it("should handle basic slicing", () => {
      expect(arr["2:5"]).toEqual([3, 4, 5]);
      expect(arr[":3"]).toEqual([1, 2, 3]);
      expect(arr["3:"]).toEqual([4, 5, 6, 7, 8, 9, 10]);
      expect(arr[":"]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should handle negative slice indices", () => {
      expect(arr["-3:"]).toEqual([8, 9, 10]);
      expect(arr[":-2"]).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(arr["-5:-2"]).toEqual([6, 7, 8]);
    });
  });

  describe("Query System", () => {
    it("should create and maintain reactive queries", () => {
      const users = rhey([
        { name: "Alice", age: 25 },
        { name: "Bob", age: 17 },
        { name: "Carol", age: 30 },
      ]);

      users.createQuery("adults", (u) => u.age >= 18);

      expect(users.query.adults).toHaveLength(2);
      expect(users.query.adults.map((u) => u.name)).toEqual(["Alice", "Carol"]);
    });

    it("should auto-update queries when array changes", () => {
      const nums = rhey([1, 2, 3, 4, 5]);
      nums.createQuery("even", (n) => n % 2 === 0);

      expect(nums.query.even).toEqual([2, 4]);

      nums.push(6, 8);
      expect(nums.query.even).toEqual([2, 4, 6, 8]);

      nums.pop();
      expect(nums.query.even).toEqual([2, 4, 6]);
    });

    it("should handle query management", () => {
      const arr = rhey([1, 2, 3, 4, 5]);

      arr.createQuery("test", (n) => n > 3);
      expect(arr.query.test).toEqual([4, 5]);

      const deleted = arr.deleteQuery("test");
      expect(deleted).toBe(true);
      expect(arr.query.test).toBeUndefined();

      expect(arr.deleteQuery("nonexistent")).toBe(false);
    });
  });

  describe("Object Methods", () => {
    const employees = rhey([
      { name: "Alice", dept: "Engineering", salary: 90000 },
      { name: "Bob", dept: "Marketing", salary: 65000 },
      { name: "Carol", dept: "Engineering", salary: 95000 },
    ]);

    it("should filter by property", () => {
      const engineers = employees.obj.filterBy("dept", "Engineering");
      expect(engineers.length).toBe(2);
      expect(engineers.array.map((e) => e.name)).toEqual(["Alice", "Carol"]);
    });

    it("should find by property", () => {
      const alice = employees.obj.findBy("name", "Alice");
      expect(alice?.salary).toBe(90000);
      expect(employees.obj.findBy("name", "Nonexistent")).toBeUndefined();
    });

    it("should group by property", () => {
      const grouped = employees.obj.groupBy("dept");
      expect(grouped.Engineering).toHaveLength(2);
      expect(grouped.Marketing).toHaveLength(1);
    });

    it("should sort by property", () => {
      const sorted = employees.obj.sortBy("salary", "desc");
      expect(sorted.array[0].name).toBe("Carol");
      expect(sorted.array[2].name).toBe("Bob");
    });

    it("should find min/max by property", () => {
      expect(employees.obj.maxBy("salary")?.name).toBe("Carol");
      expect(employees.obj.minBy("salary")?.name).toBe("Bob");
    });

    it("should calculate sum and average by property", () => {
      expect(employees.obj.sumBy("salary")).toBe(250000);
      expect(employees.obj.averageBy("salary")).toBe(250000 / 3);
    });
  });

  describe("Magic Object Slicing", () => {
    const products = rhey([
      { name: "Laptop", price: 999, category: "tech" },
      { name: "Mouse", price: 25, category: "tech" },
      { name: "Book", price: 15, category: "education" },
    ]);

    it("should handle equality slicing", () => {
      const techProducts = products.obj["category:tech"];
      expect(techProducts.length).toBe(2);
      expect(techProducts.array.every((p) => p.category === "tech")).toBe(true);
    });

    it("should handle comparison slicing", () => {
      const cheap = products.obj["price<50"];
      expect(cheap.length).toBe(2);
      expect(cheap.array.every((p) => p.price < 50)).toBe(true);

      const expensive = products.obj["price>100"];
      expect(expensive.length).toBe(1);
      expect(expensive.array[0].name).toBe("Laptop");
    });
  });

  describe("Where Method", () => {
    it("should filter with where method", () => {
      const numbers = rhey([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      const evens = numbers.where((n) => n % 2 === 0);

      expect(evens.array).toEqual([2, 4, 6, 8, 10]);
      expect(evens).toBeInstanceOf(RheyArray);
    });
  });

  describe("Method Chaining", () => {
    it("should support fluent interface", () => {
      const data = rhey([
        { name: "Alice", score: 95, active: true },
        { name: "Bob", score: 85, active: false },
        { name: "Carol", score: 88, active: true },
      ]);

      const result = data
        .where((item) => item.active)
        .obj.sortBy("score", "desc").first;

      expect(result?.name).toBe("Alice");
    });
  });
});
