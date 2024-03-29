'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Hapi = require('@hapi/hapi');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const Optimus = require('../lib');

describe('hapi helper functions', () => {

    it('transforms', () => {

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

        expect(Optimus.transform).to.be.a.function();

        expect(Optimus.transform(oldFilter)).to.equal(newFilter);
        expect(Optimus.transform()).to.equal(undefined);
    });

    it('return a wrapper function', () => {

        expect(Optimus.pre.transformSimpleRules()).to.be.a.function();
        expect(Optimus.pre.transformInPlace()).to.be.a.function();
    });

    it('returns continue', () => {

        const continueSymbol = Symbol.continue;
        expect(Optimus.pre.transformSimpleRules()({}, { continue: continueSymbol })).to.equal(continueSymbol);
        expect(Optimus.pre.transformInPlace()({}, { continue: continueSymbol })).to.equal(continueSymbol);
    });

    it('work as pre functions', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformInPlace('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-customer.customers',
                    query_builder_id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: oldFilter
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        return expect(response.result).to.equal(newFilter);
    });

    it('work as pre functions with nested location', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformInPlace('payload.deep')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-customer.customers',
                    query_builder_id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { deep: oldFilter }
        });

        const newFilter = {
            deep: {
                condition: 'AND',
                rules: [
                    {
                        id: 'person-type.id',
                        query_builder_id: 'person-type.id',
                        entity: 'person',
                        input: 'multiselect',
                        label: 'Type',
                        operator: 'in',
                        type: 'integer',
                        value: [2]
                    }
                ]
            }
        };

        return expect(response.result).to.equal(newFilter);
    });

    it('works as a pre function when passed an entire request object', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformInPlace('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-customer.customers',
                    query_builder_id: 'person-customer.customers',
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, q: oldFilter }
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        return expect(response.result.q).to.equal(newFilter);
    });

    it('works as a pre function when passed an entire request object with an array of rules instead of an object', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformInPlace('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = [
            {
                id: 'person-customer.customers',
                query_builder_id: 'person-customer.customers',
                entity: 'person',
                input: 'binaryradio',
                label: 'My contacts',
                operator: 'true',
                type: 'boolean',
                value: ['']
            }
        ];

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, q: oldFilter }
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        return expect(response.result.q).to.equal(newFilter);
    });

    it('works as a pre function when passed an entire request object with an array of rules instead of an object, placed on the filter property instead of the q property', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformInPlace('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = [
            {
                id: 'person-customer.customers',
                query_builder_id: 'person-customer.customers',
                entity: 'person',
                input: 'binaryradio',
                label: 'My contacts',
                operator: 'true',
                type: 'boolean',
                value: ['']
            }
        ];

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, filter: oldFilter }
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        return expect(response.result.filter).to.equal(newFilter);
    });

    it('works as a pre function when passed an entire request object with an array of rules instead of an object, placed on the filter property instead of the q property and with an extra individual record filter', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformInPlace('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const oldFilter = [
            {
                id: 'person-customer.customers',
                query_builder_id: 'person-customer.customers',
                entity: 'person',
                input: 'binaryradio',
                label: 'My contacts',
                operator: 'true',
                type: 'boolean',
                value: ['']
            }
        ];

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, filter: oldFilter, individual_record_filter: oldFilter }
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    query_builder_id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        expect(response.result.individual_record_filter).to.equal(newFilter);
        return expect(response.result.filter).to.equal(newFilter);
    });

    it('uses transformInPlace as a pre function when nothing is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformInPlace('query')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE'
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function when nothing is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('query')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE'
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function when a faulty payload is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: {
                limit: 10
            }
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function when a faulty filter object is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: {
                limit: 10,
                q: { 'condition': 'AND' }
            }
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function when an id filter object is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: {
                limit: 10,
                filter: { 'id': 10 }
            }
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function when an ids filter object is passed', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload')]
            },
            handler: () => false
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: {
                limit: 10,
                filter: { 'ids': [10, 12] }
            }
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('doesn\'t add rules property when it was not already there', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'GET',
            options: {
                pre: [Optimus.pre.transformInPlace('query')]
            },
            handler: (request) => {

                return Object.keys(request.query);
            }
        });

        await server.initialize();

        const response = await server.inject({
            url: '/?q%5Ba%5D=1',
            method: 'GET'
        });

        expect(response.statusCode).to.equal(200);
        return expect(response.payload).to.not.include('rules');
    });

    it('transforms a simple rule array to a filter object', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformSimpleRules('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const simpleFilter = [{ id: 'asd', operator: 'asd', value: 'asd' }];
        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, q: simpleFilter }
        });

        const filterObject = {
            condition: 'AND',
            rules: simpleFilter
        };

        expect(response.statusCode).to.equal(200);
        return expect(response.result.q).to.equal(filterObject);

    });

    it('doesn\t transform a filter object like a simple rule array', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformSimpleRules('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const simpleFilter = {
            condition: 'AND',
            rules: [{ id: 'asd', operator: 'asd', value: 'asd' }]
        };

        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, q: simpleFilter }
        });

        const filterObject = simpleFilter;

        expect(response.statusCode).to.equal(200);
        return expect(response.result.q).to.equal(filterObject);
    });

    it('transforms a individual record filter simple rule array to a filter object', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformSimpleRules('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const simpleFilter = [{ id: 'asd', operator: 'asd', value: 'asd' }];
        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, q: undefined, individual_record_filter: simpleFilter }
        });

        const filterObject = {
            condition: 'AND',
            rules: simpleFilter
        };

        expect(response.statusCode).to.equal(200);
        return expect(response.result.individual_record_filter).to.equal(filterObject);

    });

    it('transforms a individual record filter simple rule array and a regular filter to a filter object', async () => {

        const server = new Hapi.Server();

        server.route({
            path: '/',
            method: 'DELETE',
            options: {
                pre: [Optimus.pre.transformSimpleRules('payload'), Optimus.pre.transformSimpleRules('payload')]
            },
            handler: (request) => {

                return request.payload;
            }
        });

        await server.initialize();

        const simpleFilter = [{ id: 'asd', operator: 'asd', value: 'asd' }];
        const simpleFilter2 = [{ id: 'efg', operator: 'efg', value: 'efg' }];
        const response = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: { limit: 10, details: true, filter: simpleFilter, individual_record_filter: simpleFilter2 }
        });

        const filterObject = {
            condition: 'AND',
            rules: simpleFilter
        };

        const filterObject2 = {
            condition: 'AND',
            rules: simpleFilter2
        };

        expect(response.statusCode).to.equal(200);
        expect(response.result.individual_record_filter).to.equal(filterObject2);
        return expect(response.result.filter).to.equal(filterObject);
    });
});
