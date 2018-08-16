import Ajv from 'ajv';
const ajv = new Ajv({ jsonPointers: true });
import pointer from 'json-pointer';
import schema from './schema.json';

const validate = (schema, data) =>
    ajv.validate(schema, data)
        ? []
        : ajv.errors;

const buildHumanErrors = (errors) =>
    errors.map((error) => {
        if (error.params.missingProperty) {
            const property = pointer.get(schema, `/properties/${error.params.missingProperty}`);
            return `${property.title} is a required field`;
        }

        const property = pointer.get(schema, `/properties${error.dataPath}`);

        if (error.keyword == 'format' && property.example) {
            return `${property.title} is in an invalid format, e.g: ${property.example}`;
        }

        return `${property.title} ${error.message}`;
    });

[
    {},
    { name: 'Lucrezia Nethersole', email: 'not-an-email' },
    { name: 'Lucrezia Nethersole', date_of_birth: 'n/a' },
    { name: 'Lucrezia Nethersole Has Many Many Names' }
].forEach(function(input) {
    console.log(
        buildHumanErrors(validate(schema, input))
    );
});
