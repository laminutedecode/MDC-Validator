import MDCValidator from '../src/index';

// Créer un schéma de validation
const userSchema = new MDCValidator()
  .string()
  .required()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-Z0-9]+$/);

// Valider des données
const result = userSchema.validate({
  field_0: 'John123'
});

console.log(result);
// { isValid: true, errors: {} } 