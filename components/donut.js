/* exported Donut */
/* global Component */

var Donut = function(selector){
  Component.call(this, selector)
  this._radius = Math.min(this._width,this._height) / 2
  this._defaultArc = d3.arc().outerRadius(this._radius).innerRadius(this._radius - this._margin.left).startAngle(0).endAngle(2*Math.PI)
  this._arc = d3.arc().outerRadius(this._radius).innerRadius(this._radius - this._margin.left).startAngle(0).cornerRadius(100)
  this._pie = d3.pie().value(function(d) { return d })
  this._color = d3.scaleOrdinal(d3.schemeCategory10)
}

Donut.prototype = Object.create(Component.prototype);
Donut.prototype.constructor = Donut;

Donut.prototype.createSkeleton = function(){
  this.tag('g').translate(this._width/2,this._height/2,0).setAttr({
    'id': 'donutparentG'
  })
  return this
}

Donut.prototype.render = function(partial,total){
  this.tag('path').setAttr({
    'd': this._defaultArc
  }).setStyle({'fill': 'grey'})

  this.resetSelector('#donutparentG').dBind('g', [{startAngle: 0, endAngle: 2 * Math.PI * (partial/total)}]).tag('path').setAttr({
    'd': this._arc
  },{'d':2000}).setStyle({'fill': 'red'})
}

