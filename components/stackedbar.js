/* exported StackedBar */
/* global Component */

var StackedBar = function(selector,colorDict,margin){
  Component.call(this, selector, margin)
  this._xScale = d3.scaleLinear()
  this._color = {
    main: colorDict.main,
    mainTop: colorDict.sec,
    mainSide: colorDict.back,
    sec: '#404040',
    secTop: '#252525',
    secSide: '#6F6F6F'
  }
}

StackedBar.prototype = Object.create(Component.prototype);
StackedBar.prototype.constructor = StackedBar;

StackedBar.prototype.render = function(data, col, factor){
  this._width = this._width * factor

  this._xScale.rangeRound([0, this._width])
  this._stacked_width = this._width - (this._height/2)
  this._stacked_height = (this._height / 2)


  this._xScale.domain([
    _.filter(data, {type: 'main'})[0][col],
    _.filter(data, {type: 'sec'})[0][col]
  ])

  var domain = this._xScale.domain()

  var that = this
  var stacked_data = d3.stack().keys([col])(data)
  
  this.dBind('g',data)
    .setAttr({
      'class': 'stackedbar',
      'transform': 'translate(' + that._stacked_height/2 + ',' + that._stacked_height/2 + ')'
    })
    .tag('rect')
    .setAttr({
      'x': function(d){ 
        return d.type == 'main' ? that._xScale(d[col]) : (that._stacked_width * (domain[0] / d3.sum(domain))) 
      },
      'y': 0,
      'height': that._stacked_height,
      'width': function(d){ return that._stacked_width * (d[col] / d3.sum(domain) )}
    },{'width':1000})
    .setStyle({
      'fill': function(d){ return that._color[d.type] }
    })
    .resetSelector('.stackedbar', true)
    .tag('rect')
    .setAttr({
      'x': function(d){ 
        return d.type == 'main' ? that._xScale(d[col]) : (that._stacked_width * (domain[0] / d3.sum(domain))) 
      },
      'y': 0,
      'height': that._stacked_height/2,
      'width': function(d){ return that._stacked_width * ( d[col] / d3.sum(domain) )},
      'transform': 'translate(' + (-that._stacked_height/2) + ',' + (-that._stacked_height/2) + ') skewX(45)'
    },{'width':1000})
    .setStyle({
      'fill': function(d){ return that._color[d.type+'Top'] }
    })
    .resetSelector('.stackedbar')
    .tag('rect')
    .setAttr({
      'x': 0,
      'y': 0,
      'height': that._stacked_height,
      'width': that._stacked_height/2,
      'transform': 'translate(' + (-that._stacked_height/2) + ',' + (-that._stacked_height/2) + ') skewY(45)'
    })
    .setStyle({
      'fill': function(d){ return d[col] != 0 ? that._color[d.type+'Side'] : that._color['sec'] }
    })
}