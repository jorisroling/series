"use strict"

/*!
 * Series
 * Copyright(c) 2011 Joris Röling <joris@bonboa.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */


var util = require('util');
var events = require('events');
 
var eql = require('./eql');

/**
 * Series object, inherits from EventEmiter
 *
 * @param {String} name, not important
 * @param {String} kind, all series of the same kind will be auto synced
 */

var series_list = {};
  
function Series(name,kind) {
    if ((this instanceof Series) === false) return new Series(name,kind);
    this.items = {};    
    this.key='id';
    if (typeof name !== 'undefined') this.name=name;
    if (typeof kind !== 'undefined') {
        this.kind=kind;
    } else {
        this.kind='default';
    }
    if (typeof series_list[this.kind] === 'undefined') series_list[this.kind]=[];
    series_list[this.kind].push(this);
}

util.inherits(Series, events.EventEmitter);

/**
 * Library version.
 */

Series.prototype.version =  '0.0.6';

/**
 * Notifies the listeners of change
 *
 * @param {Object} data {action:action,param:key,reason:reason}
 * @param {String} label
 */

Series.prototype.notify = function(data,label) {
    this.emit(label || 'change', data);
} 




/**
 * Notifies observers of change. This is done while preventing new notifications to observers, so that no notification storm is triggered.
 *
 * @param {string} action ('set','unset','clear')
 * @param {string} key
 * @param {string} reason
 */

Series.prototype.change = function(action,key,reason) 
{
    for (var s in series_list[this.kind]) {
        if (series_list[this.kind][s]!==this) {
            series_list[this.kind][s].act({action:action,param:key,reason:reason});
        }
    }
    
    if (!this.disableNotifications) {
        this.disableNotifications=true;
        
        this.notify({action:action,param:key,reason:reason},'change');
        
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
 * Unsets an item based on the key, and fires notifications to observers if any changes actually happened.
 * That last bit is reflected in in the returned boolean.
 *
 * @param {string} key
 * @return {Boolean}
 */

Series.prototype.unset = function(key) {
    var result=false;
    if (this.items.hasOwnProperty(key)) {
        delete(this.items[key]);
        this.change('unset',key);
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
        case 'unset':
            result=this.unset(obj.param);
            break;
        case 'clear':
            result=this.clear();
            break;
        default: 
            console.log('NOT Acting:');
            console.dir(obj);
            break;
    }
    delete this.disableNotifications;
    return result;
}


module.exports = Series;