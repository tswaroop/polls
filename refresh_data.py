"""File used to refresh data."""
import pyodbc
# import pandas.io.sql as psql
import pandas as pd
import gramex
from datetime import datetime
import os.path
from copy import copy
import time
# from tornado.escape import recursive_unicode
# import yaml
# from pandas.io.json import dumps


''' Columns for merged_data_qry
Index([u'ConstId', u'ConstName', u'PartyCode', u'CandiCode', u'CandiName',
       u'Votes', u'Abbr', u'CandiStatus', u'ValidVotes', u'CandiAllId',
       u'CandiMapPCode', u'StateCode', u'StateName', u'AllianceName', u'Rank'],
      dtype='object')
'''
merged_data_qry = """
    select ec.PNAME as pname, ec.ccode as ConstId,
    ec.cname as ConstName, ec.pcode as PartyCode,
    ec.CandiCode, ec.CandiName, ec.Votes,ec.CANDI_STATUS, ec.Abbr,
    ec.candi_alliance_id as CandiAllId,
    ec.candi_mapped_pcode as CandiMapPCode,
    sm.state_code as StateCode, sm.state_shortname_lang1 as StateName,
    am.Alliance_shortname_lang1 as AllianceName,
    RANK() OVER (PARTITION BY ec.ccode order by ec.votes desc) as Rank
    from
    eleca_candmast ec
    inner join Const_mst cm on cm.const_id = ec.ccode
    inner join state_mst sm on sm.state_id = cm.state_id
    left join alliance_mst am on am.alliance_id = ec.candi_alliance_id
    and am.state_id = sm.state_id {:}"""


# ========================== Queries End ========================== #

# Cache
cache = gramex.service.cache.memory

parties = {'x', 'SP + CONG', 'BJP+', 'BSP', 'OTH', "SAD + BJP", "CONG", "AAP+", "OTH",
           "CONG", "BJP", "BSP", "OTH", "CONG", "BJP", "AAP", "OTH", "CONG", "BJP", "PRJA", "OTH"}


alliance_map = {
    'uttar pradesh': {
        "SP": "SP+CONG", "CONG": "SP+CONG",
        "BJP": "BJP+", "APD(S)": "BJP+",
        "SBSP": "BJP+", "BSP": "BSP", 'INC': 'CONG'},
    'punjab': {
        "SAD": "SAD+BJP", "BJP": "SAD+BJP",
        "CONG": "CONG", 'INC': 'CONG',
        "AAP": 'AAP+', 'LIPF': "AAP+"},
    'uttarakhand': {"CONG": "CONG", "BJP": "BJP", "BSP": "BSP", 'INC': 'CONG'},
    'goa': {"CONG": "CONG", "BJP": "BJP", "AAP": "AAP", 'INC': 'CONG'},
    'manipur': {"CONG": "CONG", "BJP": "BJP", "PRJA": "PRJA", 'INC': 'CONG'}
}


def get_max(v, rows):
    v = v.sort('Votes', ascending=False)
    return v[(v['Votes'] > 0)].head(rows)


def get_candi_id_map():
    """Function used to define to get candi code mapping."""
    if 'cand_id_map' not in cache:
        ca_id_map = pd.read_csv('data/cand_id_map.csv')
        ca_id_map['CandiCode'] = ca_id_map['CandiCode'].dropna().astype(int)
        ca_id_map_grp = ca_id_map.groupby(
            ['AC_NAME', 'CandiCode'], as_index=False).agg(
            {'NAME': 'unique', 'STATE_NAME': 'count'})
        ca_id_map_grp['NAME'] = ca_id_map_grp['NAME'].apply(lambda v: v[0])
        ca_id_map_grp_clean = ca_id_map_grp[ca_id_map_grp['STATE_NAME'] == 1]
        cache['cand_id_map'] = ca_id_map_grp_clean[
            ['AC_NAME', 'CandiCode', 'NAME']]

    return cache['cand_id_map']


def get_const_id_map():
    """Function used to define get ccode mapping."""
    if 'const_id_map' not in cache:
        c_id_map = pd.read_csv('data/const_id_map.csv')
        c_id_map['CCODE'] = c_id_map['CCODE'].astype(int)
        c_id_map = c_id_map.set_index('CCODE').to_dict(orient='index')
        cache['const_id_map'] = c_id_map

    return cache['const_id_map']


def merge_candiname(state_data):
    """Function defined to get use csv candidate names code."""
    # used for candidate name mapping with id for hindi version
    cand_map = get_candi_id_map()

    # cand_map = cand_map.set_index(['AC_NAME', 'CandiCode'])
    state_data['CandiCode'] = state_data['CandiCode'].astype(int)

    data_merge = state_data.merge(
        cand_map, how='left', left_on=['ConstName', 'CandiCode'],
        right_on=['AC_NAME', 'CandiCode'])

    data_merge.loc[data_merge['NAME'].isnull(), 'NAME'] = (
        data_merge.loc[data_merge['NAME'].isnull(), 'CandiName'])

    data_merge['CandiName'] = data_merge['NAME']
    data_merge['CandiName'] = data_merge['CandiName'].apply(
        lambda v: v.upper())
    data_merge = data_merge.drop(['AC_NAME', 'NAME'], axis=1)
    return data_merge


def merge_constituency(state_data):
    """Function defined to get use old constituency code."""
    const_map = get_const_id_map()
    state_data['ConstName'] = state_data['ConstId'].astype(int).apply(
        lambda v: const_map.get(v).get('AC_NAME'))
    return state_data


def get_connection():
    """Switching of DB to be done based on some logic."""
    # con_str = 'DSN=nw18etv;UID=gramener18;PWD=gramener18'
    con_str = 'DSN=nw18karvy;UID=gramener18;PWD=gramener18'

    conn = pyodbc.connect(con_str)
    return conn


def get_live_data(state):
    """Function defined to get live data."""
    if 'live_data' not in cache:
        cache['live_data'] = {}

    if state not in cache['live_data']:
        conn = get_connection()

        state_cache = pd.read_sql(
            merged_data_qry.format(
                "where sm.state_shortname_lang1 = '{:}'".format(state)), conn)
        conn.close()

        state_cache['x'] = datetime.now().strftime(
            '%Y/%b/%d %H:%M:%S')
        # filter NOTA
        state_cache = state_cache[state_cache['Abbr'] != 'NOTA']
        state_cache = merge_constituency(state_cache)
        state_cache = merge_candiname(state_cache)
        cache['live_data'][state] = state_cache

    return cache['live_data'][state]


def refresh_all_states():
    """Refresh live data for all states."""
    """This is called only in scheduler."""
    # if 'live_data' in cache:
    #     del cache['live_data']

    conn = get_connection()
    data = pd.read_sql(merged_data_qry.format(''), conn)
    conn.close()

    curr_data = datetime.now()
    data['x'] = time.mktime(curr_data.timetuple())

    return data


def schedule_data():
    """Scheduler handler which runs every minute."""
    data = refresh_all_states()
    # data = data.groupby('ConstName').apply(get_max, 1).reset_index(drop=True)
    data = data[data['Votes'] >0]
    data = data[data['Rank'] == 1]

    if data.empty:
        return ''

    current_strike_data = data.groupby('StateName').apply(
        set_strike_data).reset_index().fillna(0)

    default_data = current_strike_data.copy()

    for col in default_data.columns:
        if col not in ['StateName', 'level_1', 'x']:
            default_data[col] = 0

    eightam = datetime.strptime(datetime.now().strftime(
        '%Y/%b/%d') + ' 08:00:00', '%Y/%b/%d %H:%M:%S')
    default_data['x'] = time.mktime(eightam.timetuple())

    f_path = 'strike-rate/strike_rate_data.csv'

    if os.path.exists(f_path):
        pd.concat([pd.read_csv(f_path), current_strike_data]
                  ).to_csv(f_path, index=False)
    else:
        pd.concat([default_data, current_strike_data]
                  ).to_csv(f_path, index=False)

    return ""


def refresh_data(state):
    """Fetch Data from the Database if data is not in cache."""
    if 'live_data' in cache:
        if state in cache['live_data']:
            del cache['live_data'][state]

    return get_live_data(state)


def set_strike_data(data):
    """Aggregate data for lead count party-wise. Data used by Strike-Rate."""
    """Output: [{'x': 2017/Mar/01 13:0:0, 'BJP': 10, 'CONG': 12}]."""
    df = pd.pivot_table(data, columns='AllianceName', index='x', values='ConstId',
                        aggfunc='count').reset_index().fillna(0)

    for party in parties.difference(df.columns):
        df[party] = 0

    return df


def get_prev_data(state):
    """Function defined to get last year data."""
    year = 2012
    state = state.lower()
    state_name_mapping = {
        'punjab': 'punjab',
        'goa': 'goa',
        'uttar pradesh': 'up',
        'uttarakhand': 'uk',
        'manipur': 'manipur'
    }
    if 'lastyear_data' not in cache:
        cache['lastyear_data'] = {}
    if state not in cache['lastyear_data']:
        ls_data = pd.read_csv(
            "data/{}_agg.csv".format(state_name_mapping.get(state)))
        ls_data['YEAR'] = ls_data['YEAR'].astype(int)
        ls_data = ls_data[ls_data['YEAR'] == year]
        cache['lastyear_data'][state] = ls_data

    return cache['lastyear_data'][state]


def get_state_filters(state):
    """Function defined to get filter data."""
    state = state.lower()
    state_name_mapping = {
        'punjab': 'punjab',
        'goa': 'goa',
        'uttar pradesh': 'up',
        'uttarakhand': 'uk',
        'manipur': 'manipur'
    }
    if 'filter_data' not in cache:
        cache['filter_data'] = {}
    if state not in cache['filter_data']:
        flt_data = pd.read_csv(
            "live/data/{}_filter.csv".format(state_name_mapping.get(state)))

        cache['filter_data'][state] = flt_data

    return cache['filter_data'][state]


def merge_filters(data, state):
    """Function defined to merge filters."""
    prev_data = get_state_filters(state)
    prev_data['CURR_PARTY_ALLIANCE'] = prev_data['LY_WINNER'].apply(
        lambda v: alliance_map[state].get(v, 'OTH'))
    data = data.merge(
        prev_data, how="left", left_on="ConstName", right_on="AC_NAME")
    data = data.drop('AC_NAME', axis=1).drop_duplicates()
    return data

get_candi_id_map()
get_const_id_map()
