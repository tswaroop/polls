$(function(){

  d3.json('../data/eng_hindi_map.json', function(data){
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

    var parsed_url = G.url.parse(location.href)
    var lang = parsed_url.searchKey.lang || null
    var state = parsed_url.searchKey.state.replace('-',' ') || 'uttar pradesh'
    var year = parsed_url.searchKey.year || '2012'
    var constituency = parsed_url.searchKey.constituency || null

    all_states.splice(all_states.indexOf(state),1)
    all_years.splice(all_years.indexOf(year),1)

    $("#header").html(_.templateFromURL('snippets.html','#header-template')({
      data: {
        states: all_states,
        years: all_years
      }
    }))

    if(lang && lang.toUpperCase() == 'HIN'){
      $("#title").css("margin-left", "calc(50% - 75px)");
    }

    if(state && year && checkValidity(state,year)){
      $(".dropdown span:first").text(state.toUpperCase())
      $(".dropdown span:last").text(year)
    }

    // displayFilters($(".dropdown span:first").text().toLowerCase())

    d3.csv('../data/' + state_name_mapping[state.toLowerCase()] + '_candidates.csv', function(curr_candidates){

      if(constituency){
        draw(state, year, curr_candidates, [{column: 'AC_NAME', type: 'eq', value: constituency.toUpperCase()}])  
      }else{
        draw(state, year, curr_candidates, [])  
      }

    })
  })
})

function draw(state, year, curr_candidates, dataFilters){
  d3.csv('../data/' + state_name_mapping[state] + '_agg.csv', function(data){
    
    var parsed_url = G.url.parse(location.href)
    parsed_url.update({state: state.replace(' ','-'), year: year})
    window.history.pushState('page2', '', parsed_url.protocol + '://' + parsed_url.origin + parsed_url.pathname + '?' + parsed_url.search);

    var data = _.filter(data, function(d) { return d.YEAR == year })
    var topoJSONPath = '../geojson/' + state_file_mapping[state]

    var autocompleteOptions = {
      data: _.uniq(_.map(data,'AC_NAME')),
      placeholder: "Enter a constituency name",
      list: {
        match: {enabled: true },
        sort: {enabled: true },
        maxNumberOfElements: 10
      }
    }

    $("#constFilter").easyAutocomplete(autocompleteOptions)

    var all_constituencies = []
    var filtered_constituencies = []
    var non_other_parties = []
    var win_margin = {}

    var fgroups = _.groupBy(data, 'AC_NAME')
    
    _.each(_.keys(fgroups), function(key){
      var candidates = fgroups[key]
      var sorted = _.reverse(_.sortBy(candidates, function(d){ return parseInt(d.VOTES) }))
      var winner = sorted[0].VOTES
      var leading = sorted[1].VOTES
      var sum = _.sum(_.map(sorted, function(d){ return parseInt(d.VOTES) }))
      fgroups[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == winner })].PARTY
      win_margin[key] = (winner/sum) - (leading/sum)
    })

    fgroups = _.invertBy(fgroups)

    $(".legendPara").each(function(i, legend){
      var party = $.trim($(legend).text().toUpperCase().split(' - ')[0])
      non_other_parties.push(party)
      all_constituencies = all_constituencies.concat(fgroups[party])
    })

    _.each(_.keys(fgroups), function(key){
      filtered_constituencies = filtered_constituencies.concat(fgroups[key])
    })

    var other_constituencies = _.difference(filtered_constituencies,all_constituencies)
    var filtered_data = {}

    _.each(dataFilters, function(filter){

      if(!_.has(filtered_data, filter.column)){
        filtered_data[filter.column] = []
      }

      if(filter.column == 'PARTY'){

        if(filter.value == 'OTH'){
          var filtered = _.filter(data, function(d){ return _.includes(other_constituencies, d.AC_NAME) })
        }else{
          var filtered_constituencies = fgroups[filter.value]
          var filtered = _.filter(data, function(d){ return _.includes(filtered_constituencies, d.AC_NAME) })
        }
      }else if(filter.column == 'WINMARGIN'){
        var filtered
        if(filter.value == "< 1%"){
          var filtered = _.filter(data, function(d){ return win_margin[d.AC_NAME] < 0.01 })
        }else{
          var filtered = _.filter(data, function(d){ return win_margin[d.AC_NAME] < 0.02 })
        }        
      }else{
        var filtered = _.filter(data, function(d){
          return filter.type == 'ne' ? d[filter.column] != filter.value : d[filter.column] == filter.value
        })
      }

      filtered_data[filter.column] = filtered_data[filter.column].concat(filtered)
    })

    var totalseats = _.uniq(_.map(data, 'AC_NAME')).length
    var filteredseats
    var filtered_data_bkup = filtered_data

    if(dataFilters.length == 0){
      filtered_data = data
      filteredseats = totalseats
      $("#totalseats").text(mask_to_hindi('Total') + ' - ' + totalseats)
    }else{

      var arrays = _.values(filtered_data)

      var filtered_data = arrays.shift().reduce(function(res, v) {

        if (res.indexOf(v) === -1 && arrays.every(function(a) {

            return a.indexOf(v) !== -1;

        })) res.push(v);

        return res;
      }, [])

      filteredseats = _.uniq(_.map(filtered_data, 'AC_NAME')).length
      $("#totalseats").text(mask_to_hindi('Total') + ' - ' + filteredseats + ' / ' + totalseats)
    }

    var filtered_groups = _.groupBy(filtered_data, 'AC_NAME')

    var groups_for_counts = {}
    var except_others = 0

    _.each(_.keys(filtered_groups), function(key){
      var candidates = filtered_groups[key]
      var max = _.max(_.map(candidates, function(d){ return parseInt(d.VOTES) }))
      groups_for_counts[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == max })].PARTY
    })

    groups_for_counts = _.invertBy(groups_for_counts)

    _.each(non_other_parties, function(group){
      $("#seatcount-"+group).text('') 
    })

    if(_.keys(groups_for_counts).length == 0) {
      var parties = _.filter(dataFilters, function(d){ return d.column == 'PARTY'})
      _.each(parties, function(party){
        groups_for_counts[party.value] = []  
      })
      
    }

    _.each(_.keys(groups_for_counts), function(group){
      if(_.includes(non_other_parties,group)){
        $("#seatcount-"+group).text(' - ' + groups_for_counts[group].length)
      }else{
        except_others += groups_for_counts[group].length
      }
    })

    if(dataFilters.length > 0){

      delete filtered_data_bkup.PARTY
      var except_parties = _.values(filtered_data_bkup)
      if(except_parties.length > 0) { 

        var filtered_data_bkup = except_parties.shift().reduce(function(res, v) {

            if (res.indexOf(v) === -1 && arrays.every(function(a) {

                return a.indexOf(v) !== -1;

            })) res.push(v);

            return res;
          }, [])
        filtered_data_bkup = _.groupBy(filtered_data_bkup,'AC_NAME')

        _.each(_.keys(filtered_data_bkup), function(key){
          var candidates = filtered_data_bkup[key]
          var max = _.max(_.map(candidates, function(d){ return parseInt(d.VOTES) }))
          filtered_data_bkup[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == max })].PARTY
        })

        filtered_data_bkup = _.invertBy(filtered_data_bkup)
        _.each(non_other_parties, function(party){ delete filtered_data_bkup[party] })
        var others_length = _.flatten(_.values(filtered_data_bkup)).length
        $("#seatcount-others").text(' - ' + others_length)
      }else{
        $("#seatcount-others").text(' - ' + except_others)
      }

    }else{
      $("#seatcount-others").text(' - ' + except_others)
    }

    if(dataFilters.length > 0){
      var region_filter_flag = _.includes(_.map(dataFilters,'column'), 'REGION')
      var relstatus_filter_flag = _.includes(_.map(dataFilters,'column'), 'RELSTATUS')
      var geostatus_filter_flag = _.includes(_.map(dataFilters,'column'), 'GEOSTATUS')
      var ac_type_filter_flag = _.includes(_.map(dataFilters,'column'), 'AC_TYPE')
      var party_filter_flag = _.includes(_.map(dataFilters,'column'), 'PARTY')
      var ac_name_filter_flag = _.includes(_.map(dataFilters,'column'), 'AC_NAME')
      var over_all_flag = region_filter_flag || relstatus_filter_flag || geostatus_filter_flag || ac_type_filter_flag || ac_name_filter_flag

      if(state.toUpperCase() == 'UTTAR PRADESH'){
        var phase_filter_flag = _.includes(_.map(dataFilters,'column'), 'PHASE')
        var winmargin_filter_flag = _.includes(_.map(dataFilters,'column'), 'WINMARGIN')
        over_all_flag = over_all_flag || phase_filter_flag || winmargin_filter_flag
      }

      if(over_all_flag){
        if(!_.includes(_.map(dataFilters,'value'), 'OTH') && party_filter_flag) {
          $("#seatcount-others").text('')  
        }
      }else{
        if(!_.includes(_.map(dataFilters,'value'), 'OTH')) {
          $("#seatcount-others").text('')  
        }
      }
    }

    if(!party_filter_flag){
      _.each(non_other_parties, function(group){
        if($("#seatcount-"+group).text()  == ''){
          $("#seatcount-"+group).text(' - 0')
        }
      })  
    }

    drawMap(state, topoJSONPath, data, curr_candidates, filtered_groups)
  })
}

function drawMap(state, topoJSONPath, data, curr_candidates, filtered_groups){

  d3.json(topoJSONPath, function(topodata){

    var currZoomLevel = (window.outerWidth - 8) / window.innerWidth;
    var currResolution = window.innerWidth;

    topoLayer.eachLayer(function(layer) {
      map.removeLayer(layer)
    })

    _.each(circles, function(layer){
      map.removeLayer(layer)
    })

    topoLayer.clearLayers();
    topoLayer.addData(topodata)
    topoLayer.addTo(map)

    var latlngs = []

    var all_groups = _.groupBy(data, 'AC_NAME')

    _.each(_.keys(all_groups), function(key){
      var candidates = all_groups[key]
      var max = _.max(_.map(candidates, function(d){ return parseInt(d.VOTES) }))
      all_groups[key] = candidates[_.findIndex(candidates, function(d) { return parseInt(d.VOTES) == max })]
    })

    topoLayer.eachLayer(function(layer) {
      var center = layer.getBounds().getCenter()
      var area = layer.feature.properties.AC_NAME
      var parsed_url = G.url.parse(location.href)
      var constituency = parsed_url.searchKey.constituency || null

      layer.setStyle({
        weight: currResolution > 1366 ? 2.5 : 0.5,
        fillColor: mapColor[state],
        fillOpacity: 1,
        color: currResolution > 1366 ? 'black' : 'white',
      })

      if(_.has(filtered_groups, area.toUpperCase()) || filtered_groups.length == 0){
        if(_.has(all_groups, area.toUpperCase())){
          
          var contestants = _.filter(curr_candidates, function(d){ return d.AC_NAME == area.toUpperCase() })

          var top_3 = _.reverse(
            _.sortBy(
              _.filter(
                data, function(d){
                  return d.AC_NAME == area.toUpperCase()
                }
              ),
              function(d){
                return parseInt(d.VOTES)
              }
            )
          ).slice(0,3)

          var party = all_groups[area.toUpperCase()].PARTY

          if(state.toUpperCase() == 'UTTAR PRADESH'){

            layer.setStyle({
              weight: currResolution > 1366 ? 2.5 : 0.5,
              fillColor: partyColors[party] || defaultColor,
              fillOpacity: 1,
              color: 'black',
            })

            layer.options.data = {
              area: area,
              contestants: contestants,
              top_3: top_3,
              party: party,
              color: partyColors[party] || defaultColor,
            }

            layer.on('click', function(d){
              var parsed_url = G.url.parse(location.href)
              if(this.options.fillColor == 'black'){
                this.setStyle({ fillColor: d.target.options.data.color })
                $("#constituency").hide();
                $("#filters").show();
                parsed_url.update({constituency: null})
              }else{
                topoLayer.eachLayer(function(layer) {
                  if(layer.options.fillColor == 'black'){
                    layer.setStyle({ fillColor: layer.options.data.color })
                  }
                })
                this.setStyle({ fillColor: 'black' })
                displayConstituency(d.target.options.data)
                parsed_url.update({constituency: d.target.options.data.area.toUpperCase() })
              }
              window.history.pushState('page2', '', parsed_url.protocol + '://' + parsed_url.origin + parsed_url.pathname + '?' + parsed_url.search);
            })

            if(constituency){
              if(area.toUpperCase() == constituency.toUpperCase()){
                console.log(';')
                layer.fireEvent('click')
              }
            }

            layer.on('mouseover', function(d){
              if(window.innerWidth > 900){
                layer.openPopup()  
              }
            })

            layer.on('mouseout', function(d){
              if(window.innerWidth > 900){
                layer.closePopup()
              }
            })

          }else{
            latlngs.push({
              center: center,
              area: area,
              contestants: contestants,
              top_3: top_3,
              party: party,
              partyColor: partyColors[party] || defaultColor
            })  
          }
        }
      }

    })

    map.fitBounds(topoLayer.getBounds())

    circles = []
    d3.selectAll('svg > g')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="FFB200"><stop offset="0%" style="stop-color: #FFB200;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="FEF391"><stop offset="0%" style="stop-color: #FEF391;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="1796ff"><stop offset="0%" style="stop-color: #1796ff;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="11ff00"><stop offset="0%" style="stop-color: #11ff00;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="C9C9C9"><stop offset="0%" style="stop-color: #C9C9C9;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')
         .insert('defs').html('<radialGradient gradientUnits="objectBoundingBox" cx="67%" cy="67%" r="100%" id="FF19B6"><stop offset="0%" style="stop-color: #FF19B6;"></stop><stop offset="100%" style="stop-color: black;"></stop></radialGradient>')

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
          weight: 1,
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
        if(this.options.fillColor == 'black'){
          this.setStyle({ fillColor: currResolution > 1366 ? 'url(' + d.target.options.data.color + ')' : d.target.options.data.color })
          $("#constituency").hide();
          $("#filters").show();
        }else{
          circles.forEach(function(circle) {
            if(circle.options.fillColor == 'black'){
              circle.setStyle({ fillColor: currResolution > 1366 ? 'url(' + circle.options.data.color + ')' : circle.options.data.color })
            }
          })
          this.setStyle({ fillColor: 'black' })
          displayConstituency(d.target.options.data)
        }
      })

      circle.on('mouseover', function(d){
        if(window.innerWidth > 900){
          circle.openPopup()
        }
      })

      circle.on('mouseout', function(d){
        if(window.innerWidth > 900){
          circle.closePopup()
        }
      })

    })

    circles.forEach(function(circle){ 
      circle.bindPopup(function(d){ return '<b>' + mask_to_hindi(d.options.data.area.toUpperCase()) + '</b>' }, {closeButton: false})
    })

    if(state.toUpperCase() == 'UTTAR PRADESH'){

      topoLayer.eachLayer(function(layer){
        layer.bindPopup(function(d){ return '<b>' + mask_to_hindi(d.options.data.area.toUpperCase()) + '</b>' }, {closeButton: false})
      })

    } 

  })
}

function displayConstituency(data){
  $("#filters").hide()
  $("#constituency").show();
  $("#constituency").html(
    _.templateFromURL('snippets.html', '#constituency-template')({data: data})
  )
}

function mask_to_hindi(english_phrase) {

  var parsed_url = G.url.parse(location.href)
  var lang = parsed_url.searchKey.lang || null

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