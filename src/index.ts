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

export class MDCValidator {
  private schema: Record<string, ValidationRule>;
  private fieldName: string | null = null;

  constructor() {
    this.schema = {};
  }

  field(name: string) {
    this.fieldName = name;
    return this;
  }

  string() {
    return this.addRule({ type: 'string' });
  }

  number() {
    return this.addRule({ type: 'number' });
  }

  boolean() {
    return this.addRule({ type: 'boolean' });
  }

  date() {
    return this.addRule({ type: 'date' });
  }

  equals(value: any) {
    this.schema[Object.keys(this.schema).pop() as string].equals = value;
    return this;
  }

  notEquals(value: any) {
    this.schema[Object.keys(this.schema).pop() as string].notEquals = value;
    return this;
  }

  isIn(values: any[]) {
    this.schema[Object.keys(this.schema).pop() as string].isIn = values;
    return this;
  }

  notIn(values: any[]) {
    this.schema[Object.keys(this.schema).pop() as string].notIn = values;
    return this;
  }

  transform(fn: (value: any) => any) {
    this.schema[Object.keys(this.schema).pop() as string].transform = fn;
    return this;
  }

  whenField(field: string, is: any, then: ValidationRule, otherwise?: ValidationRule) {
    this.schema[Object.keys(this.schema).pop() as string].whenField = {
      field,
      is,
      then,
      otherwise
    };
    return this;
  }

  dateFormat(format: string) {
    this.schema[Object.keys(this.schema).pop() as string].dateFormat = format;
    return this;
  }

  future() {
    this.schema[Object.keys(this.schema).pop() as string].future = true;
    return this;
  }

  past() {
    this.schema[Object.keys(this.schema).pop() as string].past = true;
    return this;
  }

  required() {
    this.schema[Object.keys(this.schema).pop() as string].required = true;
    return this;
  }

  min(value: number) {
    this.schema[Object.keys(this.schema).pop() as string].min = value;
    return this;
  }

  max(value: number) {
    this.schema[Object.keys(this.schema).pop() as string].max = value;
    return this;
  }

  pattern(regex: RegExp) {
    this.schema[Object.keys(this.schema).pop() as string].pattern = regex;
    return this;
  }

  custom(fn: (value: any) => boolean | string) {
    this.schema[Object.keys(this.schema).pop() as string].custom = fn;
    return this;
  }

  private addRule(rule: ValidationRule) {
    const fieldName = this.fieldName || `field_${Object.keys(this.schema).length}`;
    this.schema[fieldName] = rule;
    this.fieldName = null;
    return this;
  }

  validate(data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    Object.entries(this.schema).forEach(([field, rules]) => {
      let value = data[field];

      if (rules.transform) {
        value = rules.transform(value);
      }

      if (rules.whenField) {
        const { field: dependentField, is, then, otherwise } = rules.whenField;
        const dependentValue = data[dependentField];
        
        if (dependentValue === is) {
          Object.assign(rules, then);
        } else if (otherwise) {
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
          } else if (rules.type !== 'date' && typeof value !== rules.type) {
            errors[field] = `Le type doit être ${rules.type}`;
            return;
          }
        }

        if (rules.equals !== undefined && value !== rules.equals) {
          errors[field] = `La valeur doit être égale à ${rules.equals}`;
        }

        if (rules.notEquals !== undefined && value === rules.notEquals) {
          errors[field] = `La valeur ne doit pas être égale à ${rules.notEquals}`;
        }

        if (rules.isIn && !rules.isIn.includes(value)) {
          errors[field] = `La valeur doit être l'une des suivantes: ${rules.isIn.join(', ')}`;
        }

        if (rules.notIn && rules.notIn.includes(value)) {
          errors[field] = `La valeur ne doit pas être l'une des suivantes: ${rules.notIn.join(', ')}`;
        }

        if (rules.type === 'date') {
          const dateValue = new Date(value);
          
          if (rules.future && dateValue <= new Date()) {
            errors[field] = 'La date doit être dans le futur';
          }

          if (rules.past && dateValue >= new Date()) {
            errors[field] = 'La date doit être dans le passé';
          }
        }

        if (rules.min && (value.length < rules.min || value < rules.min)) {
          errors[field] = `La valeur minimale est ${rules.min}`;
        }

        if (rules.max && (value.length > rules.max || value > rules.max)) {
          errors[field] = `La valeur maximale est ${rules.max}`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `La valeur ne correspond pas au format requis`;
        }

        if (rules.custom) {
          const customResult = rules.custom(value);
          if (customResult !== true) {
            errors[field] = typeof customResult === 'string' ? customResult : 'Validation personnalisée échouée';
          }
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default MDCValidator; 