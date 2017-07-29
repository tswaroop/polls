/* exported Arcs */
/*global Component */

var Arcs = function(selector){
  Component.call(this, selector)
  this._radius = (Math.min(this._width, this._height)/2) - 70;
  this._xScale = d3.scaleLinear().range([0, 2 * Math.PI])
  this._yScale = d3.scaleSqrt().range([0, this._radius])
  this._partition = d3.partition()
  var that = this
  this._arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, that._xScale(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, that._xScale(d.x1))); })
    // .innerRadius(function(d) { return Math.max(0, that._yScale(d.y0)); })
    // .outerRadius(function(d) { return Math.max(0, that._yScale(d.y1)); });
}

Arcs.prototype = Object.create(Component.prototype);
Arcs.prototype.constructor = Arcs;

Arcs.prototype.createSkeleton = function(){
  this.resetSelector().tag("g").setAttr({"class": "Arcs_g"}).translate(this._width/2, this._height/2, -90)
  return this;
}

Arcs.prototype.render = function(data){

  var that = this

  var root = d3.hierarchy(data);
  root.sum(function(d) { return d.size; })
  var partition_data = this._partition(root).descendants()
  var num_n = 10
  _.each(_.range(4, num_n - 1), function(i){

  that.resetSelector('.Arcs_g').tag('g').dBind("path", partition_data)
    .setAttr({
      "d": function(d){
        var innerRadius = that._radius * (i/num_n)
        var outerRadius = innerRadius + 45
        // console.log(innerRadius,outerRadius)
        var arc = that._arc.innerRadius(innerRadius).outerRadius(outerRadius)
        return arc(d)
      }
    })
    .setStyle({
      "stroke": "white",
      "fill": function(d){ return d.data.color ? d.data.color : 'white'},
      "stroke-width": "2.5px"
    })
  })
    // defined for outer arc
    var Arcs_sample_data = {
        name: 'root',
        color: 'white',
        children: [{'name': 'BJP', color: 'yellow', size: 25},
        {'name': 'SP', color: 'orange', size: 11},
        {'name': 'BSP', color: 'Green', size: 9}]
    }
    var root = d3.hierarchy(Arcs_sample_data);
    root.sum(function(d) { return d.size; })
    var partition_data = this._partition(root).descendants()
    that.resetSelector('.Arcs_g').tag('g').dBind("path", partition_data)
    .setAttr({
      "d": function(d){
        var innerRadius = that._radius
        var outerRadius = that._radius + 70
        // console.log(innerRadius,outerRadius)
        var arc = that._arc.innerRadius(innerRadius).outerRadius(outerRadius)
        return arc(d)
      }
    })
    .setStyle({
      "stroke": "white",
      "fill": function(d){ return d.data.color ? d.data.color : 'white'},
      "stroke-width": "0px"
    })
}