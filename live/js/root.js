/* exported Component */

var Component = function Component(selector,margin){
  this._properties = {}

  this._properties.rootSelector = d3.select(selector)
  this._properties.rootSelectorID = d3.select(selector).attr('id')

  this._width = d3.select(selector).node().getBoundingClientRect().width
  this._height = d3.select(selector).node().getBoundingClientRect().height

  if(margin){
    this._margin = margin
  }else{
    this._margin = {'left': 50, 'right': 50, 'top': 50, 'bottom': 50}
  }
  this._width = this._width - this._margin.left - this._margin.right
  this._height = this._height - this._margin.top - this._margin.bottom

  this._element = d3.select(selector).append('svg')
  this._element.attr('width', "100%")
  this._element.attr('height', this._height)
  this._element.attr('id', this._properties.rootSelectorID + 'SVG')
  this._element.attr("viewbox", "0 0 " + this._width + " " + this._height)
  this._element.attr('preserveAspectRatio', 'xMidYMin')
}

Component.prototype.resetSelector = function(selector,use_selectall_flag){

  if(selector){
    selector = selector.slice(0,1) + this._properties.rootSelectorID + '-' + selector.slice(1)
  }else{
    selector = '#' + this._properties.rootSelectorID + 'SVG'
  }

  if(use_selectall_flag){
    this._element = d3.selectAll(selector)
  }else{
    this._element = d3.select(selector)
  }

  return this
}

Component.prototype.setAttr = function(AttrObj){
  var self = this
  Object.keys(AttrObj).forEach(function(attr){
    if(attr == 'text'){
      self._element.text(AttrObj[attr])
    }else if(attr == 'html'){
      self._element.html(AttrObj[attr])
    }else{
      if(attr == 'id' || attr == 'class'){
        if(typeof(AttrObj[attr]) == 'function'){
          var res = AttrObj[attr]
          AttrObj[attr] = function(d) { return _.map(res(d).split(' '), function(d) { return self._properties.rootSelectorID + '-' + d }).join(' ') }
        }else{
          AttrObj[attr] = _.map(AttrObj[attr].split(' '), function(d) { return self._properties.rootSelectorID + '-' + d }).join(' ')
        }

      }
      self._element.attr(attr,AttrObj[attr])
    }
  })
  return self
}

Component.prototype.setStyle = function(StyleObj){
  var self = this
  Object.keys(StyleObj).forEach(function(style){
    self._element.style(style,StyleObj[style])
  })
  return self
}

Component.prototype.setText = function(){
  var self = this
  self._element.text("test")
  return self
}

Component.prototype.translate = function(x,y,r){
  this.setAttr({
    'transform': function(){ return 'translate(' + x + ',' + y + ') rotate(' + r + ')' }
  })
  return this
}

Component.prototype.dBind = function(element,data,prop){
  var selection = this._element.selectAll(element).data(data, function(d) { return prop ? d[prop] : this.id; })
  this._element = selection.enter().append(element).merge(selection)
  selection.exit().remove()
  return this
}

Component.prototype.datum = function(element,data,prop){
  var selection = this.tag(element)._element.data([data])
  return this
}


Component.prototype.attachEvent = function(event,callback){
  this._element.on(event, callback)
  return this
}

Component.prototype.tag = function(element){
  this._element = this._element.append(element)
  return this
}

Component.prototype.setProperty = function(properties){
  var newProp = this._properties
  Object.keys(properties).forEach(function(prop){
    newProp[prop] = properties[prop]
  })
  this._properties = newProp
  return this
}

Component.prototype.callFunc = function(func){
  this._element.call(func)
  return this
}
