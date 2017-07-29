"""Fetching Data from database."""

from tornado.escape import recursive_unicode
import gramex
import pandas as pd
import json as js
import numpy as np
import refresh_data as rd

cache = gramex.service.cache.memory


def get_swing_data(handler):

    args = recursive_unicode(handler.request.arguments)
    state = args.get('state', ['uttar pradesh'])[0]
    state = handler.get_arguments('state')[0].lower()
    refresh = args.get('refresh', ['0'])[0]

    if refresh == '1':
        data = rd.refresh_data(state);
    else:
        data = rd.get_live_data(state)

    data = data.merge(data.groupby('ConstId')['Votes'].sum().reset_index().rename(
        columns={'Votes': 'ValidVotes'}), on='ConstId').rename(
    columns={'AllianceName': 'Party'})

    parties = list(data['Party'].unique())
    data = data[data['Rank'] < 3]
    data['CandiStatus'] = data['Rank'].replace({1: 'WON', 2: 'LOST'})
    map_file = open('data/eng_hindi_map.json')
    hindi_mapping = js.loads(map_file.read())
    map_file.close()

    output = {
        'data': data[['ConstId', 'ConstName', 'Party', 'CandiStatus', 'Votes',
        'ValidVotes', 'Rank']].to_json(orient='records'),
        'parties': parties,
        'hindi_mapping': hindi_mapping
    }

    return output

