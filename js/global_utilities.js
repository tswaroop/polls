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

var state_bubble_mapping = {
  'punjab': 900,
  'goa': 250,
  'uttar pradesh': 16000,
  'uttarakhand': 9000,
  'manipur': 7000
}

var partyColors = {
  'CONG': '#0093FC',
  'SAD': '#FEF391',
  'BJP': '#FDA51A',
  'AAP': '#00B68D',
  'SAD + BJP': '#ff9f00',
  'AAAP': '#00B68D',
  'SP': '#00B68D',
  'CONG': '#1796ff',
  'OTH': '#9C9C9C',
  'SP + CONG': '#00B68D',
  'BSP': '#D62CA8',
  'BJP+': '#FDA51A',
  'BJP+SAD': '#FF9F00',
  'SAD+BJP': '#FF9F00',
  'CONG+SP': '#00B68D',
  'SP+CONG': '#00B68D',
  'AD': '#B02E2E',
  'CPI': '#FA2E2E',
  'NPF': '#2E3EEB',
  'AITC': '#A5E02E',
  'AAP+': '#00B68D',
  'INC': '#0093FC',
  "PRJA":  "#00B68D"
}

var partyColors_pname = {
  'CONG': '#0093FC',
  'SAD': '#FEF391',
  'BJP': '#FDA51A',
  'AAP': '#00B68D',
  'SAD + BJP': '#ff9f00',
  'AAAP': '#00B68D',
  'SP': '#00B68D',
  'CONG': '#1796ff',
  'OTH': '#9C9C9C',
  'SP + CONG': '#00B68D',
  'BSP': '#D62CA8',
  'BJP+': '#FDA51A',
  'BJP+SAD': '#FF9F00',
  'SAD+BJP': '#FF9F00',
  'CONG+SP': '#00B68D',
  'SP+CONG': '#00B68D',
  'AD': '#B02E2E',
  'CPI': '#FA2E2E',
  'NPF': '#2E3EEB',
  'AITC': '#A5E02E',
  'AAP+': '#00B68D',
  'INC': '#0093FC',
  "PRJA":  "#00B68D"
}

var party_alliance_mapping = {
  "AAP": 'img/parties/AAP.jpg',
  "BJP": 'img/parties/BJP.png',
  "CONG": 'img/parties/INC.jpg',
  "AAP+": 'img/parties/AAP.jpg',
  "SAD+BJP": 'img/parties/BJP.png',
  "BJP+": 'img/parties/BJP.png',
  "BSP":  'img/parties/BSP.jpg',
  "SP+CONG": 'img/parties/SP.png'
}

var partyLogos = {
  'CONG': 'img/parties/INC.jpg',
  'BJP': 'img/parties/BJP.png',
  'AAP': 'img/parties/AAP.jpg',
  'BSP': 'img/parties/BSP.jpg',
  'SAD': 'img/parties/SAD.png',
  'SP': 'img/parties/SP.png'
}

var partyKeyImages = {
  'CONG': 'img/party_candidate_images/RAHUL_GANDHI.png',
  'BJP': 'img/party_candidate_images/Narendra Modi-Transparent.png',
  'BJP+': 'img/party_candidate_images/Narendra Modi-Transparent.png',
  'SAD+BJP': 'img/party_candidate_images/Parkash Badal-Modi.png',
  'AAP': 'img/party_candidate_images/ARVIND_KEJRIWAL.png',
  'AAP+': 'img/party_candidate_images/ARVIND_KEJRIWAL.png',
  'BSP': 'img/party_candidate_images/MAYAWATI.png',
  'SP': 'img/party_candidate_images/AKHILESH_YADAV.png',
  'SP+CONG': 'img/party_candidate_images/AKHILESH_RAHUL.png',
  'PRJA': 'img/party_candidate_images/Irome_Sharmila_Cut_out.png',
  'default': 'img/party_candidate_images/default.png'
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
  "UP": 403,
  "UTTAR PRADESH": 403,
  "MANIPUR": 60,
  "UTTARAKHAND": 70,
  "PUNJAB": 117
}

var hindi_ref = {
  "SP": "समाजवादी पार्टी",
  "Samajvadhi party": "समाजवादी पार्टी",
  "CONG": "कांग्रेस",
  "BJP": "BJP",
  "BSP": "BSP",
  "SAD": "अकाली दल",
  "AAP": "AAP",
  "PRJA": "PRJA",
  "OTHERS": "अन्य",
  // 'SAD+BJP': 'अकाली दल+BJP',
  // 'BJP+SAD': 'BJP+अकाली दल',
}

var hindi_states = {
  "UTTARAKHAND": "उत्तराखंड",
  "PUNJAB": "पंजाब",
  "GOA": "गोवा",
  "UP": "उत्तर प्रदेश",
  "UTTAR PRADESH": "उत्तर प्रदेश",
  "MANIPUR": "मणिपुर"
}

var hindi_states_reverse = {
  "उत्तराखंड": "UTTARAKHAND",
  "पंजाब": "PUNJAB",
  "गोवा": "GOA",
  "उत्तर प्रदेश": "UP",
  "मणिपुर": "MANIPUR"
}

var hindi_states_poll_reverse = {
  "उत्तराखंड": "UTTARAKHAND",
  "पंजाब": "PUNJAB",
  "गोवा": "GOA",
  "उत्तर प्रदेश": "UP",
  "मणिपुर": "MANIPUR"
}

var agency_alias = {
  'ABP CSDS': 'CSDS',
  'ABP-CSDS': 'CSDS',
  'INDIA-TODAY-AXIS': 'AXIS',
  'IT-AXIS': 'AXIS',
  'TIMES-NOW-VMR': 'VMR',
  'TIMES-NOW': 'VMR',
  'NEWS-24-PACE-MEDIA': 'PACE',
  'NEWS24': 'PACE',
  2012: 2012
}

var agency_alias_reverse = {
  'CSDS': 'ABP CSDS',
  'AXIS': 'IT-AXIS',
  'VMR': 'TIMES-NOW',
  'PACE': 'NEWS24',
  2012: 2012
}

agency_order = [
  'ABP-CSDS',
  'INDIA-TODAY-AXIS',
  'TIMES-NOW-VMR',
  'NEWS24-PACE'
]

var state_formfactor = {
  'punjab': 500,
  'goa': 150,
  'uttar pradesh': 10000,
  'uttarakhand': 7500,
  'manipur': 5000
}

var defaultColor = '#C9C9C9'
var data_key_const ={
      "MANDREM":"Y",
      "PANAJI":"Y",
      "MARCAIM":"Y",
      "FATORDA":"Y",
      "MARGAO":"Y",
      "CUNCOLIM":"Y",
      "THOUBAL":"Y",
      "BATALA":"Y",
      "MAJITHA":"Y",
      "AMRITSAR EAST":"Y",
      "JALANDHAR CANTT.":"Y",
      "DAKHA":"Y",
      "JALALABAD":"Y",
      "LAMBI":"Y",
      "BATHINDA URBAN":"Y",
      "PATIALA":"Y",
      "NAKUR":"Y",
      "KAIRANA":"Y",
      "SUAR":"Y",
      "RAMPUR":"Y",
      "NAUGAWAN SADAT":"Y",
      "SARDHANA":"Y",
      "MEERUT":"Y",
      "NOIDA":"Y",
      "SIKANDRABAD":"Y",
      "SHIKARPUR":"Y",
      "ATRAULI":"Y",
      "MATHURA":"Y",
      "TILHAR":"Y",
      "HARDOI":"Y",
      "LUCKNOW EAST":"Y",
      "LUCKNOW CANTT":"Y",
      "UNCHAHAR":"Y",
      "AMETHI":"Y",
      "SADAR":"Y",
      "JASWANTNAGAR":"Y",
      "RAMPUR KHAS":"Y",
      "KARCHHANA":"Y",
      "ALLAHABAD WEST":"Y",
      "ALLAHABAD NORTH":"Y",
      "ZAIDPUR":"Y",
      "MILKIPUR":"Y",
      "NAUTANWA":"Y",
      "CAIMPIYARGANJ":"Y",
      "GORAKHPUR URBAN":"Y",
      "PADRAUNA":"Y",
      "RUDRAPUR":"Y",
      "PATHARDEVA":"Y",
      "AZAMGARH":"Y",
      "DIDARGANJ":"Y",
      "GHOSI":"Y",
      "MAU":"Y",
      "PHEPHANA":"Y",
      "BALLIA NAGAR":"Y",
      "BANSDIH":"Y",
      "PINDRA":"Y",
      "VARANASI SOUTH":"Y",
      "VARANASI CANTT":"Y",
      "CHUNAR":"Y",
      "MUSSOORIE":"Y",
      "HARIDWAR RURAL":"Y",
      "YAMKESHWAR":"Y",
      "CHAUBATTAKHAL":"Y",
      "KOTDWAR":"Y",
      "KICHHA":"Y",
      "SITARGANJ":"Y"
    }


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


const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

const hexToRgb = hex =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

const hexToRgbString = hex =>
  'rgb(' + hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => {
     return parseInt(x, 16)
    }).join(', ') + ')'

/*function color_inversion_hash(hash){
  var rgb = hexToRgb(hash);
  var rgb_invert = rgb.map(function(x){ return 255-x})

  var hex = rgbToHex(rgb_invert[0], rgb_invert[1], rgb_invert[2])
  return hex;
}*/

function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

var state_cand_dict = {
  'UTTAR PRADESH': ['BJP+', 'SP+CONG', 'BSP', 'OTH'],
  'UTTARAKHAND': ['BJP', 'CONG', 'BSP', 'OTH'],
  'GOA': ['CONG', 'AAP', 'BJP', 'OTH'],
  'PUNJAB': ['CONG', 'SAD+BJP', 'AAP+', 'OTH'],
  'MANIPUR': ['BJP', 'CONG', 'PRJA', 'OTH']
}

var state_name_map_alias = {
  'punjab': 'punjab',
  'goa': 'goa',
  'up': 'uttar pradesh',
  'uk': 'uttarakhand',
  'manipur': 'manipur'
}
