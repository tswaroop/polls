$(function () {
  d3.csv('data/2012.csv', function(data){

    $('.gotocomparison').on('click', function(){
      var _state = $("#filter-state.dropdown span:first").text();
      var _agency = $("#filter-agency span:first").text();
      window.location = '/poll?state='+_state
    })

    var parsed_url = G.url.parse(window.location.href)
    if('agency' in parsed_url.searchKey){
      var agency = parsed_url.searchKey.agency.toUpperCase()
    }
    else {
     var agency = $("#filter-agency span:first").text();
    }
    if('state' in parsed_url.searchKey){
      var state = parsed_url.searchKey.state.toUpperCase()
    }
    else {
     var state = 'PUNJAB';
    }

    $('#subtitle').text(state_name_alias[state])

    var states = ['PUNJAB', 'UP', 'MANIPUR', 'UTTARAKHAND', 'GOA'];
    var states = _.without(states, state)
    _.each(states, function(state) { $("#otherstates").append('<p data-type="state">' + state + '</p>') })
    var agencies = agency_order //['ABP CSDS', 'TIMES-NOW', 'NEWS24', 'IT-AXIS']
    _.each(agencies, function(agency) { $("#otheragency").append('<p data-type="agency">' + agency_alias[agency] + '</p>') })

    $("#filter-state.dropdown span:first").text(state)
    $("filter-agency.dropdown span:first").text(agency)
    data = _.filter(data, function(d){ return d.STATE == state && d.AGENCY == agency_alias_reverse[agency] })

    $("#agency-name").css({'display': 'none'}, {'margin-top': '30px'})
    $(".visuals").css({'margin-top': '30px'})
    if(data.length == 0){
      $('#nodata').show()
    }else{
      $('#nodata').hide()
      drawDonut(data)
      drawStacked(data)
    }
  })

  $('body')
    .on("mouseover", ".dropdown", function(){
      $(".dropdown-content").removeClass('none')
    })

    .on("mouseout", ".dropdown", function(){
      $(".dropdown-content").addClass('none')
    })

    .on("click", ".dropdown-content p", function(){

      if($(this).attr('data-type') == 'state'){
        var tmp = $(".dropdown span:first").text()
        $("#filter-state.dropdown span:first").text($(this).text())
      }else{
        var tmp = $(".dropdown span:last").text()
        $("#filter-agency.dropdown span:last").text($(this).text())
        // console.log($(".agency span").text(), $(".agency span").text()=='2012')
        // if($(".agency span").text() == "2012"){
        //   $("#agency-name").css({'display': 'none'})
        //   $('.visuals').css({'margin-top': '30px'})
        // }
        // else {

        //   $("#agency-name").show()
        //   $("#agency-name").text($(this).text())
        // }
      }

      var curr_state = $("#filter-state.dropdown span:first").text()
      $('#subtitle').text(state_name_alias[curr_state])

      $(this).text(tmp)
      $(".dropdown-content").addClass('none')

      $("#agency-donut").empty()
      $("#agency-stacked").empty()
      var agency = $(".dropdown span:last").text()
      var state = $(".dropdown span:first").text();

      d3.csv('data/temp.csv', function(data){
        data = _.filter(data, function(d){ return d.AGENCY == agency_alias_reverse[agency] && d.STATE == state })
        if(data.length == 0){
          $('#nodata').show()
        }else{
          $('#nodata').hide()
          drawDonut(data)
          drawStacked(data)
        }
      })
    })
})

function drawDonut(data){
  var width = 400;
  var height = 400;

  var svg = d3.select("#agency-donut")
                .append('svg')
                .attr("preserveAspectRatio", "xMidYMid meet")
                .attr("viewBox", "0 0 " + width + " " + height)
                // .attr('width','100%')
                // .attr('height','530px')
  // var width = svg.node().getBoundingClientRect().width
  // var height = svg.node().getBoundingClientRect().height
  var radius = Math.min(width, height) / 2;
  var chartLayer = svg.append("g").classed("chartLayer", true)

  var arc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 90)
    .padAngle(0.03)
    .cornerRadius(2)

  var pie = d3.pie()
    // .sort(null)
    .value(function(d) { return parseRange(d.PREDICTED); });

  var center_texts = $("#filter-agency span:first").text()
  center_texts = center_texts == '2012' ? ['2012'] : ['RACE TO', raceto[$("#filter-state span:first").text()]]

  var centertext = svg.append('g')
      .attr('transform','translate(' + width/2 + ',' + ((height/2)+15) + ')')
      .append('text')

  var text_dy = [-20, 20]
  center_texts.forEach(function(t, i){
    centertext
      .append('tspan')
      .attr('x', 0)
      .attr('y', center_texts.length > 1 ? text_dy[i] : 0)
      .text(t)
      .attr('text-anchor','middle')
      .attr('fill','black')
      .style('font-size', $("#filter-agency span:first").text() == '2012' ? '50px' : '40px')
      .style('font-family', 'Helvetica Inserat LT Std')
  })

  var party_g = chartLayer.selectAll("g")
      .data([data])
      .enter()
      .append("g")
      .attr("transform", "translate("+[width/2, height/2]+")")

  var party_arc = party_g.selectAll(".arc").data(pie).enter().append("g").classed("arc", true)

  var path = party_arc.append("path")
      .attr("d", arc)
      .attr("id", function(d, i) { return "arc-" + i })
      .attr("stroke", "black")
      .attr("fill", function(d,i){
        var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;

        if(currZoomLevel > 0.9 && _.includes(['SP','SP + CONG', 'SP+CONG'],d.data.PARTY.toUpperCase())){
          return '#2CB82C';
        }else if(currZoomLevel > 0.9 && _.includes(['BSP'],d.data.PARTY.toUpperCase())){
          return '#C547A3';
        }else{
          return partyColors[d.data.PARTY] || defaultColor
        }

      })
      .on('click', function(d){
      })

  path.transition()
        .duration(3000)
        .attrTween('d', function(d) {
          var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
          return function(t) {
            return arc(interpolate(t));
          };
        });

  setTimeout(function(){
    party_arc.append("text")
        .attr("dx", 0)
        .attr("dy", -5)
        .append("textPath")
        .attr("xlink:href", function(d, i) { return "#arc-" + i; })
        .style("font-size", "30px")
        .text(function(d) {
          if((d.endAngle - d.startAngle)>.7) {return d.data.PARTY }
        })
        .attr('class','filter-types poll-filter')
        .attr("transform", function(d, i) {
                  var c = arc.centroid(d);
                  return `translate(${c[0]}, ${c[1]}) rotate(${d.angle * 180 / Math.PI - 90}) ` + 50
              })
        .style('fill','white')
        .style('font-weight','bold')
  }, 2800);
}


function drawStacked(data){
  _.each(data, function(row) {
    if($("#filter-agency span:first").text() == '2012'){
      row.metric = +row.SEATSWON;
      row.show = +row.SEATSWON;
      row.dummy = 0;
    } else {
      var val1 = row.PREDICTED.split('-')[0] == undefined ? 0 : row.PREDICTED.split('-')[0]
      var val2 = row.PREDICTED.split('-')[1] == undefined ? 0 : row.PREDICTED.split('-')[1]
      row.metric = d3.max([+val1, +val2])
      row.show = +val2 > +val1 ? val1 + '-' + val2 : val1
      row.dummy = 0
    }
    row.total = row.metric + row.dummy
  })

  var key = ["metric", "dummy"];
  initStackedBarChart.draw({
    data: data,
    key: key,
    element: 'agency-stacked',
    colors: ["#BABAB9", "#888888"],
    margins: {top: 160, right: 40, bottom: 30, left: 250}
  });

}

function parseRange(val){
    if(val.indexOf('-') > -1){
// debugger;
      val = _.map(val.split('-'),_.parseInt)
      return _.sum(val)/val.length
    }else{
      return parseInt(val)
    }

}

function parseMaxRange(val){
  if(val.indexOf('-') > -1){
    val = _.map(val.split('-'),_.parseInt).sort()
    return val[1]
  }else{
    return parseInt(val)
  }
}

var initStackedBarChart = {
  draw: function(config) {
    domEle = config.element,
    stackKey = config.key,
    data = config.data,
    margin = config.margins || {top: 20, right: 40, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 760 - margin.top - margin.bottom,
    xScale = d3.scaleLinear().rangeRound([0, width]),
    yScale = d3.scaleBand().rangeRound([height, 0]).padding(0.1),
    colors = config.colors
    color = colors != undefined ? d3.scaleOrdinal().range(colors) : d3.scaleOrdinal(d3.schemeCategory20)
    xAxis = d3.axisBottom(xScale),
    yAxis =  d3.axisLeft(yScale),
    svg = d3.select("#"+domEle).append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "-50 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var selected_state = $("#filter-state span:first").text();
    var heading = d3.select('#'+domEle+' svg').append('g').attr('transform','translate(150,20)')
    heading.append('text')
            .text('TOTAL SEATS - '+total_seats[selected_state])
            .style('fill', '#D2D2D1').attr('class','filter-types')
            .attr('dx',45)
            .attr('dy',110)
            .style('font-size', '3.2em')
            .style('font-family', 'Helvetica Inserat LT Std')
            .style('fill', '#ffffff')

    heading.append('text')
            .text($("#filter-agency span:first").text() == '2012' ? 'RESULTS - 2012' : $("#filter-agency span:first").text())
            .style('fill', '#D2D2D1')
            .attr('class','filter-types')
            .attr('dx',45)
            .attr('dy',34)
            .style('font-size', '4.3em')
            .style('font-family', 'Helvetica Inserat LT Std')

    var stack = d3.stack()
      .keys(stackKey)
      /*.order(d3.stackOrder)*/
      .offset(d3.stackOffsetNone);

    data = _.sortBy(data, d => d.total).reverse()

    var layers= stack(data);
      data.sort(function(a, b) { return a.total - b.total; });
      yScale.domain(data.map(function(d) { return d.PARTY; }));
      xScale.domain([0, d3.max(layers[layers.length - 1], function(d) { return d[0] + d[1]; }) ]).nice();

    var layer = svg.selectAll(".layer")
      .data(layers)
      .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });
      layer.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) { return yScale(d.data.PARTY); })
        .attr("x", function(d){ return 0 })
        .attr("height", yScale.bandwidth()-30)  // yScale.bandwidth()
        .transition()
        .duration(1000)
        .delay(function (d, i) {
          return i * 1000;
        })
        .attr("x", function(d) { return xScale(d[0]); })
        .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]) })
        .attr('fill', "#FFD3AB");
    setTimeout(function(){
      layer.selectAll('.values')
            .data(data)
          .enter().append('text')
          .attr("y", function(d) { return yScale(d.PARTY)+yScale.bandwidth()/2 + 15; })
          .attr("x", function(d) { return xScale(d[stackKey[0]] + d[stackKey[1]]) + 20 })
          .text(function(d) {
            // if ($("#filter-agency span:first").text() == '2012') {
            //   return d.total
            // } else {
            //   var _val = d[stackKey[0]] > d[stackKey[1]] ? d[stackKey[0]] : d[stackKey[0]] + '-' + d[stackKey[1]]
            //   return _val
            // }
            return d.show;
          })
          .style('font-size', d => {
            var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
            return currZoomLevel > 0.9 ? '7rem' : '5.5rem'
          })
          .style('font-family',  'Helvetica Inserat LT Std')
          // .attr('fill', '#BABAB9');
          .attr('fill', '#000')
          .attr('letter-spacing', '.08em');
    }, (data.length*1000));

      svg.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(0,-10)")
      .call(yAxis).selectAll('text')
                    .attr('fill', function(d){
                      var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
                      if(currZoomLevel > 0.9 && _.includes(['SP','SP + CONG', 'SP+CONG'],d.toUpperCase())){
                        return '#2CB82C';
                      }else if(currZoomLevel > 0.9 && _.includes(['BSP'],d.toUpperCase())){
                        return '#C547A3';
                      }else{
                        return partyColors[d] || defaultColor
                      }
                    })
                    .style('font-size', d => {
                      var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
                      return currZoomLevel > 0.9 ? '7rem' : '5.5rem'
                    })
                    .style('font-weight', 'bold')
                    .style('font-family',  'Helvetica Inserat LT Std');
  }
}