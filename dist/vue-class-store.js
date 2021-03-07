/**
 * Bundle of: vue-class-store
 * Generated: 2021-03-06
 * Version: 3.0.0
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueClassStore = {}, global.Vue));
}(this, (function (exports, vue) { 'use strict';

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
      var state = vue.reactive(Object.assign(Object.assign({}, data), Object.keys(descriptors).reduce(function (output, key) {
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
                  output[key] = vue.computed({
                      set: function (value) { return set.call(state, value); },
                      get: function () { return get.call(state); },
                  });
              }
              else if (get) {
                  output[key] = vue.computed(function () { return get.call(state); });
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
              vue.watch(function () { return getValue(state, key); }, callback.bind(state));
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

  exports.default = VueStore;
  exports.makeReactive = makeReactive;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
