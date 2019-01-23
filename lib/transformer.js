// @ts-check
'use strict';

/**
 * @typedef {Object} Rule
 * @property {String} Rule.id
 * @property {String} [Rule.query_builder_id]
 * @property {String | OperatorObject} Rule.operator
 * @property {any | any[]} Rule.value
 * @property {String} [Rule.display_entity]
 * @property {String} [Rule.entity]
 * @property {String} [Rule.input]
 * @property {String} [Rule.label]
 * @property {String} [Rule.type]
 * @property {any | any[]} [Rule.value1]
 * @property {any | any[]} [Rule.value2]
 */

/**
 * @typedef {Object} Filter
 * @property {(Rule|Filter)[]} [Filter.rules]
 * @property {String} [Filter.condition]
 */

/**
  * Deprecated operator object that was used in earlier advanced filter versions
  * Has been replaced by a single string
  * @typedef {Object} OperatorObject
  * @property {String} key
  * @property {String} value
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

            // The operator could still be an object, used in earlier versions of advanced filters
            const operatorString = rule.operator && /**@type {OperatorObject} */(rule.operator).key ? /**@type {OperatorObject} */(rule.operator).key : /**@type {String} */(rule.operator) || '';

            if (Object.keys(operatorTransformations).includes(operatorString)) {
                const matchedTransform = operatorTransformations[operatorString];
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
        function transformCampaignRules(rule) {

            if (rule.display_entity === 'Campaign' && rule.entity === 'person') {
                rule.entity = 'campaign';
            }

            return rule;

        },
        /**
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
 * @param {Filter} filtersObject
 * @param {(Rule|Filter)[]} filtersObject.rules
 * @returns {Filter} transformed filter object
 */
exports.transform = internals.transform = (filtersObject) => {

    const transformed = { ...filtersObject };

    internals.transformers.forEach((transformer) => {

        transformed.rules = transformed.rules.map((ruleObject) => {

            /** @type {Filter} */
            const filterObject = (ruleObject);
            /** @type {Rule} */
            const ruleObjectCast = (ruleObject);

            if ((filterObject.rules === undefined
                || filterObject.condition === undefined )
            && ruleObjectCast.id === undefined) {

                // This should never happen
                throw new Error('Invalid filter object');
            }
            else if (ruleObjectCast.id === undefined) {
                return internals.transform(ruleObject);
            }

            return transformer(/** @type {Rule} */(ruleObject));
        });
    });

    return transformed;
};
