$(function(){
  draw('punjab','2012', [])
})

function draw(state, year, filters){
  d3.csv('data/' + state + '_agg.csv', function(data){
    var data = _.filter(data, function(d) { return d.YEAR == year })
    $("#totalseats").text('Total Seats - ' + _.uniq(_.map(data, 'AC_NAME')).length )

    var all_constituencies = []
    var filtered_constituencies = []

    var fgroups = _.groupBy(data, 'AC_NAME')
    _.each(_.keys(fgroups), function(key){
      var candidates = fgroups[key]
      fgroups[key] = _.max(candidates, function(d){ return parseInt(d.VOTES) }).PARTY
    })

    fgroups = _.invertBy(fgroups)

    $(".legendPara").each(function(i, legend){
      all_constituencies = all_constituencies.concat(fgroups[$.trim($(legend).text().toUpperCase().split(' - ')[0])])
    })

    _.each(_.keys(fgroups), function(key){
      filtered_constituencies = filtered_constituencies.concat(fgroups[key])
    })

    var other_constituencies = _.difference(filtered_constituencies,all_constituencies)
    
    var filtered_data = {}

    _.each(filters, function(filter){
      console.log(filter.value)

      if(!_.has(filtered_data, filter.column)){
        filtered_data[filter.column] = []
      }

      if(filter.column == 'PARTY'){ 
      
        if(filter.value == 'OTHERS'){
          var filtered = _.filter(data, function(d){ return _.includes(other_constituencies, d.AC_NAME) })
        }else{
          var filtered_constituencies = fgroups[filter.value]  
          var filtered = _.filter(data, function(d){ return _.includes(filtered_constituencies, d.AC_NAME) })
        }
      }else{
        var filtered = _.filter(data, function(d){
          return filter.type == 'ne' ? d[filter.column] != filter.value : d[filter.column] == filter.value 
        })
      }
      filtered_data[filter.column] = filtered_data[filter.column].concat(filtered)
    })

    if(filters.length == 0){ 
      filtered_data = data 
    }else{

      var arrays = _.values(filtered_data)

      var filtered_data = arrays.shift().reduce(function(res, v) {
    
        if (res.indexOf(v) === -1 && arrays.every(function(a) {
    
            return a.indexOf(v) !== -1;
    
        })) res.push(v);
    
        return res;
      }, [])
    
    }

    var topoJSONPath = 'maps/' + state_file_mapping[state]
    var filtered_groups = _.groupBy(filtered_data, 'AC_NAME')
    var groups_for_counts = {}
    
    _.each(_.keys(filtered_groups), function(key){
      var candidates = filtered_groups[key]
      groups_for_counts[key] = _.max(candidates, function(d){ return parseInt(d.VOTES) }).PARTY
    })
    
    groups_for_counts = _.invertBy(groups_for_counts)
    
    _.each(_.keys(groups_for_counts), function(group){
      $("#seatcount-"+group).text(' - ' + groups_for_counts[group].length)
    })

    filtered_constituencies = []

    _.each(_.keys(groups_for_counts), function(key){
      filtered_constituencies = filtered_constituencies.concat(groups_for_counts[key])
    })

    other_constituencies = _.difference(filtered_constituencies,all_constituencies)

    $("#seatcount-others").text(' - ' + other_constituencies.length)

    drawMap(topoJSONPath, data, filtered_groups)
    d3.select('svg').style("transform","translate3d(0px, -100px, 0px)");
  })
}

function drawMap(topoJSONPath, data, filtered_groups){
  
  d3.json(topoJSONPath, function(topodata){
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
      all_groups[key] = _.max(candidates, function(d){ return parseInt(d.VOTES) })
    })

    topoLayer.eachLayer(function(layer) {
      var center = layer.getBounds().getCenter()
      var area = layer.feature.properties.AC_NAME

      var contestants = _.uniq(
        _.map(
          _.filter(
            data, 
            function(d){ 
              return d.AC_NAME == area.toUpperCase()
            }
          ),
          function(d){ 
            return {
              name: d.NAME,
              party: d.PARTY
            } 
          }
        )
      )

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

      layer.setStyle({
        weight: 0.5,
        fillColor: mapColor,
        fillOpacity: 1,
        color: 'black',
      })

      if(_.has(filtered_groups, area.toUpperCase()) || filtered_groups.length == 0){
        if(_.has(all_groups, area.toUpperCase())){
          var party = all_groups[area.toUpperCase()].PARTY

          latlngs.push({
            center: center,
            area: area,
            contestants: contestants,
            top_3: top_3,
            partyColor: partyColors[party] || defaultColor
          })
        }
      }

    })
    
    map.fitBounds(topoLayer.getBounds())

    circles = []

    _.each(latlngs, function(obj){
      
      var circle = new L.Constituency(
        [
          obj.center.lat,
          obj.center.lng
        ],
        state_formfactor[$(".dropdown span:first").text().toLowerCase()], 
        {
          fillColor: obj.partyColor,
          class: '.circle-shadow',
          weight: 0.25,
          fillOpacity: 0.8,
          data: {
            area: obj.area,
            color: obj.partyColor,
            contestants: obj.contestants,
            top_3: obj.top_3
          }
      })

      circle.bindPopup(function(d){ return '<b>' + d.options.data.area.toUpperCase() + '</b>' }, {closeButton: false})
      circle.addTo(map)
      circles.push(circle)

      circle.on('click', function(d){
        if(this.options.fillColor == 'black'){
          this.setStyle({ fillColor: d.target.options.data.color })
          $("#constituency").hide();
          $("#filters").show();
        }else{
          circles.forEach(function(circle) { 
            if(circle.options.fillColor == 'black'){
              circle.setStyle({ fillColor: circle.options.data.color })   
            }
          })
          this.setStyle({ fillColor: 'black' })
          displayConstituency(d.target.options.data) 
        }
      })

      circle.on('mouseover', function(d){
        circle.openPopup()
      })

      circle.on('mouseout', function(d){
        circle.closePopup()
      })
      
    })

  })
}

function displayConstituency(data){
  $("#filters").hide()
  $("#constituency").show();
  $("#constituency").html(
    _.templateFromUrl('snippets.html', '#constituency-template')({data: data})
  )
}