// @ts-check
'use strict';

const Transformer = require('./transformer');

/**
 * Hapi plugin that exposes the transform function as
 * `.transform` (plain)
 * `server.methods.optimusTransform` (hapi server method)
 */

exports.transform = Transformer.transform;

exports.register = (server, options, next) => {

    server.method('optimus.transform', (filterObject) => {

        if (!filterObject) {
            return;
        }

        return Transformer.transform(filterObject);
    }, { callback: false });

    server.method('optimus.transformInPlace', (filterObject) => {

        if (!filterObject) {
            return;
        }

        // We don't point the whole `filterObject` to the transformed version as this doesn't modify the original object.
        // So if you pass 'payload' it should have the modified version on `request.payload`.
        // This also means that if you transform more then rules alo
        filterObject.rules = Transformer.transform(filterObject).rules;
    }, { callback: false });

    server.log(['optimus'], 'Optimus transformer standing by!');

    return next();
};

exports.register.attributes = {
    name: 'optimus'
};
