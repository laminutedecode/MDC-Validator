type ValidationRule = {
    type?: string;
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
    equals?: any;
    notEquals?: any;
    isIn?: any[];
    notIn?: any[];
    transform?: (value: any) => any;
    whenField?: {
        field: string;
        is: any;
        then: ValidationRule;
        otherwise?: ValidationRule;
    };
    dateFormat?: string;
    future?: boolean;
    past?: boolean;
};
export declare class MDCValidator {
    private schema;
    private fieldName;
    constructor();
    field(name: string): this;
    string(): this;
    number(): this;
    boolean(): this;
    date(): this;
    equals(value: any): this;
    notEquals(value: any): this;
    isIn(values: any[]): this;
    notIn(values: any[]): this;
    transform(fn: (value: any) => any): this;
    whenField(field: string, is: any, then: ValidationRule, otherwise?: ValidationRule): this;
    dateFormat(format: string): this;
    future(): this;
    past(): this;
    required(): this;
    min(value: number): this;
    max(value: number): this;
    pattern(regex: RegExp): this;
    custom(fn: (value: any) => boolean | string): this;
    private addRule;
    validate(data: Record<string, any>): {
        isValid: boolean;
        errors: Record<string, string>;
    };
}
export default MDCValidator;
