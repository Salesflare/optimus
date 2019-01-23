'use strict';

const Lab = require('lab');
const Code = require('code');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const Transformer = require('../lib/transformer');

describe('transformer', () => {

    it('transforms old person type to new person type', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'person-tag.id',
                    query_builder_id: 'person-tag.id',
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-customer.customers',
                    query_builder_id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'Customers',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                },
                {
                    id: 'person-contact.my-contacts',
                    query_builder_id: 'person-contact.my-contacts',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'person-tag.id',
                    query_builder_id: 'person-tag.id',
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                },
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [1]
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('doesn\'t modify the original filter', () => {

        const old = {
            rules: [
                {
                    id: 'person-contact.my-contacts',
                    query_builder_id: 'person-contact.my-contacts',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        Transformer.transform(old);

        return expect(old.rules[0].id).to.equal('person-contact.my-contacts');
    });

    it('transforms invalid operators to better operator-value combo', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'person-tag.id',
                    query_builder_id: 'person-tag.id',
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-customer.customers',
                    query_builder_id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'Customers',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                },
                {
                    id: 'person-contact.my-contacts',
                    query_builder_id: 'person-contact.my-contacts',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'person-tag.id',
                    query_builder_id: 'person-tag.id',
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                },
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [1]
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('transforms boolean operator to operator/value combo', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_empty'
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_not_empty'
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: {
                        key: 'is_null',
                        value: 'is false'
                    }
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_not_null'
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'true'
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'false'
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'not_equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'not_equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['true']
                },
                {
                    id: 'opportunity.closed',
                    query_builder_id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['false']
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('transforms value objects to an array for the between/not_between operators', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [{
                        value1: 1,
                        value2: 2
                    }]
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [{
                        value1: 1,
                        value2: 2
                    }]
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [{
                        value1: null,
                        value2: 2
                    }]
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [{
                        value1: 1,
                        value2: undefined
                    }]
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [{
                        value1: undefined,
                        value2: 1
                    }]
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('transforms value properties to an array for the between/not_between operators', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value1: 1,
                    value2: 2
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value1: 1,
                    value2: 2
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value1: null,
                    value2: 2
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value1: 2,
                    value2: null
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value1: 1,
                    value2: undefined
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value1: undefined,
                    value2: 1
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('doesn\'t transform values for the between/not_between operators when the values are already correct', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    query_builder_id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    query_builder_id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    query_builder_id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

    it('transforms old person-campaign rules to use the campaign entity', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'campaign.name',
                    label: 'Name',
                    type: 'string',
                    input: 'text',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'campaign.id',
                    label: 'Is part of',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'campaign-email.sent_status',
                    label: 'Received',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'email_open.id',
                    label: 'Opened',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'interactiongroup.id',
                    label: 'Clicked',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'campaign.creator',
                    label: 'Created by',
                    type: 'integer',
                    input: 'autocomplete',
                    display_entity: 'Campaign',
                    entity: 'person'
                },
                {
                    id: 'campaign.type',
                    label: 'Type',
                    type: 'string',
                    input: 'multiselect',
                    display_entity: 'Campaign',
                    entity: 'person'

                },
                {
                    id: 'campaign.status',
                    label: 'Status',
                    type: 'string',
                    input: 'multiselect',
                    entity: 'person',
                    display_entity: 'Campaign'
                },
                {
                    id: 'person-address.state_region',
                    label: 'State/Region',
                    type: 'string',
                    input: 'text',
                    entity: 'person'
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'campaign.name',
                    label: 'Name',
                    query_builder_id: 'campaign.name',
                    type: 'string',
                    input: 'text',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.id',
                    label: 'Is part of',
                    query_builder_id: 'campaign.id',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign-email.sent_status',
                    label: 'Received',
                    query_builder_id: 'campaign-email.sent_status',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'email_open.id',
                    label: 'Opened',
                    query_builder_id: 'email_open.id',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'interactiongroup.id',
                    label: 'Clicked',
                    query_builder_id: 'interactiongroup.id',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.creator',
                    label: 'Created by',
                    query_builder_id: 'campaign.creator',
                    type: 'integer',
                    input: 'autocomplete',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.type',
                    label: 'Type',
                    query_builder_id: 'campaign.type',
                    type: 'string',
                    input: 'multiselect',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.status',
                    label: 'Status',
                    type: 'string',
                    input: 'multiselect',
                    query_builder_id: 'campaign.status',
                    entity: 'campaign',
                    display_entity: 'Campaign'
                },
                {
                    id: 'person-address.state_region',
                    label: 'State/Region',
                    type: 'string',
                    query_builder_id: 'person-address.state_region',
                    input: 'text',
                    entity: 'person'
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    },


    it('handles a mix of different campaign rule versions', () => {

        const oldFilter = {
            rules: [
                {
                    'id':'campaign-email.sent_status',
                    'label':'Received',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'person',
                    'value':'',
                    'operator':'true'
                },
                {
                    'id':'email_open.id',
                    'label':'Opened',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'campaign',
                    'value':'',
                    'operator':'true'
                },
                {
                    'id':'interactiongroup.id',
                    'label':'Clicked',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'person',
                    'value':'',
                    'operator':'true'
                },
                {
                    'id':'person-customer.customers',
                    'entity':'person',
                    'input':'binaryradio',
                    'label':'Customers',
                    'operator':'true',
                    'type':'boolean',
                    'value':''
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    'id':'campaign-email.sent_status',
                    'label':'Received',
                    'query_builder_id': 'campaign-email.sent_status',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'campaign',
                    'value':[
                        'true'
                    ],
                    'operator':'equal'
                },
                {
                    'id':'email_open.id',
                    'label':'Opened',
                    'query_builder_id': 'email_open.id',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'campaign',
                    'value':[
                        'true'
                    ],
                    'operator':'equal'
                },
                {
                    'id':'interactiongroup.id',
                    'label':'Clicked',
                    'query_builder_id': 'interactiongroup.id',
                    'type':'boolean',
                    'input':'binaryradio',
                    'display_entity':'Campaign',
                    'entity':'campaign',
                    'value':['true'],
                    'operator':'equal'
                },
                {
                    'id':'person-type.id',
                    'entity':'person',
                    'input':'multiselect',
                    'label':'Type',
                    'query_builder_id': 'person-type.id',
                    'operator':'in',
                    'type':'integer',
                    'value':[
                        2
                    ]
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    }),

    it('adds a query_builder_id when not present for older formats', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'account.name',
                    operator: 'equal',
                    value: ['salesflare']
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'account.size',
                    query_builder_id: 'account.size',
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'account.name',
                    operator: 'equal',
                    value: ['salesflare']
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    }),

    it('fixes custom ids with spaces', () => {

        const oldFilter = {
            rules: [
                {
                    id: 'custom.Name thing',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'count custom.Name thing',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'account.name',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'custom.Name thing',
                    entity: 'account',
                    operator: 'equal',
                    value: ['salesflare']
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    id: 'custom.name_thing',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'count custom.name_thing',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'account.name',
                    operator: 'equal',
                    value: ['salesflare']
                },
                {
                    id: 'custom.name_thing',
                    query_builder_id: 'custom.name_thing',
                    entity: 'account',
                    operator: 'equal',
                    value: ['salesflare']
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    }),

    it('can handle nested rules', () => {

        const oldFilter = {
            rules: [
                {
                    condition: 'OR',
                    rules: [
                        {
                            id: 'custom.Name thing',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'count custom.Name thing',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'account.name',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'custom.Name thing',
                            entity: 'account',
                            operator: 'equal',
                            value: ['salesflare']
                        }
                    ]
                }
            ]
        };

        const newFilter = {
            rules: [
                {
                    condition: 'OR',
                    rules: [
                        {
                            id: 'custom.name_thing',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'count custom.name_thing',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'account.name',
                            operator: 'equal',
                            value: ['salesflare']
                        },
                        {
                            id: 'custom.name_thing',
                            query_builder_id: 'custom.name_thing',
                            entity: 'account',
                            operator: 'equal',
                            value: ['salesflare']
                        }
                    ]
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    }),

    it('should fail for faulty filter objects 1', () => {

        const filterNoRules = {
            rules: [
                {
                    condition: 'AND'
                }
            ]
        };

        return expect(() => Transformer.transform(filterNoRules)).to.throw(Error,'Invalid filter object');
    }),
    it('should fail for faulty filter objects 2', () => {

        const filterEmpty = {
            rules: [
                {

                }
            ]
        };

        return expect(() => Transformer.transform(filterEmpty)).to.throw(Error,'Invalid filter object');
    }),
    it('should fail for faulty filter objects 3', () => {

        const filterNoCondition = {
            rules: [
                {
                    rules: [
                        {
                            id: 'custom.Name thing',
                            operator: 'equal',
                            value: ['salesflare']
                        }
                    ]
                }
            ]
        };

        return expect(() => Transformer.transform(filterNoCondition)).to.throw(Error,'Invalid filter object');
    })

    );
});
