import pandas as pd
import gramex
import json
from refresh_data import get_live_data
from refresh_data import merge_filters
from refresh_data import refresh_data

from datetime import datetime


phases_for_states = {
    'uttar pradesh': [1,2,3,4,5,6,7],
    'punjab': []
}

ribbon_colors = {
   "SAD+BJP": '#A93700',
   "CONG": '#121869',
   "AAP+": '#00B68D',
   'BSP': '#D62CA8',
   'SP+CONG': '#121869',
   'BJP+': '#A93700',
   'SP': '#78E600'
}

parties_order = {
    'uttar pradesh': ["SP+CONG", "BJP+", "SP", "BSP"],
    'punjab': ["SAD+BJP", "CONG", "AAP+"]
}

regions_for_states = {
    'uttar pradesh': ['West','Ruhelkhand','Doab','Avadh','Bundelkhand','East','North East'],
    'punjab': ['MAJHA','DOABA','MALWA']
}

pictures_for_parties = {
    'uttar pradesh': {
        'SP+CONG': '../img/party_candidate_images/RAHUL_GANDHI.png',
        'BJP+': '../img/party_candidate_images/Narendra Modi-Transparent.png',
        'BSP': '../img/party_candidate_images/MAYAWATI.png',
        'SP': '../img/party_candidate_images/AKHILESH_YADAV.png'
    },
    'punjab': {
        'CONG': '../img/party_candidate_images/RAHUL_GANDHI.png',
        'SAD+BJP': '../img/party_candidate_images/Narendra Modi-Transparent.png',
        'AAP+': '../img/party_candidate_images/ARVIND_KEJRIWAL.png',
        # 'OTH': '../img/party_candidate_images/default.png'
    }

}

person_name_for_parties = {
    "uttar pradesh": {
        'SP+CONG': 'Rahul Gandhi',
        'BJP+': 'Narendra Modi',
        'BSP': 'Mayawati',
        'SP': 'Akhilesh Yadav',
    },
    "punjab": {
        'CONG': 'Rahul Gandhi',
        'SAD+BJP': 'Narendra Modi',
        'AAP+': 'Arvind Kejriwal'
    }
}

party_colors_for_map = {
    'BSP': '#D62CA8',
    'BJP': '#FDA51A',
    'INC': '#0093FC',

    # SP Is mapped to OTH as we have OTH only in up and merged data gives SP as OTH
    'SP': '#78E600',

    'AAAP': '#00B68D',
    'SAD': '#FFFC90',
    'LIFP': '#8F22E8',
    'APD(S)': '#FFFC90',
    'PRJA': '#78E600',
    'SBSP': '#8F22E8',
    'SAD+BJP': '#FDA51A',
    'BJP+': '#FDA51A',
    'SP+CONG': '#0C9753',
    'AAP+': '#00B68D',
    'PRJA': '#78E600',
    # 'OTH': '#9C9C9C',
    'CONG': '#0093FC',
}

punjab_constituencies_campaigned = pd.read_csv("roti//data//punjab_constituencies_campaigned.csv")
up_constituencies_campaigned = pd.read_csv("roti//data//up_constituencies_campaigned.csv")

campaigned_constituencies_state_wise = {
    "uttar pradesh": {
        "SP+CONG": up_constituencies_campaigned[up_constituencies_campaigned['RAHUL RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist(),
        "BJP+": up_constituencies_campaigned[up_constituencies_campaigned['MODI RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist(),
        "BSP": up_constituencies_campaigned[up_constituencies_campaigned['MAYA RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist(),
        "SP": up_constituencies_campaigned[up_constituencies_campaigned['AKHILESH RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist()
    },
    "punjab": {
        "CONG": punjab_constituencies_campaigned[punjab_constituencies_campaigned["RAHUL RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist(),
        "SAD+BJP": punjab_constituencies_campaigned[punjab_constituencies_campaigned["MODI RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist(),
        "AAP+": punjab_constituencies_campaigned[punjab_constituencies_campaigned["KEJRIWAL RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist()
    }
}


'''
punjab_campaigned_data = {}
punjab_constituencies_data = {}

up_campaigned_data = {}
up_constituencies_data = {}

punjab_constituencies_data["CONG"] = punjab_constituencies_campaigned[punjab_constituencies_campaigned["RAHUL RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist()
punjab_campaigned_data["CONG"] = len(punjab_constituencies_data["CONG"])

punjab_constituencies_data["SAD+BJP"] = punjab_constituencies_campaigned[punjab_constituencies_campaigned["MODI RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist()
punjab_campaigned_data["SAD+BJP"] = len(punjab_constituencies_data["SAD+BJP"])

punjab_constituencies_data["AAP+"] = punjab_constituencies_campaigned[punjab_constituencies_campaigned["KEJRIWAL RALLY"].isin(['y', 'Y'])]['CNAME'].unique().tolist()
punjab_campaigned_data["AAP+"] = len(punjab_constituencies_data["AAP+"])

up_constituencies_data["SP+CONG"] = up_constituencies_campaigned[up_constituencies_campaigned['RAHUL RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist()
up_campaigned_data["SP+CONG"] = len(up_constituencies_data["SP+CONG"])

up_constituencies_data["BJP+"] = up_constituencies_campaigned[up_constituencies_campaigned['MODI RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist()
up_campaigned_data["BJP+"] = len(up_constituencies_data["BJP+"])

up_constituencies_data["BSP"] = up_constituencies_campaigned[up_constituencies_campaigned['MAYA RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist()
up_campaigned_data["BSP"] = len(up_constituencies_data["BSP"])

up_constituencies_data["SP"] = up_constituencies_campaigned[up_constituencies_campaigned['AKHILESH RALLY'].isin(['y', 'Y'])]['CNAME'].unique().tolist()
up_campaigned_data["SP"] = len(up_constituencies_data["SP"])
'''












statewise_campaigned_constituencies = {
    'uttar pradesh': ['MODI RALLY', 'RAHUL RALLY', 'AKHILESH RALLY', 'MAYA RALLY'],
    'punjab': ['MODI RALLY', 'RAHUL RALLY', 'KEJRIWAL RALLY']
}

statewise_campaigned_person_to_party_map = {
    'uttar pradesh': {
        'MODI RALLY': 'BJP+',
        'RAHUL RALLY': 'SP+CONG',
        'AKHILESH RALLY': 'SP',
        'MAYA RALLY': 'BSP'
    },
    'punjab': {
        'MODI RALLY': 'SAD+BJP',
        'RAHUL RALLY': 'CONG',
        'KEJRIWAL RALLY': 'AAP+'
    }
}

state_name_campaigned_data = {
    'uttar pradesh': up_constituencies_campaigned,
    'punjab': punjab_constituencies_campaigned
}

# len(up_campaigned_data[up_campaigned_data['MODI RALLY'].isin(['Y', 'y'])])
# len(up_campaigned_data[up_campaigned_data['RAHUL RALLY'].isin(['Y', 'y'])])
# len(up_campaigned_data[up_campaigned_data['AKHILESH RALLY'].isin(['Y', 'y'])])
# len(up_campaigned_data[up_campaigned_data['MAYA RALLY'].isin(['Y', 'y'])])

# for st in ['uttar pradesh', 'punjab']:
#     temp_dict = {}
#     for cand_name in statewise_campaigned_constituencies[st]:
#         party_name = statewise_campaigned_person_to_party_map[st][cand_name]
#         temp_dict[party_name] = len(campaigned_constituencies_state_wise[st][party_name])
#     campaigned_constituencies_state_wise[st] = temp_dict

# Cache
cache = gramex.service.cache.memory

def get_args(handler):
    return handler.request.arguments

def get_data(state):
    # conn = get_connection()
    # data = pd.read_excel("data//2012 results & FILTERS.xlsx", sheetname=0)
    data = get_live_data(state)
    merged_data = merge_filters(data, state)
    merged_data['Votes'] = merged_data['Votes'].astype(int)
    # merged_data.to_csv("merged_data_"+state+'.csv')
    return merged_data

def get_filtered_data_(state):
    # name_of_person = args.get('name_of_person', [''])[0]
    data = get_data(state)
    filtered_data = data[data['StateName'] == state.title()]
    # merged_data['Votes'] = merged_data['Votes'].astype(int)
    # if name_of_person != '':
    #     filtered_data = filtered_data[filtered_data['CANDINAME'] == name_of_person.upper()]

    return filtered_data


def get_filtered_data(handler):
    args = get_args(handler)
    state = args.get('state', ['uttar pradesh'])[0]
    # name_of_person = args.get('name_of_person', [''])[0]
    data = get_data(state)
    filtered_data = data[data['StateName'] == state.title()]
    # if name_of_person != '':
    #     filtered_data = filtered_data[filtered_data['CANDINAME'] == name_of_person.upper()]

    return filtered_data

def convert_to_leading_or_trailing(e):
    if e == 1:
        return 'Leading'
    else:
        return 'Trailing'

def get_party_name_for_person(name_of_person, state):

    if state == 'uttar pradesh' and name_of_person != 'akhilesh yadav':
        if name_of_person != '':
            for e in person_name_for_parties[state]:
                if person_name_for_parties[state][e] == name_of_person.title():
                    return e
        else:
            return ''
    elif state == 'uttar pradesh' and name_of_person == 'akhilesh yadav':
        return 'SP+CONG'
    elif state == 'punjab' and name_of_person == 'narendra modi':
        return 'SAD+BJP'
    elif state == 'punjab' and name_of_person == 'rahul gandhi':
        return 'CONG'
    elif state == 'punjab' and name_of_person == 'arvind kejriwal':
        return 'AAP+'



def get_color(v):
    if v in party_colors_for_map.keys():
        val_to_return = party_colors_for_map[v]
    else:
        val_to_return = 'black'
    return val_to_return


def get_final_data_for_visual(final_df, callfrom, name_of_person, state, regions, phases):
    '''
        This function will be called for Individual Candidates, Multiple Candidates, and Map
        For Individual Candidates,  filter the created data by Name
            only individual_candidates_data will have parties_data key
        For Map, filter the created data by Name
            only Map will have consituencies
    '''
    # if (state != 'uttar pradesh'):
    final_df = final_df[final_df['AllianceName']!='OTH']

    final_temp = []
        # final_temp.append(temp_dict)
        # print temp_dict, "-------------", pictures_for_parties[state]
    if callfrom != 'map_data':
        if state == 'uttar pradesh':
            # sp_const_dict = leading_data[leading_data['Abbr']=='SP'].groupby('Abbr')['ConstName'].apply(list).to_dict()
            temp_df = final_df[final_df['AllianceName'] == 'SP+CONG']
            temp_df['AllianceName'] = 'SP'
            final_df = pd.concat([final_df, temp_df], axis=0)
        for party in parties_order[state]:
            temp_df1 = final_df[final_df['ConstName'].isin(campaigned_constituencies_state_wise[state][party])]
            temp_df1 = temp_df1[temp_df1['AllianceName'] == party]
            temp_df1['Rank'] = temp_df1['Rank'].apply(convert_to_leading_or_trailing)
            temp_df1 = temp_df1[temp_df1['Votes'] != 0]
            campaigned_count = len(campaigned_constituencies_state_wise[state][party])
            final_temp.append({
                'Leading': len(temp_df1[temp_df1['Rank'] == 'Leading']),
                'Trailing': len(temp_df1[temp_df1['Rank'] == 'Trailing']),
                'Party': party,
                'Picture': pictures_for_parties[state][party],
                'Name': person_name_for_parties[state][party],
                'Campaigned': campaigned_count,
                'Percentage': round((len(temp_df1[temp_df1['Rank'] == 'Leading']) / float(campaigned_count)) * 100, 0),
                'ribbon_color': ribbon_colors[party],
                'rectangle_color': party_colors_for_map[party]
            })
    else:
        final_temp = {}
        party_name_for_person = get_party_name_for_person(name_of_person, state)
        constituencies_of_filtered_data = final_df[final_df['AllianceName']==party_name_for_person]['ConstName'].unique().tolist()
        constituencies_of_campaigned_data = campaigned_constituencies_state_wise[state][party_name_for_person]
        # if len(filtered_data_constituencies) == len(campaigned_data_constituencies):
        all_parties = final_df['AllianceName'].unique().tolist()
        temp_df_ = final_df[final_df['ConstName'].isin(constituencies_of_campaigned_data)]
        campaigned_count = len(temp_df_['ConstName'].unique().tolist()) if regions != [] or phases != [] else len(constituencies_of_campaigned_data)
        temp_df_ = temp_df_[temp_df_['Rank'] == 1]
        temp_df_ = temp_df_[temp_df_['Votes'] != 0]
        temp_df_['AllianceName_'] = temp_df_['AllianceName']
        parties_ = temp_df_.groupby('AllianceName').agg({'AllianceName_': 'count'})['AllianceName_'].to_json()
        parties = json.loads(parties_)
        for e in all_parties:
            if e not in parties.keys():
                parties[e] = 0
        parties_data = json.dumps(parties)
        temp_df_['Color'] = temp_df_['AllianceName'].apply(lambda v: get_color(v))
        temp_df_.set_index('ConstName', inplace=True)
        const_data = temp_df_['Color'].to_dict()

        final_temp = {
            'Leading': len(temp_df_[temp_df_['AllianceName'] == party_name_for_person]),
            # 'Trailing': len(temp_df1[temp_df1['Rank'] == 'Trailing']) if len(temp_df1) > 0 else 0,
            'Party': party_name_for_person,
            'Picture': pictures_for_parties[state][party_name_for_person] if party_name_for_person in campaigned_constituencies_state_wise[state].keys() else '',
            'Name': name_of_person,
            'parties_data': parties_data,
            'Campaigned': campaigned_count,
            'Percentage': round((len(temp_df_[temp_df_['AllianceName'] == party_name_for_person]) / float(campaigned_count)) * 100, 0) if len(temp_df_) > 0 else 0,
            'const_data': const_data
        }
    return final_temp


def get_candidates_data(handler):
    args = get_args(handler)
    state = args.get('state', ['uttar pradesh'])[0].lower()

    filtered_data = get_filtered_data(handler)
    final_data = get_final_data_for_visual(filtered_data, 'multiple_candidates_data', '', state, [], [])
    return {"data": final_data}

# def get_individual_data_from_final_data(final_data_for_visual, parties_data, name_of_person):
#     individual_data = []
#     for e in final_data_for_visual:
#         if e['Name'] == name_of_person.title():
#             e['parties_data'] = parties_data
#             individual_data.append(e)
#     return individual_data

def get_individual_data(handler):

    data = get_filtered_data(handler)
    args = get_args(handler)
    state = args.get('state', ['uttar pradesh'])[0].lower()
    name_of_person = args.get('name_of_person', [''])[0]

    regions = [e.upper() for e in args.get('regions', [])[0].split(',')] if args.get('regions', [])[0] != '' else []
    if args.get('phases', [])[0] != '':
        phases = [int(e) for e in args.get('phases', [])[0].split(',')]
    else:
        phases = []

    filt_df = data
    if phases != []:
        if 'PHASE' in filt_df.columns:
            filt_df = filt_df[filt_df['PHASE'].isin(phases)]
    if regions != []:
        filt_df = filt_df[filt_df['REGION'].isin(regions)]
    if len(filt_df) != 0:
        final_data_for_visual = get_final_data_for_visual(filt_df, 'map_data', name_of_person, state, regions, phases)
    else:
        party_name_for_person = get_party_name_for_person(name_of_person, state)
        all_parties_for_state = person_name_for_parties[state].keys()
        parties_data = [{"Party_Name": e, "Party_Count": 0} for e in all_parties_for_state]
        final_data_for_visual = [{
            'Campaigned': campaigned_constituencies_state_wise[state][party_name_for_person],
            'Leading':0,
            'Name': name_of_person,
            'Party': party_name_for_person,
            'Percentage':0,
            'Picture':"",
            'Trailing':0,
            'const_data': {},
            'parties_data': parties_data,
            'phases_regions_data':[{"Phases": phases_for_states[state], "Regions":regions_for_states[state]}],
            "0":{"const_data": {}}
        }]

    # individual_data = get_individual_data_from_final_data(final_data_for_visual, parties_data, name_of_person)

    return {"data": final_data_for_visual}

'''
def get_map_filtered_data(handler):
    data = get_filtered_data(handler)
    args = get_args(handler)

    state = args.get('state', ['uttar pradesh'])[0].lower()
    regions = [e.upper() for e in args.get('regions', [])[0].split(',')] if args.get('regions', [])[0] != '' else []
    if args.get('phases', [])[0] != '':
        phases = [int(e) for e in args.get('phases', [])[0].split(',')]
    else:
        phases = []
    name_of_person = args.get('name_of_person', [''])[0]

    filt_df = data
    if phases != []:
        if 'PHASE' in filt_df.columns:
            filt_df = filt_df[filt_df['PHASE'].isin(phases)]
    if regions != []:
        filt_df = filt_df[filt_df['REGION'].isin(regions)]
    if len(filt_df) != 0:
        final_data_for_visual = get_final_data_for_visual(filt_df, 'map_data', name_of_person, state)
    else:
        final_data_for_visual = {"0":{"const_data": {}}}
    # phases = args.get('phases', [])

    return {"data": final_data_for_visual}
'''

def refresh_roti_data(handler):
    args = get_args(handler)
    state = args.get('state', ['uttar pradesh'])[0].lower()
    refresh_data(state)
    return {}


def get_up_data(handler):
    state = 'uttar pradesh'
    args = get_args(handler)
    name_of_person = args.get('name_of_person', [''])[0]
    regions = [e.upper() for e in args.get('regions', [])[0].split(',')] if args.get('regions', [])[0] != '' else []
    if args.get('phases', [])[0] != '':
        phases = [int(e) for e in args.get('phases', [])[0].split(',')]
    else:
        phases = []

    filt_df = get_filtered_data_(state)
    filt_df = filt_df[filt_df['REGION'].isin(regions)] if regions != [] else filt_df
    filt_df = filt_df[filt_df['PHASE'].isin(phases)] if phases != [] else filt_df
    final_temp = get_final_data_for_visual(filt_df, 'map_data', name_of_person, state, regions, phases)

    return final_temp


def get_punjab_data(handler):
    state = 'punjab'
    args = get_args(handler)
    name_of_person = args.get('name_of_person', [''])[0]
    regions = [e.upper() for e in args.get('regions', [])[0].split(',')] if args.get('regions', [])[0] != '' else []

    filt_df = get_filtered_data_(state)
    filt_df = filt_df[filt_df['REGION'].isin(regions)] if regions != [] else filt_df
    # print filt_df['REGION'].unique(), regions, "_____________________", len(filt_df)
    final_temp = get_final_data_for_visual(filt_df, 'map_data', name_of_person, state, regions, [])

    return final_temp
