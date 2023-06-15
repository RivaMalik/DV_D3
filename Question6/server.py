import pandas as pd
from flask import Flask,Response,render_template
import json

df_raw=pd.read_csv("crime_data.csv")

#extract columns of interest
df_raw.drop(['AREA','Rpt Dist No', 'Part 1-2', 'Crm Cd', 'Mocodes', 'Premis Cd', 'Premis Desc',
       'Weapon Used Cd', 'Weapon Desc', 'Status', 'Status Desc', 'Crm Cd 1',
       'Crm Cd 2', 'Crm Cd 3', 'Crm Cd 4', 'LOCATION', 'Cross Street', 'LAT','Date Rptd'
       ,'DATE OCC','TIME OCC','Crm Cd Desc','Vict Sex','Vict Age','Vict Descent','LON'], axis='columns', inplace=True)

#dropping nulls
df_raw= df_raw.dropna()
df=df_raw['AREA NAME'].value_counts().reset_index()
df.columns = ['area', 'count']
print(df.to_json(orient='records'))

app=Flask(__name__)
@app.route('/')
def test():
    recs = df.to_dict(orient="index")
    #print(recs);        
    return render_template("q6.html",data=df.to_json(orient='records'))
        


if __name__ =='__main__':
    app.run(debug=True)    