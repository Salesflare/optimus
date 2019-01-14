'use strict';

const Lab = require('lab');
const Code = require('code');
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

        expect(server.methods.optimus.transform).to.be.a.function();
        expect(Optimus.transform).to.be.a.function();

        expect(server.methods.optimus.transform(oldFilter)).to.equal(newFilter);
        return expect(server.methods.optimus.transform()).to.equal(undefined);
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
                    entity: 'person',
                    input: 'binaryradio',
                    label: 'My contacts',
                    operator: 'true',
                    type: 'boolean',
                    value: ['']
                }
            ]
        };

        const res = await server.inject({
            url: '/',
            method: 'DELETE',
            payload: oldFilter
        });

        const newFilter = {
            condition: 'AND',
            rules: [
                {
                    id: 'person-type.id',
                    entity: 'person',
                    input: 'multiselect',
                    label: 'Type',
                    operator: 'in',
                    type: 'integer',
                    value: [2]
                }
            ]
        };

        return expect(res.result).to.equal(newFilter);
    });

    it('works as a pre function wen nothing is passed', async () => {

        const server = new Hapi.Server();
        await server.register(Optimus);

        server.connection();

        server.route({
            path: '/',
            method: 'DELETE',
            config: {
                pre: ['optimus.transformInPlace(query.q)']
            },
            handler: (request, reply) => {

                return reply();
            }
        });

        await server.initialize();

        const res = await server.inject({
            url: '/',
            method: 'DELETE'
        });

        return expect(res.statusCode).to.equal(200);
    });
});
