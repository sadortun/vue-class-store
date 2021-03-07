/**
 * Bundle of: vue-class-store
 * Generated: 2021-03-06
 * Version: 3.0.0
 */

import { reactive, computed, watch } from 'vue';

function getDescriptors(model) {
    var prototype = Object.getPrototypeOf(model);
    if (prototype === null || prototype === Object.prototype) {
        return {};
    }
    var prototypeDescriptors = getDescriptors(prototype);
    var descriptors = Object.getOwnPropertyDescriptors(prototype);
    return Object.assign(Object.assign({}, prototypeDescriptors), descriptors);
}
function getValue(value, path) {
    var segments = typeof path === 'string'
        ? path.split('.')
        : path;
    var segment = segments.shift();
    return segment
        ? getValue(value[segment], segments)
        : value;
}
function makeReactive(model) {
    // properties
    var descriptors = getDescriptors(model);
    // options
    var data = {};
    var watched = {};
    // data, string watches
    Object.keys(model).forEach(function (key) {
        var value = model[key];
        if (key.startsWith('on:')) {
            watched[key.substring(3)] = value;
        }
        else {
            data[key] = value;
        }
    });
    // function watches, methods, computed
    var state = reactive(Object.assign(Object.assign({}, data), Object.keys(descriptors).reduce(function (output, key) {
        if (key !== 'constructor' && !key.startsWith('__')) {
            var ref = descriptors[key];
            var value = ref.value;
            var get = ref.get;
            var set = ref.set;
            // watch
            if (key.startsWith('on:')) {
                watched[key.substring(3)] = value;
            }
            // method
            else if (value) {
                output[key] = function () {
                    var args = [], len = arguments.length;
                    while ( len-- ) args[ len ] = arguments[ len ];

                    return value.call.apply(value, [ state ].concat( args ));
                };
            }
            // computed
            else if (get && set) {
                output[key] = computed({
                    set: function (value) { return set.call(state, value); },
                    get: function () { return get.call(state); },
                });
            }
            else if (get) {
                output[key] = computed(function () { return get.call(state); });
            }
        }
        return output;
    }, {})));
    // set up watches
    Object.keys(watched).forEach(function (key) {
        var callback = typeof watched[key] === 'string'
            ? model[getValue(model, 'on:' + key)]
            : watched[key];
        if (typeof callback === 'function') {
            watch(function () { return getValue(state, key); }, callback.bind(state));
        }
    });
    // return
    return state;
}
function VueStore(constructor) {
    function construct() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var instance = new (Function.prototype.bind.apply( constructor, [ null ].concat( args) ));
        return makeReactive(instance);
    }
    return construct;
}
VueStore.create = makeReactive;

export default VueStore;
export { makeReactive };
