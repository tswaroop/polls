var map = L.map('map', {
  attributionControl: false,
  zoomControl: false,
  scrollWheelZoom: false,
  dragging: false,
  doubleClickZoom: false,
  keyboard: false,
  touchZoom: false,
  tap: false
})

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
    }    
    else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }  
})

L.Constituency = L.Circle.extend({
   options: { 
      data: {}
   }
})

var topoLayer = new L.TopoJSON()

L.partyLegend = L.Control.extend({
  options: {
    innerHTML: ''
  },
  onAdd: function(map) {
    var div = L.DomUtil.create('div')
    div.innerHTML =  this.options.innerHTML
    return div
  }
})

var legend = new L.partyLegend()
var exportLegend = new L.partyLegend()

var circles = []

var zoomLevelForTV = {
  'PUNJAB': 12,
  'GOA': 13.5,
  'UTTAR PRADESH': 7.4
}

var zoomLevelForDesktop = {
  'PUNJAB': 11,
  'GOA': 12.5,
  'UTTAR PRADESH': 6
}