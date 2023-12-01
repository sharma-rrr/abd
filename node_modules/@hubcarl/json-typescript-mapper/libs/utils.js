"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayOrArrayClass = exports.isPrimitiveOrPrimitiveClass = exports.isTargetType = void 0;
function isTargetType(val, type) {
    return typeof val === type;
}
exports.isTargetType = isTargetType;
function isPrimitiveOrPrimitiveClass(obj) {
    return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
        obj instanceof Number || obj === Number ||
        obj instanceof Boolean || obj === Boolean));
}
exports.isPrimitiveOrPrimitiveClass = isPrimitiveOrPrimitiveClass;
function isArrayOrArrayClass(clazz) {
    if (clazz === Array) {
        return true;
    }
    return Object.prototype.toString.call(clazz) === '[object Array]';
}
exports.isArrayOrArrayClass = isArrayOrArrayClass;
//# sourceMappingURL=utils.js.map