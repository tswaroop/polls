from refresh_data import get_live_data,get_prev_data
import json
import pandas as pd


def constPopUp(handler):
    args = handler.request.arguments
    state = args.get('state')[0]
    ac_name = args.get('ac_name')[0]
    name = ac_name.upper()
    final_data = {}
    final_data["name"]=ac_name.upper()
    final_data["main_const"]=True
    data = get_live_data(state)
    data1 = get_prev_data(state)
    data = data[data['ConstName']==ac_name.upper()]
    if name in dict1:
        name = dict1[name]
    data1 = data1[data1['AC_NAME']==name]
    final_data["previousData"] = getPrev_const(data1)
    final_data["ac_details"] = getDet_const_new(name,state)
    final_data["cdata"] = getPresent_const(data,ac_name,state)
    return final_data

dict1 = {
    "CAMPIERGANJ":"CAIMPIYARGANJ",
    "HARDWAR RURAL":"HARIDWAR RURAL",
}

def getPrev_const(data1):
    data2 = data1[["PARTY","NAME","VOTES"]]
    data2["diff"] = data2['VOTES'] - data2['VOTES'].shift(-1)
    data2.columns = ['party', 'cname', 'votes', 'diff']
    return json.loads(data2[:1].to_json(orient='records'))

def getDet_const_new(ac_name,state):
    readCsv = {"uttar pradesh":"UP_data_const","manipur":"Manipur_data_const","punjab":"Punjab_data_const","uttarakhand":"UK_data_const","goa":"Goa_data_const"}
    df = pd.read_csv("data/"+readCsv[state.lower()]+".csv")
    df = df[df['MERGE']==ac_name.upper()]
    df.pop('CNAME')
    df.pop('MERGE')
    return json.loads(df.to_json(orient='records'))

def getDet_const(data1):
    data3 = data1[["REGION","GEOSTATUS","RELSTATUS","PHASE","PC_NAME"]]
    return json.loads(data3[:1].to_json(orient='records'))


party_config = {"uttar pradesh":["BJP+","BSP","SP+CONG"],
                    "punjab":["AAP+","CONG","SAD+BJP"],
                    "manipur":["BJP","CONG","PRJA"],
                    "uttarakhand":["BJP","BSP","CONG"],
                    "goa":["AAP","BJP","CONG"]}

def getPresent_const(data,ac_name,state):
    data = data.sort_values(['Votes'], ascending=False)
    data["diff"] = data['Votes'] - data['Votes'].shift(-1)
    df1 = data.head(1)
    df4 = data.drop(data.index[0])
    df2 = df4[df4["AllianceName"].isin(party_config[state.lower()])]
    df3 = df4[~df4["AllianceName"].isin(party_config[state.lower()])]
    frames = [df1,df2,df3]
    data = pd.concat(frames)
    data = data[["AllianceName","CandiName","Votes","CANDI_STATUS",'diff']]
    # data.to_csv("csvv.csv")
    data.columns = ['party', 'cname', 'votes',"candi_status", 'diff']
    return json.loads(data[:4].to_json(orient='records'))