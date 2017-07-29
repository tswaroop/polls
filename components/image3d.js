/* exported image3d */
/* global Component */

var image3d = function(selector,colorDict){
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

image3d.prototype = Object.create(Component.prototype);
image3d.prototype.constructor = image3d;

image3d.prototype.createSkeleton = function(){
  this.tag('g').setAttr({id: 'vstacked'}).translate(this._height - this._stacked_width/2,this._height,180)
  return this
}

image3d.prototype.render = function(data, col, imageHREF, name){

  this._yScale.domain([
    _.filter(data, {type: 'main'})[0][col],
    _.filter(data, {type: 'sec'})[0][col]
  ])

  var domain = this._yScale.domain()

  var that = this
  // var stacked_data = d3.stack().keys([col])(data)
  
  this.resetSelector('#vstacked').dBind('g',data)
    .setAttr({
      'class': 'verticalstacked'
    })
    .tag('rect')
    .setAttr({
      'y': function(d){ 
        return d.type == 'main' ? 400 : 100
      },
      'x': -100,
      'width': ,
      'height': function(d){ return that._height * (d[col] / d3.sum(domain) )}
    })
    .setStyle({
      'fill': function(d){ return that._color[d.type] }
    })
    .resetSelector('.verticalstacked', true)
    .tag('rect')
    .setAttr({
      'y': function(d){ 
        return d.type == 'main' ? that._yScale(d[col]) : (that._stacked_height * (domain[0] / d3.sum(domain))) 
      },
      'x': 0,
      'width': 50,
      'height': function(d){ return that._height * (d[col] / d3.sum(domain) )},
      'transform': 'translate(' + that._stacked_width + ',0) skewY(45)'
    })
    .setStyle({
      'fill': function(d){ return that._color[d.type+'Top'] }
    })
    .resetSelector('.verticalstacked', true)
    .tag('image')
    .setAttr({
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      transform: 'translate(0,0) rotate(180)',
      'xlink:href': imageHREF
    })
    .setStyle({
      display: function(d) { return d.type == 'main' ? 'none' : 'initial' }
    })
    // .resetSelector('.verticalstacked', true)
    // .tag('rect')
    // .setAttr({
    //   'x': that._height - that._stacked_width,
    //   'y': that._height - that._stacked_width,
    //   'height': that._stacked_width/2,
    //   'width': that._stacked_width,
    //   'transform': 'skewX(-45)'
    // })
    // .setStyle({
    //   'display': function(d) { return d.type == 'main' ? 'none' : 'initial' },
    //   'fill': function(d){ return d[col] != 0 ? that._color[d.type+'Side'] : that._color['sec'] }
    // })
}