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
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'Customers',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                },
                {
                    id: 'person-contact.my-contacts',
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
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                },
                {
                    id: 'person-type.id',
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
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'Customers',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                },
                {
                    id: 'person-contact.my-contacts',
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
                    label: 'Tag',
                    type: 'string',
                    input: 'tags',
                    entity: 'person',
                    value: [1],
                    operator: 'in'
                },
                {
                    id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                },
                {
                    id: 'person-type.id',
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
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_empty'
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_not_empty'
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_null'
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'is_not_null'
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'true'
                },
                {
                    id: 'opportunity.closed',
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
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'not_equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'not_equal',
                    value: ['null']
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'equal',
                    value: ['true']
                },
                {
                    id: 'opportunity.closed',
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
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                },
                {
                    id: 'count task',
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
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
                    label: '# tasks',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: []
                },
                {
                    id: 'count task',
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
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
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
                    label: 'Size',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: [1, 2]
                },
                {
                    id: 'count account_contact',
                    label: '# contacts',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'not_between',
                    value: [1, 2]
                },
                {
                    id: 'count opportunity',
                    label: '# opportunities',
                    type: 'integer',
                    input: 'integer',
                    entity: 'account',
                    operator: 'between',
                    value: []
                },
                {
                    id: 'count task',
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
                    type: 'string',
                    input: 'text',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.id',
                    label: 'Is part of',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign-email.sent_status',
                    label: 'Received',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'email_open.id',
                    label: 'Opened',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'interactiongroup.id',
                    label: 'Clicked',
                    type: 'boolean',
                    input: 'binaryradio',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.creator',
                    label: 'Created by',
                    type: 'integer',
                    input: 'autocomplete',
                    display_entity: 'Campaign',
                    entity: 'campaign'
                },
                {
                    id: 'campaign.type',
                    label: 'Type',
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
                    entity: 'campaign',
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

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });

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
                    'operator':'in',
                    'type':'integer',
                    'value':[
                        2
                    ]
                }
            ]
        };

        return expect(Transformer.transform(oldFilter)).to.equal(newFilter);
    });
});
