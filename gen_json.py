# Functions to generate JSON files.

import pandas as pd
import numpy as np
from datetime import datetime
import json

# File paths
month_ct_path = "month_ct.json"

all_data = pd.read_json('watch-history.json')
all_data = all_data[all_data['header'] != 'YouTube Music']

# Generates monthly counts of videos, saves into monthly_ct.json
def month_ct():
    month_df = all_data.copy(deep = True)

    # Convert time string to month
    def to_month(timestr):
        index = timestr.index("T")
        timestr = timestr[2:index]
        date = datetime.strptime(timestr, '%y-%m-%d')
        return date.month

    vectorized_to_month = np.vectorize(to_month)
    month_df['time'] = vectorized_to_month(month_df['time'])

    # month_df is all_data, but with time column switch to months.
    month_df = month_df.rename(columns={'time': 'month'})
    
    # Find vid ct per month
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    data = {}

    for i in range(12):
        data[months[i]] = len(month_df[month_df['month'] == i + 1])

    print("Monthly Video Count")    

    for i in range(12):
        print(months[i] + ": " + str(data[months[i]]))

    # Write to JSON file
    with open(month_ct_path, 'w') as file:
        json.dump(data, file)

month_ct()