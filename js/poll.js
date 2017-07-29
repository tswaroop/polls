$(function(){

  $('.gotohome').on('click', function(){
    window.location = "/home"
  })

  d3.csv('data/polls.csv', function(data){

    var parsed_url = G.url.parse(window.location.href)
    if('state' in parsed_url.searchKey){
      var state = parsed_url.searchKey.state.toUpperCase()
    }
    else {
     var state = 'PUNJAB';
    }

    // var states = _.without(_.uniq(_.map(data,'STATE')), 'PUNJAB')
    var states = ['PUNJAB', 'UP', 'MANIPUR', 'UTTARAKHAND', 'GOA'];
    var states = _.without(states, state)
    _.each(states, function(state) { $("#otherstates").append('<p data-type="state">' + state + '</p>') })

    $("#filter-state.dropdown span:first").text(state)
    var data = _.filter(data, function(d){ return d.STATE == state })

    drawAnalysis(data)
  })

  $('.gotoagency').on('click', function(){
    var _st = $("#filter-state.dropdown span:first").text()
    window.location = "/agency?state="+_st
  })

  $('body')
    .on("mouseover", ".dropdown", function(){
      $(".dropdown-content").removeClass('none')
    })

    .on("mouseout", ".dropdown", function(){
      $(".dropdown-content").addClass('none')
    })

    .on("click", ".dropdown-content p", function(){

      var tmp = $(".dropdown span:first").text()
      $(".dropdown span:first").text($(this).text())
      $(this).text(tmp)
      $(".dropdown-content").addClass('none')

      $("#precision").empty()

      d3.csv('data/polls.csv', function(data){
        state = $(".dropdown span:first").text();
        var data = _.filter(data, function(d){ return d.STATE == state })
        drawAnalysis(data)
      })
    })

})

function drawAnalysis(data){
  var state = $(".dropdown span:first").text().toUpperCase()
  // var data = _.filter(data, function(d){ return d.STATE == state })
  var parties = _.uniq(_.map(data, 'PARTY'))

  var parties = _.map(parties, function(party){
    return {
      party: party,
      data: _.filter(data, function(d){ return d.PARTY == party })
    }
  })

  var _agns = _.uniq(_.map(data, d => d.AGENCY))
  var agencies = []
  _.each(_agns, function(agns){
    var _temp = {}
    _temp.agency = agns
    _temp.data = _.filter(data, function(d){ return d.AGENCY == agns })
    agencies.push(_temp)
  })
  agencies = agencies.slice(0, 4)
  orderArray(agency_order, agencies)
  agencies = agencies.filter(d => d != undefined)

  // var agencies = [
  //   {agency: 'CSDS', data: _.filter(data, function(d){ return d.AGENCY == 'CSDS' }) },
  //   {agency: 'CVOTER', data: _.filter(data, function(d){ return d.AGENCY == 'CVOTER' }) },
  //   {agency: 'AXIS', data: _.filter(data, function(d){ return d.AGENCY == 'AXIS' }) }
  // ]

  var svg = d3.select("#precision").append('svg')
              .attr('viewBox', '0 0 1366 600')
              .attr('preserveAspectRatio', 'xMinYMin meet')
              .attr('width','100%');

  // var width = svg.node().getBoundingClientRect().width
  // var height = svg.node().getBoundingClientRect().height
  var width = 1366, height = 600;
  var x_scale = d3.scaleLinear().range([250, width * 0.95])

  // Adding Shadows for rects as buttons
  var whiteshadow = svg.append('defs')

  var whln = whiteshadow.append('linearGradient')
              .attr('id', 'darkshadow')
              .attr('gradientUnits', 'objectBoundingBox')
              .attr('x1', '15%')
              .attr('x2', '12%')
              .attr('y1', '0%')
              .attr('y2', '100%')
  whln.append('stop')
       .attr('stop-color', '#5D5D5D')
       .attr('offset', '8%')
       .attr('stop-opacity', '1')

  whln.append('stop')
       .attr('stop-color', '#000')
       .attr('offset', '20%')
       .attr('stop-opacity', '1')

  var darkshadow = svg.append('defs')

  var bkln = whiteshadow.append('linearGradient')
              .attr('id', 'whiteshadow')
              .attr('gradientUnits', 'objectBoundingBox')
              .attr('x1', '15%')
              .attr('x2', '12%')
              .attr('y1', '0%')
              .attr('y2', '100%')
  bkln.append('stop')
       .attr('stop-color', '#A39999')
       .attr('offset', '10%')
       .attr('stop-opacity', '1')

  bkln.append('stop')
       .attr('stop-color', '#D5D5D5')
       .attr('offset', '20%')
       .attr('stop-opacity', '1')

  var local_maximum = _.max(_.map(data, function(d){ return parseMaxRange(d.PREDICTED) }))
  x_scale.domain([0, total_seats[state]])

  var path = svg.append('line')
       .attr('x1', x_scale(total_seats[state]/2))
       .attr('y1', 180)
       .attr('x2', x_scale(total_seats[state]/2))
       .attr('y2', 545)
       // .attr('class', 'actualline actualline-'+party.replace('+', 'plus'))
       .style('opacity', 1)
       .style('stroke', window.innerWidth < 1920 ? 'black' : 'black')
       .style('stroke-width',5)


  var gradient = svg.append("defs")
                    .append("linearGradient")
                    .attr("id", "gradient")
                    .attr("x1", "0%")
                    .attr("y1", "0%")
                    .attr("x2", "0%")
                    .attr("y2", "100%")
                    .attr("spreadMethod", "pad");

  gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white")
    .attr("stop-opacity", 1);

  gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "black")
      .attr("stop-opacity", 1);

  var subheader = svg.append('g').attr('class','subheader')
                  .attr('transform', 'translate('+ (width/2) +', 0)');

  subheader.append('text')
            .text(state_name_alias[state] || state)
            .attr('fill', window.innerWidth < 1920 ? '#000' : '#241A0F')
            .attr('x', 0)
            .attr('y', 35)
            .attr('text-anchor','middle')
            .style('font-family','Helvetica Inserat LT Std')
            .style('font-size', '40px')


  var n18logo = svg.append('defs').append('clipPath').attr('id', 'news18logo')
  n18logo.append('rect')
          .attr('width',110)
          .attr('height',60)
          .attr('rx',0)
          .attr('ry', 0)
          .attr('fill', 'grey')

  var n18btn = svg.append('g').attr('class','netws18btn')
                  .attr('transform', 'translate('+ (width-130) +', 0)')
                  .style('cursor','pointer')
                  .on('click', function(){
                    var _state = $("#filter-state.dropdown span:first").text();
                    window.location = "/net?state="+_state
                  });

  // n18btn.append('rect')
  //       .attr('width',125)
  //       .attr('height',45)
  //       .attr('rx',15)
  //       .attr('ry',15)
  //       .style('fill', 'grey')

  n18btn.append('image')
        .attr('width', '110')
        .attr('height', '70')
        .attr('x', 0)
        .attr('y', -14)
        .attr('xlink:href', './img/logo.png')
        .attr('clip-path', 'url(#news18logo)')
  // n18btn.append('text')
  //             .text("News18")
  //             .attr('fill', window.innerWidth < 1920 ? 'white' : '#241A0F')
  //             .attr('x', 62)
  //             .attr('y', 35)
  //             .attr('text-anchor','middle')
  //             .style('font-family','Helvetica Inserat LT Std')
  //             .style('font-size', '28px')

  // svg.append('text').attr('x',width * 0.24).attr('y',50).text('Parties').attr('class','filter-types').style('fill','white')
  // svg.append('text').attr('x',50).attr('y',100).text('Agencies').attr('class','filter-types').style('fill','white')
  var parties_repr = svg.selectAll('.parties').data(parties).enter().append('g').attr('class','parties')

  parties_repr.attr('transform',function(d){
    var x = (width * 0.15) + (parties.indexOf(d) * 200)
    if (state == 'UP') {
      return 'translate(' + (x+200) + ',60)'
    } else if (state == 'MANIPUR') {
      return 'translate(' + (x+160) + ',60)'
    } else if (state == 'GOA') {
      return 'translate(' + (x+160) + ',60)'
    } else if (state == 'UTTARAKHAND') {
      return 'translate(' + (x+240) + ',60)'
    } else if (state == 'PUNJAB') {
      return 'translate(' + (x+200) + ',60)'
    } else {
      return 'translate(' + (x+150) + ',60)'
    }

  })

  parties_repr.append('rect')
              .attr('width', window.innerWidth < 1920 ? 145 : 160)
              .attr('height', 60)
              .attr('rx',25)
              .attr('ry',25)
              .style('fill', window.innerWidth < 1920 ? '#6b6b6b' : 'black')
              .style('cursor','pointer')
              .attr('class',function(d) { return 'partyfilter-' + d.party.replace('+', 'plus') })
              .on('click', function(d){
                $('rect').not(this).removeClass('whiteborder')
                $(this).toggleClass('whiteborder')
                if(parseInt(d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity')) == 1){

                  d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity',0)

                  d3.selectAll('.agency-predictions').style('opacity',1)
                  d3.selectAll('.agency-predictions-text').style('opacity',1)

                  d3.selectAll('.actualline').style('opacity',0)

                }else{

                  d3.selectAll('.joiners').style('opacity',0)
                  d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity',1)

                  d3.selectAll('.agency-predictions').style('opacity',0.2)
                  d3.selectAll('.agency-predictions-text').style('opacity',0.2)

                  d3.selectAll('.partyfilter-'+d.party.replace('+', 'plus')).style('opacity',1)

                  d3.selectAll('.actualline').style('opacity',0)
                  d3.selectAll('.actualline-'+d.party.replace('+', 'plus')).style('opacity',0.5)

                }

                // if(parseInt(d3.selectAll('.partyfilter-'+d.party.replace('+', 'plus')).style('opacity')) == 1){
                // }else{
                // }

              })

  parties_repr.append('text')
              .style('fill', function(d){
                return partyColors[d.party] || defaultColor
              })
              .text(function(d){ return d.party || d.party })
              .attr('dx', window.innerWidth < 1920 ? 72 : 80)
              .attr('dy', window.innerWidth < 1920 ? 42 : 44)
              .attr('text-anchor','middle')
              .style('font-family','Helvetica Inserat LT Std')
              .style('font-size', window.innerWidth < 1920 ? '25px' : '38px')
              .style('cursor','pointer')
              .attr('class',function(d) { return 'partyfilter-' + d.party.replace('+', 'plus') })
              .on('click', function(d){
                if(parseInt(d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity')) == 1){
                  d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity',0)

                  d3.selectAll('.agency-predictions').style('opacity',1)
                  d3.selectAll('.agency-predictions-text').style('opacity',1)

                  d3.selectAll('.actualline').style('opacity',0)

                }else{
                  d3.selectAll('.joiners').style('opacity',0)
                  d3.selectAll('.joiners-'+d.party.replace('+', 'plus')).style('opacity',1)

                  d3.selectAll('.agency-predictions').style('opacity',0.2)
                  d3.selectAll('.agency-predictions-text').style('opacity',0.2)
                  d3.selectAll('.partyfilter-'+d.party.replace('+', 'plus')).style('opacity',1)

                  d3.selectAll('.actualline').style('opacity',0)
                  d3.selectAll('.actualline-'+d.party.replace('+', 'plus')).style('opacity',0.5)

                }
              })

  var agencies_repr = svg.selectAll('.agencies').data(agencies).enter().append('g').attr('class','agencies')
  var gap = [140, 120, 120, 80, 55]
  agencies_repr.attr('transform',function(d){
    var x = 5
    var iy = agencies.length > 1 ? (agencies.indexOf(d) * gap[agencies.length - 1]) : gap[agencies.length - 1]
    var y = (height * 0.36) + iy
    return 'translate(' + x + ',' + y + ')'
  })

  agencies_repr.append('rect')
               // .attr('class', 'darkborder')
               .attr('width',200)
               .attr('height',50)
               .attr('rx',25)
               .attr('ry',25)
               .style('fill', window.innerWidth < 1920 ? '#6b6b6b' : 'black')
               .style('cursor','pointer')
               .on('click', function(d){
                  var selected_agency = d.agency || "NoagencyName"
                  $('.'+selected_agency).fadeToggle("slow")
                  $(this).toggleClass('darkborder')
                  // window.location.href = '/agency?agency=' + d.agency
                })


  agencies_repr.append('text')
              .style('fill', function(d){
                return '#fff' //defaultColor
              })
              .text(function(d){ return d.agency.split('-').join(' ') })
              .attr('dx',100)
              .attr('dy', window.innerWidth < 1920 ? 35 : 32)
              .attr('text-anchor','middle')
              .style('font-family','Helvetica Inserat LT Std')
              .style('font-size','25px')
              // .style('cursor','pointer')
              // .on('click', function(d){window.location.href = '/agency?agency=' + d.agency })

  // var agencies_repr_g = agencies_repr.append('g')
  //                                    .attr('class', function(d){
  //                                       return d.agency || "NoagencyName";
  //                                    })

  agencies_repr.append('line')
               .attr('class', d => d.agency || "NoagencyName")
               .attr('x1', 250 )
               .attr('x2', width * 0.95)
               .attr('y1',25)
               .attr('y2',25)
               .attr('stroke', '#241A0F')
               .attr('stroke-width', 4)
               .style('display', 'none')

  var predictions = agencies_repr.selectAll('.predictions_grp')
                                 .data(function(d){ return d.data; })
                                 .enter()
                                 .append('g')

  // var predictions_rects = agencies_repr.selectAll('.agency-predictions')
  //              .data(function(d){ return d.data })
  //              .enter()
            predictions
               .append('rect')
               .attr('class', function(d){ //(parseInt(d.PREDICTED) == 0 || d.PREDICTED == 'NA')
                var predtemp = (d.PREDICTED == 'NA') ? 'unwanted-predictions' : 'agency-predictions partyfilter-' + d.PARTY.replace('+', 'plus')
                var temp = d.AGENCY || "NoagencyName";
                return predtemp + " " + temp
               })
               .attr('x', function(d){ return x_scale(parseRange(d.PREDICTED)) - 50 })
               .attr('width',80)
               .attr('height',50)
               .attr('y',0)
               .attr('rx',16)
               .attr('ry',16)
               .style('fill', function(d){
                return partyColors[d.PARTY] || defaultColor
               })
               .style('display', 'none')


  // var predictions_text = agencies_repr.selectAll('.agency-predictions-text')
  //                                     .data(function(d){ return d.data })
  //                                     .enter()
          predictions
            .append('text')
            .attr('class', function(d){
              var predtemp = (d.PREDICTED == 'NA') ? 'unwanted-predictions' : 'agency-predictions-text partyfilter-' + d.PARTY.replace('+', 'plus')
              var temp = d.AGENCY || "NoagencyName";
              return predtemp + " " + temp
             })
            .style('fill', 'black')
            .text(function(d){ return d.agency })
            .attr('x', function(d){ return x_scale(parseRange(d.PREDICTED)) - 46 })
            .attr('dx',35)
            .attr('dy', 34)
            .attr('text-anchor','middle')
            .style('font-family','Helvetica Inserat LT Std')
            .style('font-size','24px')
            .text(function(d){
              var _prediction = d.PREDICTED.split('-')
              return _prediction[0] == _prediction[1] ? _prediction[0] : d.PREDICTED
            })
            .style('display', 'none')



  var x_axis = svg.append("g")
      .attr("transform", "translate(0," + (height - 55) + ")")
      .call(d3.axisBottom(x_scale).tickSize(20))

  var tickColor = window.innerWidth < 1920 ? 'black' : 'black'

  x_axis.select('.domain').style('fill',"url(#gradient)").style('stroke',10)
  x_axis.selectAll('.tick line').style('stroke',tickColor).attr('y2', 25)
  x_axis.selectAll('.tick text').style('fill',tickColor).style('font-family','Helvetica Inserat LT Std').style('font-size','30px').attr('dy',30)

  _.each(parties, function(party){
    drawJoiners(svg, party.party, x_scale(total_seats[state]/2))
  })

  svg.append('text')
     .attr('x', x_scale(Math.floor(total_seats[state]/2)+1) - 2.5)
     .attr('y', 165)
     .attr('text-anchor', 'middle')
     .text('RACE TO ' + (Math.floor(total_seats[state]/2)+1))
     .style('fill', window.innerWidth < 1920 ? 'black' : 'black')
     .style('font-family', 'Helvetica Inserat LT Std')
     .style('font-size', '22px');

  // svg.append('text')
  //    .attr('x', x_scale(total_seats[state]/2) - 15)
  //    .attr('y', 180)
  //    .attr('text-anchor', 'end')
  //    .text('Half Way')
  //    .style('fill', 'green')
  //    .style('font-family', 'Helvetica Inserat LT Std')
  //    .style('font-size', '22px');
}

function orderArray(array_with_order, array_to_order) {
  var ordered_array = [],
      len = array_to_order.length,
      len_copy = len,
      index, current;

  for (; len--;) {
      current = array_to_order[len];
      index = array_with_order.indexOf(current.agency);
      ordered_array[index] = current;
  }

  //change the array
  Array.prototype.splice.apply(array_to_order, [0, len_copy].concat(ordered_array));
}

function accuracy(d){

  var predicted = d.PREDICTED
  var actual = d.SEATSWON

  if(predicted == 'NA' || actual == 'NA'){
    return 'NA'
  }

  predicted = parseInt(parseRange(predicted))
  actual = parseInt(actual)

  if(actual == 0){ return 0 }

  return predicted/actual

}

function parseRange(val){
  if(val.indexOf('-') > -1){
    val = _.map(val.split('-'),_.parseInt)
    // return _.sum(val)/val.length
    return _.min(val)
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

function drawJoiners(svg, party, xpos){
  var joiners = []

  // svg.append('line')
  //      .attr('x1', xpos)
  //      .attr('y1', 150)
  //      .attr('x2', xpos)
  //      .attr('y2', 425)
  //      .attr('class', 'actualline actualline-'+party.replace('+', 'plus'))
  //      .style('opacity',0)
  //      .style('stroke', 'green')
  //      .style('stroke-width',5)

  d3.selectAll('rect.partyfilter-'+party.replace('+', 'plus')).each(function(rect){
    if(d3.select(this).classed('agency-predictions')){
      var x = parseFloat(d3.select(this).attr('x'))
      var y = parseFloat(
                d3.select(this.parentNode.parentNode).attr('transform')  // d3.select(this.parentNode).attr('transform')
                  .replace('translate','')
                  .replace('(','')
                  .replace(')','')
                  .split(',')[1]
              )
      joiners.push([x,y+10])
    }else{
      var coords = d3.select(this.parentNode).attr('transform')
                  .replace('translate','')
                  .replace('(','')
                  .replace(')','')
                  .split(',')

      var x = parseFloat(coords[0]) + 62.5
      var y = parseFloat(coords[1]) + 60
      joiners.push([x,y])
    }
  })

  for(var i=0; i < joiners.length-1; i++){
    if(i > 0){
      joiners[i][0] += 25
      joiners[i][1] += 30
    }
    svg.append('line')
       .attr('x1', joiners[i][0])
       .attr('y1', joiners[i][1])
       .attr('x2', joiners[i+1][0] + 25)
       .attr('y2', joiners[i+1][1])
       .attr('class', 'joiners joiners-'+party.replace('+', 'plus'))
       .style('opacity',0)
       .style('stroke', partyColors[party] || defaultColor)
       .style('stroke-width', 6)
       .attr("stroke-dasharray", function(d) { return "5, 5"; })
  }

}