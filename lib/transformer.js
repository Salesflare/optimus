// @ts-check
'use strict';

/**
 * @typedef {Object} Rule
 * @property {String} Rule.id
 * @property {String} [Rule.query_builder_id]
 * @property {String} Rule.operator
 * @property {any | any[]} Rule.value
 * @property {String} [Rule.entity]
 * @property {String} [Rule.input]
 * @property {String} [Rule.label]
 * @property {String} [Rule.type]
 * @property {any | any[]} [Rule.value1]
 * @property {any | any[]} [Rule.value2]
 */

const internals = {
    transformers: [
        /**
         *
         * @param {Rule} rule
         * @returns {Rule} rule
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
         * @param {Rule} rule
         * @returns {Rule} rule
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
        /**
         *
         * @param {Rule} rule
         * @returns {Rule} rule
         */
        function transformValuesForBetweenOperator(rule) {

            if (rule.operator === 'between' || rule.operator === 'not_between') {
                let value1;
                let value2;

                // Able to handle client and server side
                if (rule.value !== undefined && rule.value[0] !== undefined
                    && (rule.value[0].value1 !== undefined || rule.value[0].value2 !== undefined)) {

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
                if (value1 !== undefined && value1 !== null
                    && value2 !== undefined && value2 !== null) {

                    rule.value = [value1,value2];
                }
                else if ((value1 === undefined && value2 === undefined)) {
                    // The original values are already accepted
                    return rule;
                }
                else {
                    rule.value = [];
                }
            }

            return rule;
        },
        /**
         *
         * @param {Rule} rule
         * @returns {Rule} rule
         */
        function queryBuilderId(rule) {

            if (rule.entity && !rule.query_builder_id) {
                rule.query_builder_id = rule.id;
            }

            return rule;
        },
        /**
         *
         * @param {Rule} rule
         * @returns {Rule} rule
         */
        function fixCustomId(rule) {

            if (rule.id.startsWith('count custom.')) {
                rule.id = `count ${rule.id.split(/ (.*)/)[1].replace(/ /g, '_').toLowerCase()}`;
            }

            if (rule.id.startsWith('custom.')) {
                rule.id = rule.id.replace(/ /g, '_').toLowerCase();
            }

            if (rule.entity) {
                rule.query_builder_id = rule.id;
            }

            return rule;
        }
    ]
};

/**
 * Transform filter object from older version to newest version
 *
 * @param {Object} filtersObject
 * @param {Rule[]} filtersObject.rules
 * @returns {{ rules: Rule[] }} transformed filter object
 */
exports.transform = internals.transform = (filtersObject) => {

    const transformed = { ...filtersObject };
    internals.transformers.forEach((transformer) => {

        transformed.rules = transformed.rules.map(transformer);
    });

    return transformed;
};
