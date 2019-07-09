'use strict';

const Lab = require('@hapi/lab');
const Code = require('@hapi/code');
const Hapi = require('hapi');

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

const Optimus = require('../lib');

describe('hapi plugin', () => {

    it('registers and transforms', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

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

        expect(server.methods.optimus.transform).to.be.a.function();
        expect(Optimus.transform).to.be.a.function();

        expect(server.methods.optimus.transform(oldFilter)).to.equal(newFilter);
        return expect(server.methods.optimus.transform()).to.equal(undefined);
    });

    it('\'s methods fail when passed undefined', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        expect(server.methods.optimus.transformSimpleRules()).to.equal(undefined);
        return expect(server.methods.optimus.transformInPlace()).to.equal(undefined);
    });

    it('works as a pre function', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformInPlace(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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

    it('works as a pre function when passed an entire request object', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)', 'optimus.transformInPlace(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)', 'optimus.transformInPlace(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)', 'optimus.transformInPlace(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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

    it('uses transformInPlace as a pre function wen nothing is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformInPlace(query)']
            },
            handler: (request, reply) => {

                return reply();
            }
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE'
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function wen nothing is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(query)']
            },
            handler: (request, reply) => {

                return reply();
            }
        });

        await server.initialize();

        const response = await server.inject({
            url: '/',
            method: 'DELETE'
        });

        return expect(response.statusCode).to.equal(200);
    });

    it('uses transformSimpleRules as a pre function wen a faulty payload is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply();
            }
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

    it('uses transformSimpleRules as a pre function wen a faulty filter object is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply();
            }
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

    it('uses transformSimpleRules as a pre function wen an id filter object is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply();
            }
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

    it('uses transformSimpleRules as a pre function wen an ids filter object is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply();
            }
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
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'GET',
            config: {
                pre: ['optimus.transformInPlace(query)']
            },
            handler: (request, reply) => {

                return reply(Object.keys(request.query));
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
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)', 'optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformSimpleRules(payload)', 'optimus.transformSimpleRules(payload)']
            },
            handler: (request, reply) => {

                return reply(request.payload);
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

});
