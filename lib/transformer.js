'use strict';

const internals = {
    transformers: [
        /**
         *
         * @param {Object} rule
         * @param {String} rule.id
         * @param {String} rule.operator
         * @param {any | any[]} rule.value
         * @returns {Object} rule
         */
        function personType(rule) {

            if (rule.id === 'person-customer.customers' || rule.id === 'person-contact.my-contacts') {
                return {
                    id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [rule.id === 'person-customer.customers' ? 2 : 1]
                };
            }

            return rule;
        },
        /**
         *
         * @param {Object} rule
         * @param {String} rule.id
         * @param {String} rule.operator
         * @param {any | any[]} rule.value
         * @returns {Object} rule
         */
        function booleanOperator(rule) {

            const operatorTransformations = {
                'is_empty': {
                    operator: 'equal',
                    value: ['']
                },
                'is_not_empty': {
                    operator: 'not_equal',
                    value: ['']
                },
                'is_null': {
                    operator: 'equal',
                    value: ['null']
                },
                'is_not_null': {
                    operator: 'not_equal',
                    value: ['null']
                },
                'true': {
                    operator: 'equal',
                    value: ['true']
                },
                'false': {
                    operator: 'equal',
                    value: ['false']
                }
            };

            if (Object.keys(operatorTransformations).includes(rule.operator)) {
                const matchedTransform = operatorTransformations[rule.operator];
                rule.operator = matchedTransform.operator;
                rule.value = matchedTransform.value;
            }

            return rule;
        }
    ]
};

/**
 * Transform filter object from older version to newest version
 *
 * @param {Object} filtersObject
 * @param {Object[]} filtersObject.rules
 * @returns {Object} transformed filter object
 */
exports.transform = internals.transform = (filtersObject) => {

    const transformed = { ...filtersObject };
    internals.transformers.forEach((transformer) => {

        transformed.rules = transformed.rules.map(transformer);
    });

    return transformed;
};
