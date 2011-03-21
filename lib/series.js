
/*!
 * Series
 * Copyright(c) 2011 Joris Röling <joris@bonboa.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


var Observer=require('./observer');
var eql = require('./eql');

/**
 * Eyes 
 *
 * @api private
 */
var eyes = require('eyes').inspector({
    styles: {
        all: 'cyan',
        label: 'underline',
        other: 'inverted',
        key: 'bold',
        special: 'grey',
        string: 'green',
        number: 'magenta',
        bool: 'blue',
        regexp: 'yellow',
    },
    pretty: true,
    hideFunctions: false,
    stream: process.stdout,
    maxLength: null
});   

/**
 * Series object
 *
 * @param {String} name
 */
  
function Series(name) {
    if ((this instanceof Series) === false) return new Series(name);
    this.items = {};    
    this.key='id';
    if (typeof name !== 'undefined') this.name=name;
}
Series.prototype=new Observer();

/**
 * Library version.
 */

Series.prototype.version =  '0.0.1';

/**
 * Dump the object using eyes
 *
 * @param {Object} obj
 * @api private
 */

Series.prototype.dump = function(obj) {
    if (typeof obj=='undefined') obj=this;
    eyes(obj);
}

/**
 * Notifies observers of change. This is done while preventing new notifications to observers, so that no notification storm is triggered.
 *
 * @param {string} action ('set','remove','clear')
 * @param {string} key
 * @param {string} reason
 */

Series.prototype.change = function(action,key,reason) 
{
    if (!this.disableNotifications) {
        this.disableNotifications=true;
        if (typeof this.handler === 'function') this.handler({action:reason,param:key});
        this.fire({action:action,param:key,reason:reason},this);
        delete this.disableNotifications;
    }
}

/**
 * Adds or changes an item, and fires notifications to observers if any changes actually happened.
 * That last bit is reflected in in the returned boolean.
 *
 * @param {Object} item
 * @return {Boolean}
 */

Series.prototype.set = function(item) {
    var result=false,eq=false,own=false;
    if (this.items.hasOwnProperty(item[this.key])) {
        own=true;
        eq=eql(item,this.items[item[this.key]]);
    }
    if (!eq) {
        this.items[item[this.key]]=item;
        
        this.change('set',item,(own?'change':'add'));
        result=true;
    }
    return result;
}

/**
 * Fetches an item based on the key
 *
 * @param {string} key
 * @return {Object}
 */

Series.prototype.get = function(key) {
    return this.items[key];
}

/**
 * Removes an item based on the key, and fires notifications to observers if any changes actually happened.
 * That last bit is reflected in in the returned boolean.
 *
 * @param {string} key
 * @return {Boolean}
 */

Series.prototype.remove = function(key) {
    var result=false;
    if (this.items.hasOwnProperty(key)) {
        delete(this.items[key]);
        this.change('remove',key);
        result=true;
    }   
    return result;
}

/**
 * Clears all items from the series, and fires notifications to observers if any changes actually happened.
 * That last bit is reflected in in the returned boolean.
 *
 * @param {string} key
 * @return {Boolean}
 */

Series.prototype.clear = function() {
    var result=false;
    if (Object.keys(this.items).length>0) {
        this.items={};
        this.change('clear');
        result=true;
    }
    return result;
}

/**
 * Acts on the series with an action object: {action:action,param:key,reason:reason} This is done while preventing new notifications to observers, so that no notification storm is triggered. 
 *
 * @param {Object} obj
 * @return {Boolean}
 */

Series.prototype.act = function(obj) {
    var result;
    this.disableNotifications=true;
    switch (obj.action) {
        case 'set':
            result=this.set(obj.param);
            break;
        case 'remove':
            remove=this.remove(obj.param);
            break;
        case 'clear':
            remove=this.clear();
            break;
        default: 
            eyes('NOT Acting:');
            eyes(obj);
            break;
    }
    delete this.disableNotifications;
    return result;
}


module.exports = Series;