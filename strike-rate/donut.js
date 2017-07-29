/* exported Donut */
/* global Component */

var Donut = function(selector,margin){
  Component.call(this, selector,margin)
  this._radius = Math.min(this._width,this._height) / 2
  this._defaultArc = d3.arc().outerRadius(this._radius-28).innerRadius(this._radius - this._margin.left).startAngle(0).endAngle(2*Math.PI)
  this._arc = d3.arc().outerRadius(this._radius-28).innerRadius(this._radius - this._margin.left).startAngle(0).cornerRadius(100)
  this._pie = d3.pie().value(function(d) { return d })
  this._color = d3.scaleOrdinal(d3.schemeCategory10)
}

Donut.prototype = Object.create(Component.prototype);
Donut.prototype.constructor = Donut;

Donut.prototype.createSkeleton = function(){
  this.tag('g').translate((this._width/2)-this._margin.left,this._height/2,0).setAttr({
    'id': 'donutparentG'
  })
  return this
}

Donut.prototype.render = function(data){
  var main_data = data
  var parties = _.find(data, function(d){return d})

  data = _.map(data, _.keys(parties)[0])[0]
  var partial = data[0]
  var total = data[1]
  this._element.attr('class', 'hilighter')
  this.setAttr({
    'data-highlight': encodeURIComponent(_.keys(parties)[0]),
    'href': "?party="+encodeURIComponent(_.keys(parties)[0]),
    // 'class': 'hilighter', div id is added here ...if it's like this click event is not working
    'data-toggle': 'toggle'
  })

  var that = this
  
  this.tag('path').setAttr({
    'd': this._defaultArc
  }).setStyle({'fill': 'grey'})
  this.resetSelector('#donutparentG')
      .dBind('g', [{startAngle: 0, endAngle: 2 * Math.PI * (partial/total)}])
      .tag('path')
      .setAttr(
        {'d': this._arc},
        {'d':3000}
      )
      .setStyle({
        'fill': function(d) { return d.index == 0 ? 'grey' : main_data[0].colr; }
      })
      .resetSelector('.arc',true).tag('title').setAttr({
        'text': function(d){
         return d.data }
      })
      .resetSelector('#donutparentG',true).tag('image').setAttr({
        'x':-this._radius + this._margin.left, 
        'y':-this._radius + this._margin.left,
        'width':2*(this._radius - this._margin.left),
        'height':2*(this._radius - this._margin.left),
        'dtype':'imgs',
        'xlink:href': function(){
          return 'img/CAND/'+_.keys(parties)[0]+'.png'
        }
      })
      .resetSelector('#donutparentG').datum('text',data).setAttr({
        'x':95,
        'y':80,
        'text': function(d){
         return d[0]},
         'class':'donut_text1',
         'font-size':'70px'
      })  
}