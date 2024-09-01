"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EzArray = void 0;
var EzArray = /** @class */ (function (_super) {
    __extends(EzArray, _super);
    function EzArray() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var _this = _super.apply(this, items) || this;
        Object.setPrototypeOf(_this, EzArray.prototype); // Importante per mantenere la corretta ereditarietà
        return _this;
    }
    // Metodo per mischiare l'array
    EzArray.prototype.shuffle = function () {
        var _a;
        for (var i = this.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this[j], this[i]], this[i] = _a[0], this[j] = _a[1];
        }
        return this;
    };
    // Metodo per prendere un elemento a caso (o più elementi)
    EzArray.prototype.pickRandom = function (count) {
        if (count === void 0) { count = 1; }
        if (count <= 0)
            return undefined;
        if (count === 1) {
            return this[Math.floor(Math.random() * this.length)];
        }
        var result = [];
        var clonedArray = __spreadArray([], this, true);
        for (var i = 0; i < count && clonedArray.length > 0; i++) {
            var index = Math.floor(Math.random() * clonedArray.length);
            result.push(clonedArray.splice(index, 1)[0]);
        }
        return result;
    };
    // Metodo per rimuovere un elemento a caso (o più elementi)
    EzArray.prototype.removeRandom = function (count) {
        if (count === void 0) { count = 1; }
        if (count <= 0)
            return undefined;
        var result = [];
        for (var i = 0; i < count && this.length > 0; i++) {
            var index = Math.floor(Math.random() * this.length);
            result.push(this.splice(index, 1)[0]);
        }
        return count === 1 ? result[0] : result;
    };
    // Metodo per aggiungere un elemento all'inizio
    EzArray.prototype.addFirst = function (item) {
        this.unshift(item);
        return this;
    };
    // Metodo per rimuovere il primo elemento
    EzArray.prototype.removeFirst = function () {
        return this.shift();
    };
    // Metodo per aggiungere un elemento alla fine
    EzArray.prototype.addLast = function (item) {
        this.push(item);
        return this;
    };
    // Metodo per rimuovere l'ultimo elemento
    EzArray.prototype.removeLast = function () {
        return this.pop();
    };
    // Metodo per aggiungere più elementi all'inizio
    EzArray.prototype.addItemsFirst = function (items) {
        this.unshift.apply(this, items);
        return this;
    };
    // Metodo per aggiungere più elementi alla fine
    EzArray.prototype.addItemsLast = function (items) {
        this.push.apply(this, items);
        return this;
    };
    EzArray.prototype.filterByProperty = function (property, value) {
        return this.filter(function (item) { return item[property] === value; });
    };
    EzArray.prototype.removeByProperty = function (property, value) {
        return this.filter(function (item) { return item[property] !== value; });
    };
    EzArray.prototype.updateByProperty = function (property, value, update) {
        return this.map(function (item) {
            return item[property] === value ? __assign(__assign({}, item), update) : item;
        });
    };
    EzArray.prototype.groupByProperty = function (property) {
        return this.reduce(function (groups, item) {
            var key = item[property];
            if (!groups[key]) {
                groups[key] = new EzArray();
            }
            groups[key].push(item);
            return groups;
        }, {});
    };
    EzArray.prototype.sortByProperty = function (property, ascending) {
        if (ascending === void 0) { ascending = true; }
        return this.sort(function (a, b) {
            if (a[property] < b[property])
                return ascending ? -1 : 1;
            if (a[property] > b[property])
                return ascending ? 1 : -1;
            return 0;
        });
    };
    EzArray.prototype.findByProperty = function (property, value) {
        return this.find(function (item) { return item[property] === value; });
    };
    EzArray.prototype.pluck = function (property) {
        return this.map(function (item) { return item[property]; });
    };
    EzArray.prototype.uniqueByProperty = function (property) {
        var seen = new Set();
        return this.filter(function (item) {
            var value = item[property];
            if (seen.has(value)) {
                return false;
            }
            else {
                seen.add(value);
                return true;
            }
        });
    };
    EzArray.prototype.extractSubset = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return this.map(function (item) {
            var subset = {};
            properties.forEach(function (prop) {
                subset[prop] = item[prop];
            });
            return subset;
        });
    };
    return EzArray;
}(Array));
exports.EzArray = EzArray;
