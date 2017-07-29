"""Fetching Data from database."""

from tornado.escape import recursive_unicode
import json
import gramex
# import pyodbc
# import pandas.io.sql as psql
from pandas.io.json import dumps
import pandas as pd
import refresh_data as ref

cache = gramex.service.cache.memory


state_name_mapping = {
    'punjab': 'punjab',
    'goa': 'goa',
    'uttar pradesh': 'up',
    'uttarakhand': 'uk',
    'manipur': 'manipur'
}

party_replace = {
    'SP + CONG': 'SP+CONG', 'SAD + BJP': 'SAD+BJP', 'AAAP': 'AAP'}

party_dict = {'INC': 'CONG', 'AAAP': 'AAP'}

def get_livedata(handler):
    """Function defined to get live data."""
    args = recursive_unicode(handler.request.arguments)
    state = args.get('state', ['uttar pradesh'])[0]
    year = args.get('year', [2017])[0]
    is_refresh = args.get('refresh', ['no'])[0]

    if is_refresh == 'yes':
        ref.refresh_data(state)

    # if year != 2017:
    #     data = ref.get_prev_data(state)
    # else:
    data = ref.get_live_data(state)
    data = ref.merge_filters(data, state)
    col_renames = {
        'Votes': 'VOTES',
        'ConstName': 'AC_NAME',
        'Abbr': 'PARTY',
        'AllianceName': 'PARTY_ALLIANCE',
        'Rank': 'rank'
    }
    data = data.rename(columns=col_renames)

    data['VOTES'] = data['VOTES'].astype(int)
    data['AC_NAME'] = data['AC_NAME'].apply(lambda v: v.upper())
    data['PARTY_ALLIANCE'] = data['PARTY_ALLIANCE'].apply(
        lambda v: party_replace.get(v, v))

    data['PARTY'] = data['PARTY'].apply(lambda v: party_dict.get(v, v))

    tot_votes = data['VOTES'].sum()
    # data['rank'] = data.groupby('AC_NAME')['VOTES'].rank(
    #     ascending=False, method='dense').astype(int)
    # data.to_csv('live_res.csv', index=False)

    data_res = data[data['rank'].isin([1, 2])]

    data_pivot = pd.pivot_table(
        data_res, index=['AC_NAME'], columns=['rank'],
        aggfunc='max', values='VOTES')
    if len(data_pivot.columns) > 1:
        data_pivot['Diff'] = data_pivot[1] - data_pivot[2]
    else:
        data_pivot['Diff'] = 0
    data_pivot['margin'] = (data_pivot['Diff'] / data.groupby(
        'AC_NAME')['VOTES'].sum()) * 100.
    data_res = data_res.set_index('AC_NAME')
    data_res['margin'] = data_pivot['margin']

    data_res = data_res[data_res['CANDI_STATUS'].isin(['LEADING', 'WON'])]

    data_res = data_res.reset_index()

    return dumps({
        'data': data_res.to_dict(orient='records'),
        'tot_votes': tot_votes,
        'tot_data': data.to_dict(orient='records')})
