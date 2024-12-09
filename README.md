# MDC-Validator

Un validateur de schéma simple et puissant pour JavaScript/TypeScript

## Installation

```bash
npm install mdc-validator
```

## Guide d'utilisation rapide

```typescript
import MDCValidator from 'mdc-validator';

// Exemple de validation d'un formulaire utilisateur
const userSchema = new MDCValidator()
  .string()
  .required()
  .min(3)
  .max(50);

const result = userSchema.validate({
  field_0: 'John'
});

console.log(result);
// { isValid: true, errors: {} }
```

## Types de validation disponibles

### String
```typescript
const schema = new MDCValidator()
  .string()        // Définit le type comme string
  .required()      // Rend le champ obligatoire
  .min(3)         // Longueur minimale
  .max(50)        // Longueur maximale
  .pattern(/^[a-z]+$/i);  // Expression régulière
```

### Number
```typescript
const schema = new MDCValidator()
  .number()
  .required()
  .min(0)     // Valeur minimale
  .max(100);  // Valeur maximale
```

### Boolean
```typescript
const schema = new MDCValidator()
  .boolean()
  .required();
```

## Validation personnalisée

Vous pouvez ajouter vos propres règles de validation :

```typescript
const schema = new MDCValidator()
  .string()
  .custom((value) => {
    if (value === 'mot_interdit') {
      return 'Ce mot n\'est pas autorisé';
    }
    return true;
  });
```

## Exemples pratiques

### Validation d'un email
```typescript
const emailSchema = new MDCValidator()
  .string()
  .required()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

const result = emailSchema.validate({
  field_0: 'test@example.com'
});
```

### Validation d'un mot de passe fort
```typescript
const passwordSchema = new MDCValidator()
  .string()
  .required()
  .min(8)
  .custom((value) => {
    if (!/[A-Z]/.test(value)) {
      return 'Le mot de passe doit contenir au moins une majuscule';
    }
    if (!/[0-9]/.test(value)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    if (!/[!@#$%^&*]/.test(value)) {
      return 'Le mot de passe doit contenir au moins un caractère spécial';
    }
    return true;
  });
```

## Structure des erreurs

Le validateur retourne toujours un objet avec cette structure :

```typescript
{
  isValid: boolean;
  errors: {
    [field: string]: string;
  }
}
```

Exemple avec erreurs :
```typescript
const schema = new MDCValidator()
  .string()
  .required()
  .min(3);

const result = schema.validate({
  field_0: 'a'
});

console.log(result);
// {
//   isValid: false,
//   errors: {
//     field_0: 'La valeur minimale est 3'
//   }
// }
```

## Messages d'erreur personnalisés

Les messages d'erreur par défaut sont en français. Voici les messages standards :

- Required: "Ce champ est requis"
- Type: "Le type doit être {type}"
- Min: "La valeur minimale est {min}"
- Max: "La valeur maximale est {max}"
- Pattern: "La valeur ne correspond pas au format requis"

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## Licence

MIT

## Fonctionnalités avancées

### Nommage explicite des champs
```typescript
const schema = new MDCValidator()
  .field('email')    // Le champ sera identifié comme 'email' au lieu de 'field_0'
  .string()
  .required();
```

### Transformation des valeurs
```typescript
const schema = new MDCValidator()
  .string()
  .transform(value => value.toLowerCase())  // Convertit la valeur en minuscules avant validation
  .pattern(/^[a-z]+$/);
```

### Validation conditionnelle
```typescript
const schema = new MDCValidator()
  .field('password')
  .string()
  .whenField('userType', 'admin', {
    min: 12,  // Pour les admins, mot de passe de 12 caractères minimum
  }, {
    min: 8    // Pour les autres, 8 caractères minimum
  });
```

### Validation de dates
```typescript
const schema = new MDCValidator()
  .date()
  .required()
  .future()           // La date doit être dans le futur
  .dateFormat('YYYY-MM-DD');

// Ou pour une date dans le passé
const birthDateSchema = new MDCValidator()
  .date()
  .past()            // La date doit être dans le passé
  .required();
```

### Validation d'égalité et d'inclusion
```typescript
const schema = new MDCValidator()
  .string()
  .equals('valeur_attendue')    // Doit être exactement égal
  .notEquals('valeur_interdite') // Ne doit pas être égal
  .isIn(['option1', 'option2']) // Doit être l'une de ces valeurs
  .notIn(['interdit1', 'interdit2']); // Ne doit pas être l'une de ces valeurs
```