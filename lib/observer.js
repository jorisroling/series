
/*!
 * JavaScript Observer Class
 * Thursday, November 9th, 2006
 * 
 * First off, let me be the 763rd person to say that JavaScript does not have have a formal class system, however it does have the expressive nature to represent the notion of a class. That being out of the way, this entry is about representing the Observer Pattern in JavaScript; otherwise known as the publisher/subscriber model. As some already might know, it is already well demonstrated in modern event handling BOM‘s such as IE’s attachEvent or W3′s addEventListener which allow you to register multiple listeners, and notify each callback by firing one event.
 * 
 * You might also know that some JavaScript libraries such as Dojo, YUI, and Prototype have implemented generic utilities that easily allow you to set up your publishers and allow client code to subscribe to these events….
 * 
 * Well, here’s mine. It’s basic and to the point, and only uses a wee bit of code.
 * 
*/


/**
 * Observer object
 *
 */
  
function Observer() {
    this.fns = [];
}

  
Observer.prototype = {

/**
 * Subscribes a new observer
 *
 * @param {Function} fn
 */
    subscribe : function(fn) {
        this.fns.push(fn);
    },

/**
 * Unsubscribes a existing observer
 *
 * @param {Function} fn
 */
    unsubscribe : function(fn) {
        this.fns = this.fns.filter(
            function(el) {
                if ( el !== fn ) {
                    return el;
                }
            }
        );
    },
/**
 * Fires an event
 *
 * @param {Object} o
 * @param {Object} thisObj
 */
    fire : function(o, thisObj) {
        var scope = thisObj || process;
        this.fns.forEach(
            function(el) {
                el.call(scope, o);
            }
        );
    }
};

module.exports = Observer;