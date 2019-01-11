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

    server.log(['optimus'], 'Optimus transformer standing by!');

    return next();
};

exports.register.attributes = {
    name: 'optimus'
};
