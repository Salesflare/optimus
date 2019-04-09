// @ts-check
'use strict';

const Transformer = require('./transformer');

/**
 * Hapi plugin that exposes the transform function as
 * `.transform` (plain)
 * `server.methods.optimusTransform` (hapi server method)
 */

/**
 * @typedef { { condition: String, rules: Array.<Object>} } FilterObject
 * @typedef { FilterObject | { q: FilterObject } | { filter: FilterObject | { id: Number } | { ids: Array<Number> } } } Payload
 */

exports.transform = Transformer.transform;

exports.register = (server, options, next) => {

    /**
     * Returns a full rule object when only rules are passed
     * @param {Payload | Array.<Object>} filterObject
     * @returns {FilterObject}
     */
    server.method('optimus.transformSimpleRules', (filterObject) => {


        if (!filterObject || (!filterObject.q && !filterObject.filter)) {
            return;
        }

        let filter = {};
        if (filterObject.q) {
            filter = filterObject.q;
        }
        else {
            filter = filterObject.filter;
        }

        if (filter.rules || filter.id || filter.ids || !Array.isArray(filter) ) {
            return;
        }

        filterObject.q = {
            condition: 'AND',
            rules: filter
        };

    }, { callback: false });

    /**
     * @param {FilterObject} filterObject
     * @returns {FilterObject}
     */
    server.method('optimus.transform', (filterObject) => {

        if (!filterObject) {
            return;
        }

        return Transformer.transform(filterObject);
    }, { callback: false });

    /**
     * @param {FilterObject | { q: FilterObject }} filterObject
     * @returns {FilterObject}
     */
    server.method('optimus.transformInPlace', (filterObject) => {

        if (!filterObject) {
            return;
        }

        // Make sure to work with the object that has the rules property
        const transformObject = filterObject.q ? filterObject.q : filterObject;

        // We don't point the whole `filterObject` to the transformed version as this doesn't modify the original object.
        // So if you pass 'payload' it should have the modified version on `request.payload`.
        // This also means that if you transform more then rules alo
        if (transformObject.rules) {
            transformObject.rules = Transformer.transform(transformObject).rules;
        }
    }, { callback: false });

    server.log(['optimus'], 'Optimus transformer standing by!');

    return next();
};

exports.register.attributes = {
    name: 'optimus'
};
