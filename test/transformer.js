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
});
