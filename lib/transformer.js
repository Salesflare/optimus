// @ts-check
'use strict';

/**
 * @typedef {Object} Rule
 * @property {String} id
 * @property {String} [query_builder_id]
 * @property {String | OperatorObject} operator
 * @property {any | any[]} value
 * @property {String} [display_entity]
 * @property {String} [entity]
 * @property {String} [input]
 * @property {String} [label]
 * @property {String} [type]
 * @property {any | any[]} [value1]
 * @property {any | any[]} [value2]
 */

/**
 * @typedef {Object} Filter
 * @property {(Rule|Filter)[]} [rules]
 * @property {String} [condition]
 */

/**
 * Deprecated operator object that was used in earlier advanced filter versions
 * Has been replaced by a single string
 *
 * @typedef {Object} OperatorObject
 * @property {String} key
 * @property {String} value
 */

const internals = {
    oldFilterIds: new Map([
        ['person.id', 'contact.id'],
        ['position.role', 'contact.position.role'],
        ['account-contact.account', 'contact.account.id'],
        ['person.firstname', 'contact.firstname'],
        ['person.lastname', 'contact.lastname'],
        ['person.name', 'contact.name'],
        ['person.prefix', 'contact.prefix'],
        ['person.suffix', 'contact.suffix'],
        ['person.middle', 'contact.middle'],
        ['person.email', 'contact.email'],
        ['person.modification_date', 'contact.modification_date'],
        ['person.creation_date', 'contact.creation_date'],
        // ['person-chat.client', 'person-chat.client'],
        ['person-chat.handle', 'contact.skype'],
        ['person-phone_number.normalized_number', 'contact.phone_number.number'],
        ['person-social_profile.username', 'contact.social_profile.username'],
        ['person-social_profile.type', 'contact.social_profile.type'],
        ['person-social_profile.url', 'contact.social_profile.url'],
        ['person-tag.id', 'contact.tag.id'],
        ['person-address.city', 'contact.address.city'],
        ['person-address.country', 'contact.address.country'],
        ['person-address.state_region', 'contact.address.state_region'],
        ['person-type.id', 'contact.type'],
        ['campaign.id', 'campaign.id'],
        ['campaign.name', 'campaign.name'],
        ['campaign-email.sent_status', 'campaign.received'],
        ['email_open.id', 'campaign.opened'],
        ['interactiongroup.id', 'campaign.clicked'],
        ['campaign.creator', 'campaign.created_by.id'],
        ['campaign.type', 'campaign.type'],
        ['campaign.status', 'campaign.status'],
        ['count campaign_email', 'campaign.count'],
        ['account.name', 'account.name'],
        ['account.hotness', 'account.hotness'],
        ['account.size', 'account.size'],
        ['account.owner', 'account.owner.id'],
        ['account.website', 'account.website'],
        ['account.description', 'account.description'],
        ['account.last_interaction_date', 'account.last_interaction_date'],
        ['account.creation_date', 'account.creation_date'],
        ['account-email_address.email', 'account.email_address.email'],
        ['account-phone_number.normalized_number', 'account.phone_number.number'],
        ['account-social_profile.username', 'account.social_profile.username'],
        ['account-social_profile.type', 'account.social_profile.type'],
        ['account-social_profile.url', 'account.social_profile.url'],
        ['account-user.user', 'account.team_member.id'],
        ['account-contact.contact', 'account.contact.id'],
        ['account-tag.id', 'account.tag.id'],
        ['account-address.city', 'account.address.city'],
        ['account-address.country', 'account.address.country'],
        ['account-address.state_region', 'account.address.state_region'],
        ['count account_contact', 'account.contact.count'],
        ['count opportunity', 'account.opportunity.count'],
        ['count task', 'account.task.count'],
        ['opportunity.account', 'opportunity.account.id'],
        ['opportunity.owner', 'opportunity.owner.id'],
        ['opportunity.creator', 'opportunity.created_by.id'],
        ['opportunity.assignee', 'opportunity.assignee.id'],
        ['opportunity.stage', 'opportunity.stage.id'],
        ['opportunity.value', 'opportunity.value'],
        ['opportunity.close_date', 'opportunity.close_date'],
        ['pipeline.id', 'opportunity.pipeline.id'],
        ['opportunity.name', 'opportunity.name'],
        ['opportunity.frequency', 'opportunity.frequency'],
        ['opportunity.units', 'opportunity.units'],
        ['opportunity.contract_start_date', 'opportunity.contract_start_date'],
        ['opportunity.contract_end_date', 'opportunity.contract_end_date'],
        ['opportunity.recurring_price_per_unit', 'opportunity.recurring_price_per_unit'],
        ['opportunity.closed', 'opportunity.closed'],
        ['opportunity.creation_date', 'opportunity.creation_date'],
        ['opportunity-tag.id', 'opportunity.tag.id'],
        ['opportunity.done', 'opportunity.done'],
        ['campaign.name', 'campaign.name'],
        ['campaign.subject', 'campaign.subject'],
        ['campaign.body', 'campaign.body'],
        ['campaign.creator', 'campaign.created_by.id'],
        ['campaign.type', 'campaign.type'],
        ['campaign.schedule_date', 'campaign.schedule_date'],
        ['campaign.status', 'campaign.status'],
        ['campaign.creation_date', 'campaign.creation_date'],
        ['calculated emails_sent', 'campaign.total_sent'],
        ['calculated emails_opened', 'campaign.total_opened'],
        ['calculated emails_clicked', 'campaign.total_clicked'],
        ['campaign-opened.contact', 'campaign.opened_by.id'],
        ['campaign-clicked.contact', 'campaign.clicked_by.id'],
        ['campaign_email.contact', 'campaign.contact.id'],
        ['task.type', 'task.type'],
        ['task.account', 'task.account.id'],
        ['task.creator', 'task.created_by.id'],
        ['task.reminder_date', 'task.reminder_date'],
        ['task.completed', 'task.completed'],
        ['task.completion_date', 'task.completion_date'],
        ['task.completor', 'task.completed_by'],
        ['task.creation_date', 'task.creation_date'],
        ['task_assignee.assignee', 'task.assignee.id'],
        ['task.description', 'task.description']
    ]),
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
                if (internals.oldFilterIds.get(rule.id)
                    || rule.id.startsWith('count custom.')
                    || rule.id.startsWith('custom.')
                ) {
                    rule.query_builder_id = rule.id;
                }
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
                if (internals.oldFilterIds.get(rule.id)
                    || rule.id.startsWith('count custom.')
                    || rule.id.startsWith('custom.')
                ) {
                    rule.query_builder_id = rule.id;
                }
            }

            return rule;
        },
        /**
         * The function needs to transform rules that have the new format but still have an old rule id.
         *
         * @param {Rule} rule
         * @returns {Rule} rule
         */
        function transformOldIds(rule) {


            if (!rule.entity && !rule.query_builder_id) {
                const newId = internals.oldFilterIds.get(rule.id);

                if (newId !== undefined) {
                    rule.id = newId;
                }
            }
            else if (!rule.entity) {
                // This should never happen
                throw new Error('Invalid filter object');
            }

            return rule;
        },
        function transformCampaignMailSentStatus(rule) {

            if (rule.id === 'campaign.received' && rule.type === 'boolean' && Array.isArray(rule.value)) {

                if (rule.value[0] === 'true') {
                    rule.value = 'sent';
                }
                else if (rule.value[0] === 'false') {
                    rule.value = 'not_sent';
                }
                else {
                    return rule;
                }

                rule.type = 'text';
                rule.operator = 'equal';
            }

            return rule;
        },
        function transformForFullyNegated(rule) {

            if (
                rule.id === 'campaign.clicked' || rule.id === 'workflow.send_email.clicked'
                || rule.id === 'campaign.opened' || rule.id === 'workflow.send_email.opened'
                || rule.id === 'workflow.entered'
            ) {
                if (Array.isArray(rule.value) && rule.value[0]) {
                    if (rule.value[0] === 'true') {
                        rule.operator = 'not_equal';
                        rule.value[0] = 'null';
                    }
                    else if (rule.value[0] === 'false') {
                        rule.value[0] = 'null';
                    }
                }
            }

            return rule;
        },
        function transformEqualToIsForNull(rule) {
            // Transform 'equal' rules with null to 'is' rules
            if (rule.operator === 'equal' || rule.operator === 'not_equal') {
                if (Array.isArray(rule.value) && rule.value[0] === 'null') {
                    rule.operator = rule.operator === 'equal' ? 'is' : 'is_not';
                }
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

    if (!filtersObject || !filtersObject.rules) {
        return filtersObject;
    }

    const transformed = { ...filtersObject };

    internals.transformers.forEach((transformer) => {

        transformed.rules = transformed.rules.map((ruleObject) => {

            /** @type {Filter} */
            const filterObject = (ruleObject);
            /** @type {Rule} */
            const ruleObjectCast = (ruleObject);

            if (
                (filterObject.rules === undefined || filterObject.condition === undefined )
                && ruleObjectCast.id === undefined
            ) {

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
