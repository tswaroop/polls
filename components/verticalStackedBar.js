/* exported verticalStackedBar */
/* global Component */

var verticalStackedBar = function(selector,colorDict){
  Component.call(this, selector)
  this._yScale = d3.scaleLinear().rangeRound([0, this._height])
  this._color = {
    main: colorDict.main,
    mainTop: colorDict.sec,
    mainSide: colorDict.back,
    sec: '#404040',
    secTop: '#252525',
    secSide: '#6F6F6F'
  }

  this._stacked_height = this._height - (this._width/2)
  this._stacked_width = (this._width / 2)
}

verticalStackedBar.prototype = Object.create(Component.prototype);
verticalStackedBar.prototype.constructor = verticalStackedBar;

verticalStackedBar.prototype.createSkeleton = function(){
  this.tag('g').setAttr({id: 'vstacked'}).translate(this._height,this._height,180)
  return this
}

verticalStackedBar.prototype.render = function(data, col){

  this._yScale.domain([
    _.filter(data, {type: 'main'})[0][col],
    _.filter(data, {type: 'sec'})[0][col]
  ])

  var domain = this._yScale.domain()

  var that = this
  
  this.resetSelector('#vstacked').dBind('g',data)
    .setAttr({
      'class': 'verticalstacked',
      'transform': 'translate(' + (that._width + (that._stacked_width/2)) + ',0)'
    })
    .tag('rect')
    .setAttr({
      'y': function(d){ 
        return d.type == 'main' ? that._yScale(d[col]) : (that._stacked_height * (domain[0] / d3.sum(domain))) 
      },
      'x': 0,
      'width': that._stacked_width,
      'height': function(d){ return that._stacked_height * (d[col] / d3.sum(domain) )}
    },{height: 1000})
    .setStyle({
      'fill': function(d){ return that._color[d.type] }
    })
    .resetSelector('.verticalstacked', true)
    .tag('rect')
    .setAttr({
      'y': function(d){ 
        return d.type == 'main' ? that._yScale(d[col]) : (that._stacked_height * (domain[0] / d3.sum(domain))) 
      },
      'x': -that._stacked_width,
      'width': that._stacked_width,
      'height': function(d){ return that._stacked_height * (d[col] / d3.sum(domain) )},
      'transform': 'skewY(-45)',
      'class': 'abc'
    },{height: 1000})
    .setStyle({
      'fill': function(d){ return that._color[d.type+'Top'] }
    })
    .resetSelector('.verticalstacked', true)
    .tag('rect')
    .setAttr({
      'x': that._height - that._stacked_width,
      'y': that._height - that._stacked_width,
      'height': that._stacked_width/2,
      'width': that._stacked_width,
      'transform': 'skewX(-45)'
    },{height: 750})
    .setStyle({
      'display': function(d) { return d.type == 'main' ? 'none' : 'initial' },
      'fill': function(d){ return d[col] != 0 ? that._color[d.type+'Side'] : that._color['sec'] }
    })
}