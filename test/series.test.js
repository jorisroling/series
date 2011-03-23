
/**
 * Module dependencies.
 */

var Series = require('../lib/series'), should = require('should');
var assert=require('assert');
var series=Series('main');

var other_series=new Series('other');

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



// series.on('change', function(obj) {
//     other_series.act(obj);
// })
// 
// other_series.on('change', function(obj) {
//     series.act(obj);
// })
// 
// other_series.on('error', function(obj) {
//     eyes(obj);
// })
// 

module.exports = {
	'test .version': function() {
		series.version.should.match(/^\d+\.\d+\.\d+$/);
	},
	'test .instance': function() {
		other_series.should.be.an.instanceof(Series);
	},
	'test .set': function() {
		series.set({id:123,joris: 'GEK'});
		other_series.set({id:123,joris: 'GEK'});
		series.set({id:124,joris: 'GEK'});
		
		series.items.should.have.property(123);
		other_series.items.should.have.property(123);
	},
	'test .get': function() {
		var item=series.get(123);
		item.should.have.property('id',123);
		item=other_series.get(123);
		item.should.have.property('id',123);
	},
	'test .remove': function() {
		Object.keys(other_series.items).length.should.not.eql(0);
		other_series.remove(123);
		
		series.items.should.not.have.property(123);
		other_series.items.should.not.have.property(123);
	},
	'test .bulkAdd': function() {
		var len=Object.keys(series.items).length;
		for (var i=0;i<100;i++) series.set({id:i,joris: 'GEK'+i});
		
		Object.keys(series.items).length.should.eql(100+len);
		Object.keys(other_series.items).length.should.eql(100+len);
	},
	'test .clear': function() {
		other_series.clear();
		Object.keys(series.items).length.should.eql(0);
		Object.keys(other_series.items).length.should.eql(0);
	},
	'test .remove2': function() {
		series.set({id:124,joris: 'GEK'});
		var item=series.get(124);
		should.ok(item);
		
		item.should.have.property(series.key);

		other_series.remove(124);
		series.items.should.not.have.property(124);
		other_series.items.should.not.have.property(124);
		
	},
	'test .sync': function() {
		series.items.should.eql(other_series.items);
		eyes(series);
		eyes(other_series);
	},
};