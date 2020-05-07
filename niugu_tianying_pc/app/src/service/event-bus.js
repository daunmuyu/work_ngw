/**
 * 事件调度
 */

import Backbone from 'Backbone';

export function on(event, callback, context) {
  Backbone.on(event, callback, context);
}

export function off(event, callback, context) {
  Backbone.off(event, callback, context);
}

export function trigger(event, ...args) {
  Backbone.trigger(event, ...args);
}
