/* exported Linechart */
/* global Component */

var Linechart = function(selector, key, time_series){
  Component.call(this, selector)

  this._x_column = key

  if(time_series){
    this._xScale = d3.scaleTime().rangeRound([this._margin.left, this._width - this._margin.left])  
  }else{
    this._xScale = d3.scaleLinear().rangeRound([this._margin.left, this._width - this._margin.left])
  }

  var that = this
  this._yScale = d3.scaleLinear().rangeRound([this._height - this._margin.top, this._margin.top])
  this._line = d3.line().x(function(d) { return that._xScale(d[that._x_column]) })
  this._store = []
}

Linechart.prototype = Object.create(Component.prototype);
Linechart.prototype.constructor = Linechart;

Linechart.prototype.createSkeleton = function(){
  this.tag('g').setAttr({
    'id': 'LinechartparentG'
  })

  this.resetSelector('#LinechartparentG').tag('g').setAttr({'id': 'xAxis' }).translate(0,this._height - this._margin.top,0)
  this.resetSelector('#LinechartparentG').tag('g').setAttr({'id': 'yAxis' }).translate(this._margin.left,0,0)
  this.resetSelector('#LinechartparentG').tag('g').setAttr({'id': 'lineChartG' })

  return this
}

Linechart.prototype.render = function(data){

  if(this._store.length > 0){
    this._animatedLines = _.differenceBy(data, this._store,'x') 
    this._animatedLines.unshift(this._store[this._store.length-1]) 
  }else{
    this._animatedLines = data
  }
  
  var that = this

  this._min_date = moment('08:00:00', 'HH:mm:ss').toDate()
  this._max_date = _.min([moment().toDate(), moment('16:00:00', 'HH:mm:ss').toDate()])
  // this._max_date = moment('16:00:00', 'HH:mm:ss').toDate()

  this._xScale.domain([
    this._min_date,
    this._max_date
  ])

  var domain = _.flatten(_.map(data ,function(d){ return _.values(d) }))
  this._yScale.domain([
    _.min(domain),
    _.max(domain)
  ])

  this.resetSelector('#xAxis').callFunc(d3.axisBottom(this._xScale).tickValues(_.map(data,'x')))
  this.resetSelector('#yAxis').callFunc(d3.axisLeft(this._yScale))

  that.resetSelector(".remove", true)._element.remove()

  _.each(_.keys(data[0]), function(column){
    that._line.y(function(d){ return that._yScale(d[column]) })
    
    if(column != that._x_column){
      that.resetSelector('#lineChartG').datum('path',that._store).setAttr({
        "class": "common remove",
        "stroke": "steelblue",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "stroke-width": 1.5,
        "fill": "none",
        "d": that._line
      })

      that.resetSelector('#lineChartG').datum('path',that._animatedLines).setAttr({
        "class": "linePath remove",
        "stroke": "steelblue",
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        "stroke-width": 1.5,
        "fill": "none",
        "d": that._line
      })

      var totalLength = that.resetSelector('.linePath')._element.node().getTotalLength()

      that.resetSelector('.linePath', true)._element
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

      // that.resetSelector('.remove', true).setAttr({'class': ''})
    }

  })
  this._store = data
}