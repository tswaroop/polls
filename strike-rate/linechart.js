/* exported Linechart */
/* global Component */

var Linechart = function(selector, key, time_series,margin){
  Component.call(this, selector,margin)

  this._x_column = key

  if(time_series){
    this._xScale = d3.scaleTime().rangeRound([this._margin.left, this._width - this._margin.left])
  }else{
    this._xScale = d3.scaleLinear().rangeRound([this._margin.left, this._width - this._margin.left])
  }

  var that = this
  this._yScale = d3.scaleLinear().rangeRound([this._height - this._margin.top, this._margin.top])
  this._line = d3.line()
                 .x(function(d) { 
                  return that._xScale(d[that._x_column]); })
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
  this.resetSelector('#LinechartparentG').tag('g').setAttr({'id': 'lineChartG' }).translate(0,-10,0)

  return this
}

Linechart.prototype.render = function(data){
  var that = this
  if(that._store.length > 0){
    that._animatedLines = _.differenceBy(data, that._store,function(d){return d.x.getTime()})
    that._animatedLines.unshift(that._store[that._store.length-1]) 
  }else{
    that._animatedLines = data
  }
  
  var data_time_x = new Date(data[0].x);
  var data_time = data_time_x. getDate()
  var curren_time = new Date()
  curren_time_date = curren_time.getDate()

  if (data_time == curren_time_date)
  {
    that._xScale.domain([
      moment('08:00:00', 'HH:mm:ss').toDate(),
      _.min([moment().toDate(), moment('16:00:00', 'HH:mm:ss').toDate()])
    ])
  }
  else{
  that._xScale.domain(d3.extent(data, function(d) { return d[that._x_column] }))
  }
  
  var domain = _.flatten(_.map(data ,function(d){ return _.values(_.pickBy(d, function(i){ return typeof(i) == typeof(1) })) }))

  that._yScale.domain([
    _.min(domain),
    _.max(domain)
  ])

  that.resetSelector('#xAxis').callFunc(d3.axisBottom(that._xScale))
  that.resetSelector('#yAxis').callFunc(d3.axisLeft(that._yScale))

  var time_interval
  if (data_time == curren_time_date)
  {
    if (curren_time.getHours()>=14){
      time_interval = 60
    }
    else if(curren_time.getHours()>=10 && curren_time.getHours()<14)
    {time_interval = 30}
    else if((curren_time.getHours()==8) && (curren_time.getMinutes()<15)){
      time_interval  = data[data.length -1].x.getMinutes()
    }
    else if(curren_time.getHours()>=8 && curren_time.getHours()<10){ time_interval =15}
    else{time_interval = 60}
  }
  else {time_interval = 60}
  that.resetSelector('#xAxis').callFunc(d3.axisBottom(that._xScale).ticks(d3.timeMinute, time_interval)
    .tickSizeInner(-(that._height - that._margin.top - that._margin.top)).tickSizeOuter([0])
    .tickFormat(d3.timeFormat("%I:%M")))
  that.resetSelector(".lined", true)._element.remove()
  var curr_url = G.url.parse(location.href)
  var states = curr_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
  var summed  = _.max(_.values(data[data.length-1]).slice(0,-1))
  half_total = total_cand[states]/2
  if (half_total < summed ){
    that.resetSelector('#LinechartparentG').datum('line', domain).setAttr({
      'x1':that._margin.left,
      'y1':function(d){
          return that._yScale(half_total)},
      'y2': function(d){return that._yScale(half_total) },
      'x2':function(d){return that._width - that._margin.left},
      'stroke':'#000',
      "stroke-width": 4,
      'stroke-dasharray':'10,3',
      'class':'lined'
    })
  }

  that.resetSelector(".remove", true)._element.remove()
  _.each(_.keys(data[0]), function(column){
    that._line.y(function(d){ return that._yScale(d[column]) })
    if(column != that._x_column && column != 'total_cand'){
      that.resetSelector('#lineChartG').datum('path',that._store).setAttr({
        "class": "common remove",
        "data-highlight": encodeURIComponent(column),
        "stroke-linejoin": "round",
        "stroke-linecap": "round",
        'lines':encodeURIComponent(column),
        "stroke-width": 20,
        "fill": "none",
        "ttype": "abcd",
        "d": that._line
      })
      that.resetSelector('#lineChartG').datum('path',that._animatedLines).setAttr({
        "class": "linePath remove",
        "data-highlight": encodeURIComponent(column),
        "stroke-linejoin": "round",
        'lines':encodeURIComponent(column),
        "stroke-width": 20,
        "fill": "none",
        "ttype": "abcd",
        "d": that._line
      })
      var totalLength = that.resetSelector('.linePath')._element.node().getTotalLength()
      that.resetSelector('.linePath', true)._element
      .attr("stroke-dasharray", (totalLength+that._margin.top+ that._margin.left) + " " + (totalLength))
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
    }  
  })
   _.forEach(data, function(item){
    _.forEach(_.keys(item), function(column){
    that.resetSelector('#LinechartparentG').datum('image', item).setAttr({
      'class':'remove',
      'x':function(d){
        return that._xScale(d['x']) - 50
      },
      'y': function(d){
        if(column !== 'x' && column !='total_cand')
        {
          return that._yScale(d[column]) - 100
        }
       },
       'ptype':'abcd',
       'data-highligh':encodeURIComponent(column),
       'width':'120px',
       'height':'100px',
       'xlink:href': function()
        {
          return 'img/pop.png'
        }
    })
    })
  })
   _.forEach(data, function(item){
    _.forEach(_.keys(item), function(column){

    that.resetSelector('#LinechartparentG').datum('text', item).setAttr({
      'class':'remove',
      'x':function(d){
        return that._xScale(d['x']) -10
      },
      'y': function(d){
        if(column !== 'x' && column !='total_cand')
        {
          return that._yScale(d[column]) - 60
        }
       },
       'ptype':'abcd',
       'data-highligh':encodeURIComponent(column),
       'text': function(d){
        return d[column]},
        'fill':'#fff',
        'font-size':'35px'
    })
    })
  })
  // that.resetSelector(".remove", true)._element.remove()
  if (data.length > 1){
 _.each(_.keys(data[0]), function(column){
    that.resetSelector('#LinechartparentG').datum('image',data[data.length-1]).setAttr({
      'class':'images remove',
      'x':function(d){
        if(column !='total_cand')
        {
        return that._xScale(d['x']) -20
        }
      },
      'y':function(d){
        if(column !== 'x' && column !='total_cand')
        {
          return that._yScale(d[column]) -40
        }
      },'width':'68px',
       'height':'68px',
       'data-highlight':encodeURIComponent(column),
       'dtype':'abcd',
       'xlink:href': function()
        {
          if(column !== 'x' && column !='total_cand')
        {
          return 'img/CAND/'+column+'.png'
        }
        }
    })
 })}
 this._store = data

$('#linechartContainer-xAxis .tick line').first().hide()
if(data[data.length -1].x.getMinutes() == 15 || data[data.length -1].x.getMinutes() ==30 || data[data.length -1].x.getMinutes() == 45 || data[data.length -1].x.getMinutes() ==0 || data[data.length -1].x.getMinutes() ==59)
{
  $('#linechartContainer-xAxis .tick line').last().hide()
  $('#linechartContainer-xAxis .tick').last().attr('text-anchor','end')
}
else{
  $('#linechartContainer-xAxis .tick line').last().css({'stroke-dasharray':'5,5'})
}
$('#linechartContainer-xAxis .domain').css('stroke-width',4)
$('#linechartContainer-xAxis .tick line').slice(1,-1).css({'stroke-dasharray':'5,5'})
d3.select('#linechartContainerSVG').attr('viewBox','-50 0 '+ (this._width +this._margin.top) +' '+(this._height-this._margin.left)+'').attr('preserveAspectRatio','xMinYMin meet');
$('#linechartContainer-xAxis .tick').first().attr('text-anchor','start')
$('#linechartContainer-yAxis .tick,#linechartContainer-xAxis .tick').css({'font-weight':'bold','fill':'#4a4a4a','font-size':'35px'})

_.each($("path[ttype=abcd]"), function(d){$(d).css('stroke',function(){return partyColors[decodeURIComponent($(d).attr('data-highlight'))]})})
$("#linechartContainerSVG image[ptype=abcd],#linechartContainerSVG text[ptype=abcd]").css('opacity',0)

if($('#linechartContainer-xAxis .tick text').length > 8){
  $('#linechartContainer-xAxis .tick text').attr('width',70).attr('height',70)
  $('#linechartContainer-xAxis .tick text').each(function(index, node) { G.wrap(node) })
  }
else{$('#linechartContainer-xAxis .tick text').attr('dy','1.1em')}
  $( ".linechartContainer-images" ).slideUp( 300 ).delay( 1000 ).fadeIn( )}
