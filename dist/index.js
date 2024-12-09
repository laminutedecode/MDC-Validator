"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDCValidator = void 0;
var MDCValidator = /** @class */ (function () {
    function MDCValidator() {
        this.fieldName = null;
        this.schema = {};
    }
    MDCValidator.prototype.field = function (name) {
        this.fieldName = name;
        return this;
    };
    MDCValidator.prototype.string = function () {
        return this.addRule({ type: 'string' });
    };
    MDCValidator.prototype.number = function () {
        return this.addRule({ type: 'number' });
    };
    MDCValidator.prototype.boolean = function () {
        return this.addRule({ type: 'boolean' });
    };
    MDCValidator.prototype.date = function () {
        return this.addRule({ type: 'date' });
    };
    MDCValidator.prototype.equals = function (value) {
        this.schema[Object.keys(this.schema).pop()].equals = value;
        return this;
    };
    MDCValidator.prototype.notEquals = function (value) {
        this.schema[Object.keys(this.schema).pop()].notEquals = value;
        return this;
    };
    MDCValidator.prototype.isIn = function (values) {
        this.schema[Object.keys(this.schema).pop()].isIn = values;
        return this;
    };
    MDCValidator.prototype.notIn = function (values) {
        this.schema[Object.keys(this.schema).pop()].notIn = values;
        return this;
    };
    MDCValidator.prototype.transform = function (fn) {
        this.schema[Object.keys(this.schema).pop()].transform = fn;
        return this;
    };
    MDCValidator.prototype.whenField = function (field, is, then, otherwise) {
        this.schema[Object.keys(this.schema).pop()].whenField = {
            field: field,
            is: is,
            then: then,
            otherwise: otherwise
        };
        return this;
    };
    MDCValidator.prototype.dateFormat = function (format) {
        this.schema[Object.keys(this.schema).pop()].dateFormat = format;
        return this;
    };
    MDCValidator.prototype.future = function () {
        this.schema[Object.keys(this.schema).pop()].future = true;
        return this;
    };
    MDCValidator.prototype.past = function () {
        this.schema[Object.keys(this.schema).pop()].past = true;
        return this;
    };
    MDCValidator.prototype.required = function () {
        this.schema[Object.keys(this.schema).pop()].required = true;
        return this;
    };
    MDCValidator.prototype.min = function (value) {
        this.schema[Object.keys(this.schema).pop()].min = value;
        return this;
    };
    MDCValidator.prototype.max = function (value) {
        this.schema[Object.keys(this.schema).pop()].max = value;
        return this;
    };
    MDCValidator.prototype.pattern = function (regex) {
        this.schema[Object.keys(this.schema).pop()].pattern = regex;
        return this;
    };
    MDCValidator.prototype.custom = function (fn) {
        this.schema[Object.keys(this.schema).pop()].custom = fn;
        return this;
    };
    MDCValidator.prototype.addRule = function (rule) {
        var fieldName = this.fieldName || "field_".concat(Object.keys(this.schema).length);
        this.schema[fieldName] = rule;
        this.fieldName = null;
        return this;
    };
    MDCValidator.prototype.validate = function (data) {
        var errors = {};
        Object.entries(this.schema).forEach(function (_a) {
            var field = _a[0], rules = _a[1];
            var value = data[field];
            if (rules.transform) {
                value = rules.transform(value);
            }
            if (rules.whenField) {
                var _b = rules.whenField, dependentField = _b.field, is = _b.is, then = _b.then, otherwise = _b.otherwise;
                var dependentValue = data[dependentField];
                if (dependentValue === is) {
                    Object.assign(rules, then);
                }
                else if (otherwise) {
                    Object.assign(rules, otherwise);
                }
            }
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors[field] = 'Ce champ est requis';
                return;
            }
            if (value !== undefined && value !== null) {
                if (rules.type) {
                    if (rules.type === 'date' && !(value instanceof Date) && isNaN(Date.parse(value))) {
                        errors[field] = 'Le format de date est invalide';
                        return;
                    }
                    else if (rules.type !== 'date' && typeof value !== rules.type) {
                        errors[field] = "Le type doit \u00EAtre ".concat(rules.type);
                        return;
                    }
                }
                if (rules.equals !== undefined && value !== rules.equals) {
                    errors[field] = "La valeur doit \u00EAtre \u00E9gale \u00E0 ".concat(rules.equals);
                }
                if (rules.notEquals !== undefined && value === rules.notEquals) {
                    errors[field] = "La valeur ne doit pas \u00EAtre \u00E9gale \u00E0 ".concat(rules.notEquals);
                }
                if (rules.isIn && !rules.isIn.includes(value)) {
                    errors[field] = "La valeur doit \u00EAtre l'une des suivantes: ".concat(rules.isIn.join(', '));
                }
                if (rules.notIn && rules.notIn.includes(value)) {
                    errors[field] = "La valeur ne doit pas \u00EAtre l'une des suivantes: ".concat(rules.notIn.join(', '));
                }
                if (rules.type === 'date') {
                    var dateValue = new Date(value);
                    if (rules.future && dateValue <= new Date()) {
                        errors[field] = 'La date doit être dans le futur';
                    }
                    if (rules.past && dateValue >= new Date()) {
                        errors[field] = 'La date doit être dans le passé';
                    }
                }
                if (rules.min && (value.length < rules.min || value < rules.min)) {
                    errors[field] = "La valeur minimale est ".concat(rules.min);
                }
                if (rules.max && (value.length > rules.max || value > rules.max)) {
                    errors[field] = "La valeur maximale est ".concat(rules.max);
                }
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors[field] = "La valeur ne correspond pas au format requis";
                }
                if (rules.custom) {
                    var customResult = rules.custom(value);
                    if (customResult !== true) {
                        errors[field] = typeof customResult === 'string' ? customResult : 'Validation personnalisée échouée';
                    }
                }
            }
        });
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    };
    return MDCValidator;
}());
exports.MDCValidator = MDCValidator;
exports.default = MDCValidator;
