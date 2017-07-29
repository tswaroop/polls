/* exported ArcResult */
/*global Component */
var t = d3.transition()
    .duration(750)
    .ease(d3.easeLinear);

var triangle = d3.symbol().type('triangle-up')
        .size(50);

var ArcResult = function(selector){
  Component.call(this, selector)

  this._radius = 400;
  this._xScale = d3.scaleLinear().range([0.5 * Math.PI, 2.5 * Math.PI])
  this._yScale = d3.scaleSqrt().range([0, this._radius])
  this._partition = d3.partition()
  var that = this

  this._arc = d3.arc()
    .startAngle(function(d) { return Math.max(0.5 * Math.PI, Math.min(2.5 * Math.PI, that._xScale(d.x0))); })
    .endAngle(function(d) { return Math.max(0.5 * Math.PI, Math.min(2.5 * Math.PI, that._xScale(d.x1))); })
    // .innerRadius(function(d) { return Math.max(0, that._yScale(d.y0)); })
    // .outerRadius(function(d) { return Math.max(0, that._yScale(d.y1)); });
}


ArcResult.prototype = Object.create(Component.prototype);
ArcResult.prototype.constructor = ArcResult;

ArcResult.prototype.createSkeleton = function(){
  var x_pos = this._width * 0.623;
  this.resetSelector().tag("g").setAttr({"class": "ArcResult_g"}).translate(1200, 400, -90)
  return this;
}

ArcResult.prototype.render = function(data){

  var that = this
  var layers = data.layers
  var tot_res = data.tot_res
  var outerdata = data.outerdata
  var tot_seats_mark = Math.round(data.tot_seats[0] / 2)
  var tot_seats = data.tot_seats[0]
  var declared = data.declared

  d3.selectAll(".result-arc-ArcResult_g").selectAll("*").remove()
  var num_n = layers + 5

  var currResolution = window.innerWidth;
  var outer_padding = 32, mark_size = 300

  if (currResolution <= 1366){
      outer_padding = 35
  }
  // for large screen with zoom 42 %
  if (currResolution<=3273 && currResolution>2100){
    outer_padding = 35
    mark_size = 700
  }
  // for back ground color
  var root = d3.hierarchy({
    name: 'root',
    color: 'white',
    children: ([{'name': 'bg', 'size': 1}])
  });
  root.sum(function(d) { return d.size; })
  var partition_data = that._partition(root).descendants()

  that.resetSelector('.ArcResult_g').tag('g').dBind("path", partition_data)
    .setAttr({
      "d": function(d){
        var innerRadius = 0
        var outerRadius = that._radius
        // console.log(innerRadius,outerRadius)
        var arc = that._arc.innerRadius(innerRadius).outerRadius(outerRadius)
        return arc(d)
      }
    })
    .setStyle({
      "stroke": "#767676",
      "fill": "#767676",
      "stroke-width": "2px"
    })


  var trans_num = 0
  _.each(_.range(5, num_n), function(i){
  var arc_data = {
    name: 'root',
    color: 'white',
    children: (tot_res[i - 5])
  }

  var root = d3.hierarchy(arc_data);
  root.sum(function(d) { return d.size; })
  var partition_data = that._partition(root).descendants()

  that.resetSelector('.ArcResult_g').tag('g').dBind("path", partition_data)
    .setAttr({
      "d": function(d){
        var innerRadius = that._radius * (i/num_n)
        var outerRadius = innerRadius + outer_padding
        // console.log(innerRadius,outerRadius)
        var arc = that._arc.innerRadius(innerRadius).outerRadius(outerRadius)
        return arc(d)
      }
    })
    .setAttr({"trans_num": function(d, i){
      trans_num = trans_num + 1
      return trans_num;
    }})
    .setStyle({
      "stroke": "#E0E7E3",
      "fill": function(d){ return d.data.color ? d.data.color : '#E0E7E3'},
      "stroke-width": "2px"
    },{'fill': 50})
  })
    // // defined for outer arc
    // var ArcResult_sample_data = {
    //     name: 'root',
    //     color: 'white',
    //     children: outerdata
    // }
    // var root = d3.hierarchy(ArcResult_sample_data);
    // root.sum(function(d) { return d.size; })
    // var partition_data = this._partition(root).descendants()

    // var arc_g = that.resetSelector('.ArcResult_g').tag('g')
    // arc_g.dBind("path", partition_data)
    // .setAttr({
    //   "d": function(d){
    //     var innerRadius = that._radius
    //     var outerRadius = that._radius + ((2 * (outer_padding)) - 10)
    //     // console.log(innerRadius,outerRadius)
    //     var arc = that._arc.innerRadius(innerRadius).outerRadius(outerRadius)
    //     return arc(d)
    //   }
    // })
    // .setStyle({
    //   "stroke": "#E0E7E3",
    //   "fill": function(d){ return d.data.color ? d.data.color : '#E0E7E3'},
    //   "stroke-width": "0px"
    // })

    // arc_g.resetSelector().dBind("text", partition_data)

    d3.selectAll(".result_text").remove()
    var sel = d3.select(".result-arc-ArcResult_g")
    sel.append("g")
      .attr("class", "result_text")
      .attr("transform", "translate(" + 0 + "," + 0 + ") rotate(90)")
      .attr("text-anchor", "middle")
      .style("fill", "#FFF")
      .append("text")
      .text(mask_to_hindi(declared + " / " + tot_seats))
      .attr("dy", ".3em")

    // for half way mark
    var sel = d3.select(".result-arc-ArcResult_g")
    var trgl_x = (that._radius + outer_padding), trgl_y = that._height

    var half_mark = sel.append("g")
      .attr("class", "half-mark")
      .attr("transform", "translate(-" + trgl_x + "," + 0 + ") rotate(90)")
      .style("fill", "#000")

    half_mark.append("path")
      .attr("d", d3.symbol()
      .size(mark_size)
      .type(d3.symbolTriangle))

    half_mark.append("text")
      .attr("y", (outer_padding * 1.6))
      .attr("text-anchor", "middle")
      .style("font-size", '1em')
      .style("font-weight", "bold")
      .text(mask_to_hindi("HALFWAY MARK") + "(" + tot_seats_mark + ")")

}
