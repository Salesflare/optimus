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
                    value: ['null']
                },
                'is_not_empty': {
                    operator: 'not_equal',
                    value: ['null']
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
        },
        function transformValuesForBetweenOperator(rule) {

            if ((rule.operator === 'between' || rule.operator === 'not_between')) {

                let value1;
                let value2;

                // Able to handle client and server side
                if (typeof rule.value !== 'undefined' && typeof rule.value[0] !== 'undefined'
                    && (typeof rule.value[0].value1 !== 'undefined' || typeof rule.value[0].value2 !== 'undefined')) {

                    value1 = rule.value[0].value1;
                    value2 = rule.value[0].value2;
                    delete rule.value[0].value1;
                    delete rule.value[0].value2;
                }
                else {
                    value1 = rule.value1;
                    value2 = rule.value2;
                    delete rule.value1;
                    delete rule.value2;
                }

                // Depending on the current values, we reformat the values a certain way
                if (typeof value1 !== 'undefined' && value1 !== null
                    && typeof value2 !== 'undefined' && value2 !== null) {

                    rule.value = [value1,value2];
                }
                else if ((typeof value1 === 'undefined' && typeof value2 === 'undefined')) {
                    // The original values are already accepted
                    return rule;
                }
                else {
                    rule.value = [];
                }
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
