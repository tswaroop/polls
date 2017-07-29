/* exported Component */

var Component = function Component(selector,margin){
  this._properties = {}

  this._properties.rootSelector = d3.select(selector)
  this._properties.rootSelectorID = d3.select(selector).attr('id')

  this._width = d3.select(selector).node().getBoundingClientRect().width
  this._height = d3.select(selector).node().getBoundingClientRect().height

  this._defaultsForTransition = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    fill: '#A0A3A0'
  }

  if(margin){
    this._margin = margin
  }else{
    this._margin = {'left': 50, 'right': 50, 'top': 50, 'bottom': 50}
  }
  this._width = this._width - this._margin.left - this._margin.right
  this._height = this._height - this._margin.top - this._margin.bottom

  d3.select(selector).selectAll('*').remove()

  this._element = d3.select(selector).append('svg')
  this._element.attr('width', this._width)
  this._element.attr('height', this._height)
  this._element.attr('id', this._properties.rootSelectorID + 'SVG')
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

Component.prototype.setAttr = function(AttrObj, transitionObj){
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
      if(transitionObj && attr in transitionObj){
        if(attr == 'd'){
          self._element.transition().delay(function(d, i){ return 1000 * i }).duration(transitionObj[attr]).attrTween('d', function(d){
            if('startAngle' in d && 'endAngle' in d){
              var interpolate = d3.interpolate(d.startAngle, d.endAngle)
              return function(t){
                return self._arc.endAngle(interpolate(t))(d)
              }
            }
          })
        }else{
          self._element
              .attr(attr,self._defaultsForTransition[attr] || 0)
              .transition()
              .delay(function(d,i){ return 1000 * i })
              .duration(transitionObj[attr])
              .attr(attr,AttrObj[attr])
        }
      }else{
        self._element.attr(attr,AttrObj[attr])
      }
    }
  })
  return self
}

Component.prototype.setStyle = function(StyleObj, transitionObj){
  var self = this
  Object.keys(StyleObj).forEach(function(style){
    if(transitionObj && style in transitionObj){
      self._element
          .style(style,self._defaultsForTransition[style] || 0)
          .transition()
          .delay(function(d,i){ return 80 * i })
          .duration(transitionObj[style])
          .style(style,StyleObj[style])
    }else{
      self._element.style(style,StyleObj[style])
    }

  })
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