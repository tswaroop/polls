var sections = [{'name': 'SEATS', 'id': 'live_id'},
  {'name': 'MAP', 'id': 'map_id'},
  {'name': 'TABLE', 'id': 'result_id'}]
$(function(){

  d3.json('/data/eng_hindi_map.json', function(data){
    hindi_words_mapping = data
    var all_states = [
      'uttar pradesh',
      'uttarakhand',
      'punjab',
      'goa',
      'manipur'
    ]

    var all_years = [
      '2009',
      '2012',
      '2014'
    ]

    partyColors['OTH'] = '#8B6D53'
    partyColors['left'] = '#A0A3A0'

    var parsed_url = G.url.parse(location.href)
    var lang = parsed_url.searchKey.lang || null
    var state = (parsed_url.searchKey.state || 'uttar pradesh').replace('-',' ')
    var section = (parsed_url.searchKey.section || 'seats').replace('-',' ')
    var year = parsed_url.searchKey.year || '2017'
    var constituency = parsed_url.searchKey.constituency || null

    // var sections = ['seats', 'map', 'result']

    all_states = _.filter(all_states, function(d){ return d != state})
    // sections = _.filter(sections, function(d){ return d != section})
    all_years.splice(all_years.indexOf(year),1)

    $("#header").html(_.templateFromURL('live/snippets.html','#header-template')({
      data: {
        states: all_states,
        selected: state,
        // sections: sections,
        // section_sel: section
      }
    }))


    if(lang && lang.toUpperCase() == 'HIN'){
      $("#title").css("margin-left", "calc(50% - 75px)");
    }

    if(state && year && checkValidity(state,year)){
      $(".dropdown span:first").text(state.toUpperCase())
      $(".dropdown span:last").text(year)
    }

    displayFilters($(".dropdown span:first").text().toLowerCase())


    draw(state, year)

  })
})

function get_party_seats(state, live_cnt){
    var st_parties = state_cand_dict[state.toUpperCase()].reverse()
    var party_res = []
    _.each(st_parties, function(d){
      temp = {'Name': d, 'Seats': 0}
      if(live_cnt[d]){
        temp = {'Name': d, 'Seats': live_cnt[d]}
      }
      party_res.push(temp)
  })
  party_res = _.sortBy(party_res, 'Seats').reverse()
  return party_res
}

var sunburst_modified = new ArcResult('#result-arc')
var arc_tag = sunburst_modified.createSkeleton()
var arc_legend = d3.select('#result-arcSVG')
      .attr("viewBox", "0 0 1250 950")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")
      .attr("class", "arc-legend")
      .attr("transform", "translate(50, 50)")

var lgnd_tot = d3.select('#result-arcSVG')
      .append("g")
      .attr("class", "arc-total")
      .attr("transform", "translate(50, 40)")
      .append("text")

function upper(val){
  return val.toUpperCase()
}

function drawTable(data, q, prev_data, total_votes, tot_data){
      // var state =(q.state || ['uttar pradesh'])[0].replace('-',' ')
      var f_tot_data = filter_data(tot_data, q)
      var alliance_votes = {}, party_votes = {}
      _.each(f_tot_data[1], function(v, k){
          alliance_votes[k] =   _.sum(_.map(v, function(d){ return d.VOTES}))
      })

      //alliance_votes = _.sortBy(alliance_votes, 'Votes').reverse()
      // console.log(_.groupBy(tot_data, 'PARTY'))
      _.each(_.groupBy(tot_data, 'PARTY'), function(v, k){
        party_votes[k] = _.sum(_.map(v, function(d){ return d.VOTES}))
      })
      // console.log(alliance_votes, party_votes)
      var _tot_votes = _.sum(_.map(f_tot_data[0], function(d){ return d.VOTES }))

      $("#table-result").html(_.templateFromURL('live/snippets.html','#resultTable')({
      data: {'curr_data': data,
        'prev_data': prev_data,
        'total_votes': total_votes,
        'alliance_votes': alliance_votes,
        'party_votes': party_votes,
        '_tot_votes': _tot_votes}
    }))

    d3.selectAll("#table-result rect").each(function(d){
      var sel = d3.select(this)
      var wdth = sel.attr("width")
      sel.attr("width", 0)
        .transition().duration(1000).delay(500).ease(d3.easeLinear)
        .attr("width", wdth)
    })

}


function draw_partybtns(data_filterd, state, q){
  var live_dict = {}

  var declared = 0
  _.each(data_filterd, function(v, k){
      declared += v.length;
      live_dict[k] = v.length;
  })
  party_sel = q.party_alnc || []
  var tot_seats = total_seats[state.toUpperCase()]
  var prty_seats = get_party_seats(state, live_dict)
  prty_seats = _.sortBy(prty_seats, 'Name')
  $("#party-btns").template(
    {data:{
      'prty_seats': prty_seats,
      'filter': party_sel,
      'total_seats': tot_seats,
      'declared': declared}
    })
}


function draw_arc(arc_filtrd, state){

  arc_data = _.map(arc_filtrd, function(v, k){
      return {'Name': k, 'Seats': v.length}
  })

  arc_res = _.sortBy(arc_data, 'Seats').reverse()

  // arc_res = [{'Name': 'BJP', 'Seats': 22},
  //     {'Name': 'SP+CONG', 'Seats': 16},
  //     {'Name': 'BSP', 'Seats': 5},
  //     {'Name': 'OTH', 'Seats': 3}]

  // console.log(arc_res)
  var tot_seats_dict = {
      'uttar pradesh': [403, 5, 80, 3],
      'punjab': [117, 5, 23, 2],
      'goa': [40, 2, 20, 0],
      'uttarakhand': [70, 2, 35, 0],
      'manipur': [60, 2, 30, 0]
  }

  // var state = 'uttar pradesh'
  var state_cnt = tot_seats_dict[state]
  var tot_seats = state_cnt[0]
  var n_g = state_cnt[1]
  var each_circle = state_cnt[2]

  var party_res_dict = {}
  var party_block_dict = {}

  var live_dict = {}

  _.each(arc_res, function(d){
      var party_fill = Math.floor(d.Seats / n_g)
      party_block_dict[d.Name] = {'name': d.Name, color: partyColors[d.Name], size: 1}
      party_res_dict[d.Name] = [party_fill, d.Seats % n_g]
      live_dict[d.Name] = d.Seats
  })

  var tot_res = []
  for (var n=0; n<n_g; n++){
    var res = []
    tot_res.push(res)
  }

  var i=0
  var rem= []
  _.each(arc_res, function(e){
    var party_seats = e.Seats
    var prty_block = party_block_dict[e.Name]
    for(i, j=i; i<(j + party_seats); i++){
      bkt = (i % n_g)
      // console.log(prty_block)
      // if(tot_res[bkt].length < each_circle)
        tot_res[bkt].push(prty_block);
      // else{
      //   tot_res[n_g - 1].push(prty_block)
      //   rem.push(prty_block)
      //   }
    }
  })


  for(var z=i; (z<tot_seats) && (i > (n_g * each_circle)); z++){
    var left = {'name': 'left', color: partyColors['left'], size: 1}
    tot_res[n_g - 1].push(left);
  }


  for (var n = 0; n < n_g; n++){
    for(var k = tot_res[n].length; k < each_circle; k++)
    {
      var left = {'name': 'left', color: partyColors['left'], size: 1}
      tot_res[n].push(left)
    }
  }

  var t_size = 0
  var outerdata = _.map(party_res_dict, function(d, k){
    var left_t = 1
    if(d[1] == 0) left_t = 0;
    var size = (d[0] + left_t)
    var out_res = {
      'name': k,
      color: partyColors[k],
      size: size
    }
    t_size += size
    return out_res
  })

  if((each_circle - t_size) > 0)
  outerdata.push(
    {
      'name': 'left',
      'color': partyColors['left'],
      'size': (each_circle - t_size)
  });

  var p_seats = get_party_seats(state, live_dict)
  var declared = _.sum(_.map(p_seats, function(d){ return d.Seats;}))

  var sunburst_sample_data = {
    name: 'root',
    color: 'white',
    children: res,
    layers: n_g,
    tot_res: tot_res,
    outerdata: outerdata,
    tot_seats: state_cnt,
    declared: declared
  }

  arc_tag.render(sunburst_sample_data)


  // lgnd_tot
  //   .text(mask_to_hindi("Total") + ' ' + declared + " / " + total_seats[state.toUpperCase()])

  function key_bind(v, i){
    var key
    if(v) key = v.Name + v.Seats + i;
    return key
  }
  var lgnd = arc_legend.selectAll('g').data(p_seats, key_bind)

  var lg_wdth = 170, lg_height = 150;

  var currResolution = window.innerWidth;

  if (currResolution <= 1366){
      lg_wdth = 140;
      lg_height = 120;
  }
  if (currResolution<=3273 && currResolution>2100){
      lg_wdth = 170;
      lg_height = 150;
  }

  lgnd.exit().remove()

  lgnd.enter()
    .append("g")
    .each(function(d, i){
      var sel = d3.select(this)
      var id = "rect_lgnd_" + i;
      var y_pos = i * (lg_height + 45);

      sel.html(rectangle_3d_modf(lg_wdth, lg_height, partyColors[d.Name], d))
        .attr("transform", "translate(0, 0)")
        .transition().duration(1000).delay(500).ease(d3.easeLinear)
        .attr("transform", "translate(0," + y_pos + ")")

    })

  d3.selectAll(".class_num").each(function(e){
      var sel = d3.select(this)
      var finalValue = sel.text()
      var initialValue = 0
      sel.text(0)
      .transition()
      .delay(1000)
      .duration(2500)
      .tween('text', function(d){
        var interpolation = d3.interpolateNumber(initialValue,finalValue)
        var that = d3.select(this)
        return function(t){
          return that.text(parseInt(interpolation(t)))
        }
      })
    })

}// arc component

// d3.json('/temp_live_karvy', function(karvy_data){
//   // console.log(karvy_data)
// })

var data_final, party_alnc_lst, total_votes, tot_data
function draw(state, year, refresh){
  var refresh_flag = 'no';
  if(refresh == 'refresh') refresh_flag = 'yes';
  d3.json('/temp_get_livedata?state=' + state + '&refresh=' + refresh_flag, function(data_res){
    var data = data_res['data']
    tot_data = data_res['tot_data']
    total_votes = data_res['tot_votes']
    data_final = data
    // party_alnc_lst = _.groupBy(data, 'PARTY_ALLIANCE')
    var parsed_url = G.url.parse(location.href)
    var q = parsed_url.searchList
    var state =((q.state || ['uttar pradesh'])[0]).replace('-',' ')
    // var data = _.filter(data, function(d) { return d.YEAR == year })
    var data_filterd = filter_data(data, q, state)
    var data = data_filterd[0]
    var topoJSONPath = 'geojson/' + state_file_mapping[state]

    var all_constituencies = []
    var filtered_constituencies = []
    var non_other_parties = []
    var win_margin = {}

    // var fgroups = _.groupBy(data, 'AC_NAME')

    // _.each(_.keys(fgroups), function(key){
    //   var candidates = fgroups[key]
    //   var sorted = _.reverse(_.sortBy(candidates, function(d){ return parseInt(d.VOTES) }))
    //   var winner = sorted[0].VOTES
    //   var leading = sorted[1].VOTES
    //   var sum = _.sum(_.map(sorted, function(d){ return parseInt(d.VOTES) }))
    //   fgroups[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == winner })].PARTY
    //   win_margin[key] = (winner/sum) - (leading/sum)
    // })

    // fgroups = _.invertBy(fgroups)
    // $(".legendPara").each(function(i, legend){
    //   console.log(legend)
    //   var party = $.trim($(legend).text().toUpperCase().split(' - ')[0])
    //   non_other_parties.push(party)
    //   all_constituencies = all_constituencies.concat(fgroups[party])
    // })

    // _.each(_.keys(fgroups), function(key){
    //   filtered_constituencies = filtered_constituencies.concat(fgroups[key])
    // })

    // draw arc results

    draw_arc(data_filterd[1], state)
    draw_partybtns(data_filterd[1], state, q)
    drawMap(state, topoJSONPath, data_filterd, q)
    drawTable(data_filterd[1], q, data_filterd[2], total_votes, tot_data)
  })
}


function drawMap(state, topoJSONPath, data_f, q){
  d3.json(topoJSONPath, function(topodata){
    var data = data_f[0]
    var parties = data_f[1]

    var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
    var currResolution = window.innerWidth;
    // topoLayer.eachLayer(function(layer) {
    //   map.removeLayer(layer)
    // })

    _.each(circles, function(layer){
      map.removeLayer(layer)
    })

    topoLayer.clearLayers();
    topoLayer.addData(topodata)
    topoLayer.addTo(map)
    var latlngs = []
    var all_groups = _.groupBy(data, 'AC_NAME')
    // console.log(all_groups)
    // _.each(_.keys(all_groups), function(key){
    //   var candidates = all_groups[key]
    //   var max = _.max(_.map(candidates, function(d){ return parseInt(d.VOTES) }))
    //   all_groups[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == max })]
    // })

    topoLayer.eachLayer(function(layer) {
      var center = layer.getBounds().getCenter()
      var area = layer.feature.properties.AC_NAME

      var parsed_url = G.url.parse(location.href)
      var constituency = parsed_url.searchKey.constituency || null

      layer.setStyle({
        weight: currResolution > 1366 ? 2.5 : 0.5,
        fillColor: currResolution > 1366 ? '#6B6B6B' : '#D6C5A9',
        fillOpacity: 1,
        color: currResolution > 1366 ? 'black' : 'white',
      })
      // console.log(_.has(all_groups, area.toUpperCase()))
      // if(_.has(filtered_groups, area.toUpperCase()) || filtered_groups.length == 0){
      // if(_.has(all_groups, area.toUpperCase())){
          var contestants = []
          var top_3 = []
          // var contestants = _.filter(curr_candidates, function(d){ return d.AC_NAME == area.toUpperCase() })

          // var top_3 = _.reverse(
          //   _.sortBy(
          //     _.filter(
          //       data, function(d){
          //         return d.AC_NAME == area.toUpperCase()
          //       }
          //     ),
          //     function(d){
          //       return parseInt(d.VOTES)
          //     }
          //   )
          // ).slice(0,3)
          var party = null, left_clr = defaultColor;
          var party_col = "PARTY_ALLIANCE"

          if(q['party']){
            party_col = "PARTY";
          }

          if (all_groups[area.toUpperCase()]){
            party = all_groups[area.toUpperCase()][0][party_col]
          }
          else{
            left_clr = partyColors['left']
          }

          var party_clr = left_clr;
          if(party){
            party_clr = partyColors[party] || partyColors['OTH']
            if(!parties[party]) parties[party] = [];
          }

          if(state.toUpperCase() == 'UTTAR PRADESH'){
            layer.setStyle({
              weight: currResolution > 1366 ? 2.5 : 0.5,
              fillColor: party_clr,
              fillOpacity: 1,
              color: 'black',
            })
            layer.options.data = {
              area: area,
              contestants: contestants,
              top_3: top_3,
              party: party,
              color: party_clr,
            }
            layer.on('click', function(d){
              var parsed_url = G.url.parse(location.href)
              // if(this.options.fillColor == 'black'){
              //   this.setStyle({ fillColor: d.target.options.data.color })
              //   // $("#constituency").hide();
              //   // $("#filters").show();
              //   parsed_url.update({constituency: null})
              // }else{
              //   topoLayer.eachLayer(function(layer) {
              //     if(layer.options.fillColor == 'black'){
              //       layer.setStyle({ fillColor: layer.options.data.color })
              //     }
              //   })
              //   this.setStyle({ fillColor: 'black' })
              //   // displayConstituency(d.target.options.data)
              //   parsed_url.update({constituency: d.target.options.data.area.toUpperCase() })
              // }
              if(party_clr != left_clr){
                render_modal(state, d.target.options.data.area.toUpperCase())
              }
              // history.pushState({}, '', parsed_url.toString());
            })

            if(constituency){
              if(area.toUpperCase() == constituency.toUpperCase()){
                // layer.fireEvent('click')
              }
            }

            layer.on('mouseover', function(d){

                layer.openPopup()

            })

            layer.on('mouseout', function(d){
                layer.closePopup()
            })

          }else{
            if(all_groups[area.toUpperCase()])
            latlngs.push({
              center: center,
              area: area,
              contestants: contestants,
              top_3: top_3,
              party: party,
              partyColor: party_clr
            });
          }
      // }
      // }

    })

    map.fitBounds(topoLayer.getBounds())

    circles = []
    d3.selectAll('svg.leaflet-zoom-animated > g')
      .each(function(e){
        var sel = d3.select(this)
        _.each(parties, function(v, k){
          var p_clr = partyColors[k] || defaultColor;
          var grdnt = '<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="' + p_clr.slice(1) +'"><stop offset="0%" style="stop-color:'+ p_clr + ';"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>'
          sel.insert('defs').html(grdnt)
        })
      })

    _.each(latlngs, function(obj){
      var circle = new L.Constituency(
        [
          obj.center.lat,
          obj.center.lng
        ],
        state_formfactor[$(".dropdown span:first").text().toLowerCase()],
        {
          fillColor: currResolution > 1366 ? 'url(' + obj.partyColor + ')' : obj.partyColor,
          color: 'black',
          class: '.circle-shadow',
          weight: 2,
          fillOpacity: 1.0,
          data: {
            area: obj.area,
            color: obj.partyColor,
            contestants: obj.contestants,
            top_3: obj.top_3,
            party: obj.party
          }
      })

      circle.addTo(map)
      circles.push(circle)

      circle.on('click', function(d){
        render_modal(state, d.target.options.data.area.toUpperCase())
      })

      circle.on('mouseover', function(d){
          circle.openPopup()
      })

      circle.on('mouseout', function(d){
          circle.closePopup()
      })

    })

    if(currResolution > 1024){

      circles.forEach(function(circle){
        circle.bindPopup(function(d){ return '<b>' + mask_to_hindi(d.options.data.area.toUpperCase()) + '</b>' }, {closeButton: false})
      })

      if(state.toUpperCase() == 'UTTAR PRADESH'){

        topoLayer.eachLayer(function(layer){
          layer.bindPopup(function(d){ return '<b>' + mask_to_hindi(d.options.data.area.toUpperCase()) + '</b>' }, {closeButton: false})
        })

      }
    }

  })
}

function displayConstituency(data){
  $("#filters").hide()
  $("#constituency").show();
  $("#constituency").html(
    _.templateFromURL('live/snippets.html', '#constituency-template')({data: data})
  )
}

function mask_to_hindi(english_phrase) {

  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null
  english_phrase = english_phrase.toString()
  if(lang && lang.toUpperCase() == 'HIN'){
    var hindi_phrase = hindi_words_mapping[english_phrase.toUpperCase()];
    return hindi_phrase || english_phrase
  }else{
    return english_phrase
  }
}

function checkValidity(state,year){
  var flag = true;

  if(!_.includes(['uttar pradesh','punjab','goa','uttarakhand','manipur'], state.toLowerCase())){
    flag = false
  }

  if(!_.includes(['2012','2009','2014'], year)){
    flag = false
  }

  return flag;

}

function filter_data(data, q, state) {
  var result = [],
      status = {finished:0, counting:0, awaited:0, total:0},
      applied_filters = {},
      constituency = new Set([])

  var filter_map = {
      'region': 'REGION',
      'population': 'RELSTATUS',
      'phase': 'PHASE',
      'geography': 'GEOSTATUS',
      'reservation': 'AC_TYPE',
      'margin': 'margin',
      'party_alnc': 'PARTY_ALLIANCE',
      'party': 'PARTY',
      'factor': 'FACTOR',
      'BSP_MUSLIM': 'BSP_MUSLIM',
      'SHIVPAL_FACTOR': 'SHIVPAL_FACTOR',
      'party_lyr': 'LY_WINNER',
      'bastion': 'BASTION',
      'lead_2014': "LEADS_2014"
    }

  _.each(q, function(val, key) {
    if (!key.match(/^(state|year)$/)) {
      applied_filters[key] = val.map(upper)
    }
  })

  data_filter = _.filter(data, function(row){
    flag = true
    _.each(applied_filters, function(val, key){
      if (key.indexOf("population") >= 0)
        key = 'population';
      if((key != 'margin') && (filter_map[key]))
      {
        flag = (flag && val.includes(row[filter_map[key]].toString()));
      }
      if(key=='margin'){
        _.each(val, function(v){
        var row_val = parseFloat(row[filter_map[key]])
        v = parseFloat(v)
        flag = flag && (row_val < v)
        })
      }
    })

    if(flag == true) constituency.add(row['AC_NAME']);
    return flag
  })

  var party_col = "PARTY_ALLIANCE";
  // if(q['party']) {
  //   party_col = "PARTY"
  // }
  var lst_yr = _.groupBy(data_filter, 'CURR_PARTY_ALLIANCE')
  var party_cnt = _.groupBy(data_filter, party_col)
  return [data_filter, party_cnt, lst_yr]
}

function redraw(){
  var q = G.url.parse(location.href).searchList
  var state =(q.state || ['uttar pradesh'])[0].replace('-',' ')
  var topoJSONPath = 'geojson/' + state_file_mapping[state]
  data_filterd = filter_data(data_final, q, state)

  displayFilters(state)
  draw_arc(data_filterd[1], state)
  draw_partybtns(data_filterd[1], state, q)
  drawMap(state, topoJSONPath, data_filterd, q)
  drawTable(data_filterd[1], q, data_filterd[2], total_votes, tot_data)
}


