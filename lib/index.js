// @ts-check
'use strict';

const Get = require('lodash.get');

const Transformer = require('./transformer');

/**
 * Hapi helper functions that exposes the transform function as
 * `.transform` (plain)
 * `.pre.optimusTransform` (hapi pre function helper)
 */

/**
 * @typedef {Object} FilterObject
 * @property {String} condition
 * @property {Array.<{}>} rules
 */

/**
 * @typedef {Object} Payload
 * @property {FilterObject} [q]
 * @property {FilterObject} [filter]
 * @property {Number} [id]
 * @property {Array.<Number>} [ids]
 */

/**
 * Returns a full rule object when only rules are passed
 *
 * @param {Payload} [filterObject]
 * @returns {void}
 */
const transformSimpleRules = (filterObject) => {

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

    if (filterObject.q === undefined) {
        filterObject.filter = {
            condition: 'AND',
            rules: filter
        };
    }
    else {
        filterObject.q = {
            condition: 'AND',
            rules: filter
        };
    }
};

/**
 * @param {Payload | FilterObject} [filterObject]
 * @returns {void}
 */
const transformInPlace = (filterObject) => {

    if (!filterObject) {
        return;
    }

    // Make sure to work with the object that has the rules property
    let transformObject;

    if (filterObject.q) {
        transformObject = filterObject.q;
    }
    else if (filterObject.filter) {
        transformObject = filterObject.filter;
    }
    else {
        transformObject = filterObject;
    }

    // We don't point the whole `filterObject` to the transformed version as this doesn't modify the original object.
    // So if you pass 'payload' it should have the modified version on `request.payload`.
    // This also means that if you transform more then rules alo
    if (transformObject.rules) {
        transformObject.rules = Transformer.transform(transformObject).rules;
    }
};

exports.transform = Transformer.transform;

/**
 * These helper functions make it easy to use in hapi 17+ pre handlers.
 * `pre: [Optimus.pre.transformInPlace('payload')]`
 * `pre: [Optimus.pre.transformSimpleRules('payload')]`
 */
exports.pre = {
    /**
     * @param {String} whatToTransform any property from `request`
     * @returns {function():Promise}
     */
    transformSimpleRules: (whatToTransform) => {

        return (request, h) => {

            transformSimpleRules(Get(request, whatToTransform));
            return h.continue;
        };
    },
    /**
     * @param {String} whatToTransform any property from `request`
     * @returns {function():Promise}
     */
    transformInPlace: (whatToTransform) => {

        return (request, h) => {

            transformInPlace(Get(request, whatToTransform));
            return h.continue;
        };
    }
};
