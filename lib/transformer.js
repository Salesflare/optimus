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
