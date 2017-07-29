/* exported Map */

var Map = function(selector) {
  L.TopoJSON = L.GeoJSON.extend({
    options: {
      data: {}
    },
    addData: function(jsonData) {
      if (jsonData.type === "Topology") {
        for (key in jsonData.objects) {
          geojson = topojson.feature(jsonData, jsonData.objects[key]);
          L.GeoJSON.prototype.addData.call(this, geojson);
        }
      } else {
        L.GeoJSON.prototype.addData.call(this, jsonData);
      }
    }
  })

  L.Constituency = L.Circle.extend({
    options: {
      data: {}
    }
  })

  this._map = L.map(selector, {
    attributionControl: false,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false,
    keyboard: false,
    touchZoom: false
  })

  this._topoLayer = new L.TopoJSON()
  this._constCircle = null
  this._layerCircles = []
}

Map.prototype.render = function(geoJSONPath, constituency, colors, clickFunc) {
  var that = this
  var state = geoJSONPath.replace('/geojson/', '').replace('_ac_map.json', '')

  d3.json(geoJSONPath, function(data) {

    var latlngs = []

    that._topoLayer.clearLayers()
    that._topoLayer.addData(data)
    that._topoLayer.addTo(that._map)

    that._topoLayer.eachLayer(function(layer) {
      var area = layer.feature.properties.AC_NAME
      var center = layer.getBounds().getCenter()

      layer.options.data = {
        area: area
      }

      if (state == 'up') {

        layer.setStyle({
          weight: 1,
          fillColor: colors[area.toUpperCase()] || '#858585',
          fillOpacity: 1,
          color: 'white'
        })

      } else {

        layer.setStyle({
          weight: 1,
          fillColor: '#858585',
          fillOpacity: 1,
          color: 'white'
        })

      }

      if (_.has(colors, area.toUpperCase())) {

        if (state == 'up') {
          layer.bindPopup(function(d) {
            return '<b>' + mask_to_hindi(area.toUpperCase()) + '</b>'
          }, {
            closeButton: false
          })
          layer.on('mouseover', function(d) {
            layer.openPopup()
          })
          layer.on('mouseout', function(d) {
            layer.closePopup()
          })

          layer.on('click', clickFunc)
        } else {

          latlngs.push({
            center: center,
            area: area
          })
        }

      }

    })

    if (that._constCircle) {
      that._map.removeLayer(that._constCircle)
    }

    that._map.fitBounds(that._topoLayer.getBounds())

    if (that._layerCircles.length > 0) {
      _.each(that._layerCircles, function(layer) {
        that._map.removeLayer(layer)
      })
    }
    _.each(latlngs, function(data) {
      var circle = new L.Constituency(
        [
          data.center.lat,
          data.center.lng
        ],
        state_formfactor[state_name_map_alias[state]],
        {
          color: colors[data.area.toUpperCase()] || '#C9C9C9',
          class: '.circle-shadow',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
          data: {
            area: data.area
          }
      })

      circle.bindPopup(function(d) {
        return '<b>' + mask_to_hindi(data.area.toUpperCase()) + '</b>'
      }, {
        closeButton: false
      })
      circle.on('mouseover', function(d) {
        circle.openPopup()
      })
      circle.on('mouseout', function(d) {
        circle.closePopup()
      })

      circle.on('click', clickFunc)

      circle.addTo(that._map)
      that._layerCircles.push(circle)
    })

    if (_.keys(constituency).length != 0) {
      that._topoLayer.eachLayer(function(layer) {
        var center = layer.getBounds().getCenter()
        var area = layer.feature.properties.AC_NAME
        if (area.toUpperCase() == constituency.name.toUpperCase()) {

          that._constCircle = L.circle(center, constituency.size, {
            fill: 'red',
            color: constituency.color,
            fillOpacity: 1,
            opacity: 1
          })

          if (_.has(colors, area.toUpperCase())) {
            that._constCircle.bindPopup(function(d) {
              return '<b>' + mask_to_hindi(constituency.name.toUpperCase()) + '</b>'
            }, {
              closeButton: false
            })
            that._constCircle.on('mouseover', function(d) {
              that._constCircle.openPopup()
            })
            that._constCircle.on('mouseout', function(d) {
              that._constCircle.closePopup()
            })
          }
          that._constCircle.addTo(that._map)

        }
      })
    }
  })
}