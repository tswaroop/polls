/* exported Sunburst */
/*global Component */

var Sunburst = function(selector, margin){
  Component.call(this, selector, margin)
  this._radius = Math.min(this._width, this._height) - 80;
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
  this.resetSelector().tag("g").setAttr({"class": "sunburst_g"}).translate(this._width/2, this._height - 80, -90)
  return this;
}

Sunburst.prototype.render = function(data){
  var root = d3.hierarchy(data);
  root.sum(function(d) { return d.size; })
  var partition_data = this._partition(root).descendants()

  this.dBind("path", partition_data)
    .setAttr({
      "d": this._arc,
      "title": function(d){ 
        if(d.data.Party == 'root') return 'root';
        if(d.data.children == undefined) return d.data.Party;
        return d.data.children[0].Party; 
      }
    })
    .setStyle({
      "stroke": "white",
      "fill": function(d){
        return d.data.Party!='root' ? swing_module.colors[d.data.Party] : 'white'},
      "stroke-width": "4px"
    })
    .setStyle({
      "opacity": function(d){ 
        return d.data.Party == "root" ? 0 : 1; }
    });
    var text_pos_x = 1030, text_pos_y = 600;
    var width = this.resetSelector()._width, height = this.resetSelector()._height;

  var info_text_data = [
    {text: 'Trailing', x: width/2 - 410, y: height - 50, font: '30px'},
    {text: 'Leading', x: width/2 - 520, y: height - 50, font: '30px'},
    {text: root.children.length, x: width/2, y: height/1.6, font: '100px', id: 'tot_const_txt'},
    {text: 'Lead Margin', x: width/2 - 160, y: height/1.37, font: '50px'},
    {text: 'SWING SEATS', x: width/2, y: height - 100, font: '50px'}
  ]
    this.resetSelector().dBind('text', info_text_data)
    .setAttr({
      'x': 0, 'y': 0,
      'transform': function(d){return 'translate(' + d.x + ',' + d.y + ')'},
      'data-title': function(d){ return d.id; },
      'text': function(d){ return d.text}
    })
    .setStyle({
      'text-anchor': 'middle',
      'font-size': function(d){ return d.font; }
    });

    var l_margin_grp = this.resetSelector().tag('g').setAttr({'class': 'lead-margin-btns'});
    
    l_margin_grp.tag('rect')
    .setAttr({id: 'less_one', x: width/2 + 15, y: height/1.37 - 50, width: 140, height: 70,
      rx: '40px', ry: '40px'})
    .setStyle({'fill': '#000000'});
   
    this.resetSelector('.lead-margin-btns').tag('rect')
    .setAttr({id: 'less_two', x: width/2 + 160, y: height/1.37 - 50, width: 140, height: 70,
      rx: '40px', ry: '40px', class: 'lead-margin-btn'})
    .setStyle({'fill': '#000000'});

    l_margin_grp.resetSelector().tag('text')
    .setAttr({x: width/2 + 50, y: height/1.37 - 5, 'text': '<1%'})
    .setStyle({'fill': '#ffffff', 'font-size': '35px'});

    l_margin_grp.resetSelector().tag('text')
    .setAttr({x: width/2 + 200, y: height/1.37 - 5, 'text': '<2%'})
    .setStyle({'fill': '#ffffff', 'font-size': '35px'});
}

