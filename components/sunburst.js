/* exported Sunburst */
/*global Component */

var Sunburst = function(selector){
  Component.call(this, selector)
  this._radius = Math.min(this._width, this._height) - 10;
  this._xScale = d3.scaleLinear().range([0, Math.PI])
  this._yScale = d3.scaleSqrt().range([0, this._radius])
  this._partition = d3.partition()
  var that = this
  this._arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(Math.PI, that._xScale(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(Math.PI, that._xScale(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, that._yScale(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, that._yScale(d.y1)); });

}

Sunburst.prototype = Object.create(Component.prototype);
Sunburst.prototype.constructor = Sunburst;

Sunburst.prototype.createSkeleton = function(){
  this.resetSelector().tag("g").setAttr({"class": "sunburst_g"}).translate(this._width/2, this._height, -90)
  return this;
}

Sunburst.prototype.render = function(data){

  var root = d3.hierarchy(data);
  root.sum(function(d) { return d.size; })
  var partition_data = this._partition(root).descendants()

  this.dBind("path", partition_data)
    .setAttr({
      "d": this._arc
    })
    .setStyle({
      "stroke": "black",
      "fill": function(d){ return d.data.color ? d.data.color : 'white'},
      "stroke-width": "1.5px"
    })
}