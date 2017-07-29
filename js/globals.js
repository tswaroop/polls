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


var state_name_hindi = {
  'PUNJAB': 'पंजाब',
  'MANIPUR': 'मणिपुर',
  'GOA': 'गोवा',
  'UP': 'उत्तर प्रदेश',
  'UTTARAKHAND': 'उत्तराखण्ड'
}

var state_name_hindi_reverse = {
  'पंजाब': 'PUNJAB',
  'मणिपुर': 'MANIPUR',
  'गोवा': 'GOA',
  'उत्तर प्रदेश': 'UP',
  'उत्तराखण्ड': 'UTTARAKHAND'
}


var state_name_alias = {
  'PUNJAB': 'PUNJAB',
  'GOA': 'GOA',
  'UP': 'UTTAR PRADESH',
  'UTTARAKHAND': 'UTTARAKHAND',
  'MANIPUR': 'MANIPUR'
}

var partyColors = {
  'CONG': '#12D6FF',
  'SAD': '#FEF391',
  'BJP': '#FFB200',
  'AAP': '#FF4933',
  'SAD + BJP': '#ff9f00',
  'AAP': '#2cb82c',
  'AAP+': '#2cb82c',
  'SP': '#2cb82c',
  'CONG': '#1796ff',
  'INC': '#1796ff',
  'OTH': '#8B6D53',     // 'OTH': '#c9c9c9', 6E6969-temp
  'SP + CONG': '#2cb82c',
  'BSP': '#FF19B6',
  'BJP+': '#FFB200',
  'BJP+SAD': '#FF9F00',
  'SAD+BJP': '#FF9F00',
  'CONG+SP': '#2cb82c',
  'SP+CONG': '#2cb82c',
  'AITC': '#673AB7',
  'MSCP': '#AAAD3E',
  'IND': '#818181'
}

var party_hindi = {
  'SAD+BJP': 'अकाली+',
  'CONG': 'कांग्रेस',
  'OTH': 'अन्य',
  'AAP': 'AAP',
  'BJP+': 'BJP+',
  'SP+CONG': 'SP+कांग्रेस',
  'AITC': 'AITC',
  'BJP': 'BJP',
  'MSCP': 'MSCP',
  'IND': 'निर्दलीय'
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
  "PUNJAB": 117,
  "UP": 403
}

var raceto = {
  "UP": 202,
  "UTTARAKHAND": 36,
  "MANIPUR": 31,
  "PUNJAB": 59,
  "GOA": 21
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


var agency_alias_hindi = {
  "AXIS-MY-INDIA": "एक्सिस माय इंडिया",
  "C-VOTER": "सी-वोटर",
  "CSDS": "CSDS",
  "TODAYS-CHANAKYA": "टुडेज़ चाणक्य",
  "M76": "M76",
  "MRC": "MRC",
  "2012": "2012"
}

var agency_alias_hindi_poll = {
  "AXIS MY INDIA": "एक्सिस माय इंडिया",
  "C VOTER": "सी-वोटर",
  "CSDS": "CSDS",
  "TODAYS CHANAKYA": "टुडेज़ चाणक्य",
  "M76": "M76",
  "MRC": "MRC",
  "2012": "2012"
}

var agency_alias_hindi_reverse = {
  'एक्सिस माय इंडिया': 'AXIS-MY-INDIA',
  'सी-वोटर': 'C-VOTER',
  'CSDS': 'CSDS',
  'टुडेज़ चाणक्य': 'TODAYS-CHANAKYA',
  'M76': 'M76',
  'MRC': 'MRC',
  '2012': '2012'
}


var agency_alias = {
  'AXIS-MY-INDIA': 'AXIS MY INDIA',
  'C-VOTER': 'C-VOTER',
  'CSDS': 'CSDS',
  'TODAYS-CHANAKYA': 'TODAY’S CHANAKYA',
  'M76': 'M76',
  'MRC': 'MRC',
  '2012': '2012'
}

var agency_alias_reverse = {
  'AXIS MY INDIA': 'AXIS-MY-INDIA',
  'C-VOTER': 'C-VOTER',
  'CSDS': 'CSDS',
  'TODAY’S CHANAKYA': 'TODAYS-CHANAKYA',
  'M76': 'M76',
  'MRC': 'MRC',
  '2012': '2012'
}

agency_order = [
  'AXIS-MY-INDIA',
  'C-VOTER',
  'CSDS',
  'TODAYS-CHANAKYA',
  'M76',
  'MRC'
]

var agency_alias_old = {
  'ABP CSDS': 'CSDS',
  'ABP-CSDS': 'CSDS',
  'INDIA-TODAY-AXIS': 'AXIS',
  'IT-AXIS': 'AXIS',
  'TIMES-NOW-VMR': 'VMR',
  'TIMES-NOW': 'VMR',
  'NEWS-24-PACE-MEDIA': 'PACE',
  'NEWS24': 'PACE',
  '2012': '2012'
}

var agency_alias_reverse_old = {
  'CSDS': 'ABP CSDS',
  'AXIS': 'IT-AXIS',
  'VMR': 'TIMES-NOW',
  'PACE': 'NEWS24',
  '2012': '2012'
}

agency_order_old = [
  'ABP-CSDS',
  'INDIA-TODAY-AXIS',
  'TIMES-NOW-VMR',
  'NEWS24-PACE'
]

var defaultLegendColor = '#B6B6B6'
var defaultPartyLogo = 'img/parties/default.jpg'
var popUpObj
var filters = []
var votesFormat = d3.format(",")
var hindi_words_mapping;
