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
                    value: ['']
                },
                {
                    id: 'opportunity.closed',
                    label: 'Closed',
                    type: 'boolean',
                    input: 'binaryradio',
                    entity: 'opportunity',
                    operator: 'not_equal',
                    value: ['']
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
});
