import numpy as np
import pandas as pd
import datetime as dt
import os
import time
from datetime import datetime

def strike_data(handler):
    args = handler.request.arguments
    state =  args.get('state')[0].title().decode('utf-8')

    Party_cand = {'Uttar Pradesh':['SP+CONG','BJP+','BSP','OTH'],'Punjab':["SAD+BJP","CONG","AAP+","OTH"],'Uttarakhand':["CONG",
    "BJP","BSP","OTH"],'Goa':["AAP","CONG","BJP","OTH"],'Manipur':["CONG","BJP","PRJA","OTH"]}

    eightam = datetime.strptime(datetime.now().strftime('%Y/%b/%d') + ' 08:00:00','%Y/%b/%d %H:%M:%S')
    start_time = time.mktime(eightam.timetuple())

    z = pd.DataFrame(Party_cand)
    zz = pd.unique(z.values.flatten())
    default = pd.DataFrame(index = z.keys(),columns = zz).fillna(0)
    default.index.name = 'StateName'
    default.reset_index()
    default['x'] = start_time
    default['level_1'] = 0
    default_date = default.reset_index()
    
    if os.path.exists('strike-rate/strike_rate_data.csv'):
        df = pd.read_csv('strike-rate/strike_rate_data.csv')
    else:
        df = default_date
    df = df[df['StateName'].str.lower() == state.lower()]

    col_list = Party_cand[state] + ['x']
    return df[col_list].to_json(orient='records')