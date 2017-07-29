var state_file_mapping = {
  'punjab': 'punjab_ac_map.json',
  'goa': 'goa_ac_map.json',
  'uttar pradesh': 'up_ac_map.json',
  'uttarakhand': 'uk_ac_map.json',
  'manipur': 'manipur_ac_map.json'
}

var state_name_mapping = {
  'punjab': 'punjab',
  'goa': 'goa',
  'uttar pradesh': 'up',
  'uttarakhand': 'uk',
  'manipur': 'manipur'
}

var partyColors = {
  'CONG': '#12D6FF',
  'SAD': '#FEF391',
  'BJP': '#FFB200',
  'AAP': '#FF4933',
  'SAD + BJP': '#ff9f00',
  'AAP': '#11ff00',
  'SP': '#11ff00',
  'CONG': '#1796ff',
  'OTH': '#c9c9c9',
  'SP + CONG': '#11ff00',
  'BSP': '#FF19B6',
  'BJP+': '#FFB200',
  'BJP+SAD': '#FF9F00',
  'SAD+BJP': '#FF9F00',
  'CONG+SP': '#11FF00',
  'SP+CONG': '#11FF00'
}

var partyLogos = {
  'CONG': 'img/parties/INC.jpg',
  'BJP': 'img/parties/BJP.png',
  'AAP': 'img/parties/AAP.jpg',
  'BSP': 'img/parties/BSP.jpg',
  'SAD': 'img/parties/SAD.png',
  'SP': 'img/parties/SP.png'
}

var category_mapping = {
  'region': 'REGION',
  'geography': 'GEOSTATUS',
  'reservation': 'AC_TYPE',
  'population': 'RELSTATUS',
  'phase': 'PHASE',
  'margin': 'WINMARGIN'
}

var total_seats = {
  "GOA": 40,
  "UTTAR PRADESH": 403,
  "MANIPUR": 60,
  "UTTARAKHAND": 70,
  "PUNJAB": 117
}

var state_formfactor = {
  'punjab': 500,
  'goa': 150,
  'uttar pradesh': 10000,
  'uttarakhand': 7500,
  'manipur': 5000
}

var defaultColor = '#C9C9C9'

var mapColor = {
  'punjab': '#6B6B6B',
  'goa': '#6B6B6B',
  'uttar pradesh': '#6B6B6B',
  'uttarakhand': '#6B6B6B',
  'manipur': '#6B6B6B'
}

var defaultLegendColor = '#B6B6B6'
var defaultPartyLogo = 'img/parties/default.jpg'
var popUpObj
var filters = []
var votesFormat = d3.format(",")
var hindi_words_mapping;