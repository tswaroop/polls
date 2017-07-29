/* exported Wheel */
/* global Component */

var Wheel = function(selector){
  Component.call(this, selector)
  this._radius = Math.min(this._width,this._height) / 2
  this._arc = d3.arc().outerRadius(this._radius).innerRadius(this._radius - this._margin.left)
  this._pie = d3.pie().value(function(d) { return d })
  this._color = d3.scaleOrdinal(d3.schemeCategory10)
}

Wheel.prototype = Object.create(Component.prototype);
Wheel.prototype.constructor = Wheel;

Wheel.prototype.createSkeleton = function(){
  this.tag('g').translate(this._width/2,this._height/2,0).setAttr({
    'id': 'threedonutparentG'
  })
  return this
}

Wheel.prototype.render = function(data){
  var that = this
  this.dBind('g',this._pie(data))
    .setAttr({'class':'arc'})
    .tag('path')
    .setAttr({
      'd': this._arc
    })
    .setStyle({
      'fill': function(d) { return that._color(d.data); }
    })
    .resetSelector('.arc',true).tag('title').setAttr({
      'text': function(d){ return d.data }
    })
}
