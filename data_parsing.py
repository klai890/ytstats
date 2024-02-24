# Functions to generate JSON files.

import pandas as pd
import numpy as np
from datetime import datetime
import json
import functools 


# File paths
data_path = "history.csv"
month_ct_path = "month_ct.json"
day_ct_path = "day_ct.json"
month_year_ct_path = "month_year_ct.json"

def history_to_csv():
    all_data = pd.read_json('watch-history.json')

    # Only want YouTube videos, not YouTube Music or YouTube TV, or whatever other products might be included.
    all_data = all_data[all_data['header'] == 'YouTube']

    # Don't need anything other than the video ID and time
    all_data.drop(columns=['header', 'title', 'subtitles', 'products', 'activityControls', 'description'], inplace=True)

    # Transform video urls to video ids
    def get_vid_id(vidurl):
        # Format of YouTube URL: https://www.youtube.com/watch?v=someid
        indexStart = vidurl.index("v=") + 2
        return vidurl[indexStart:]

    # Vectorize the fcn
    vectorized_get_vid_id = np.vectorize(get_vid_id)

    # Remove all rows of removed videos
    all_data = all_data.dropna(subset=['titleUrl'])

    # Convert titleUrl to videoID
    all_data['titleUrl'] = vectorized_get_vid_id(all_data['titleUrl'])
    all_data = all_data.rename(columns={'titleUrl': 'videoId'})
    
    # Write to CSV file.
    all_data.to_csv(data_path, index=False)

# Generates monthly counts of videos, saves into month_ct_path
def month_ct():
    month_df = pd.read_csv(data_path)

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

# Generates counts of videos per day of week (total), saves into day_ct_path 
def day_ct():
    day_df = pd.read_csv(data_path)

    # Convert time string to day of week 
    # Note: 1 is Monday, Sunday is 0
    def to_weekday(timestr):
        index = timestr.index("T")
        timestr = timestr[2:index]
        date = datetime.strptime(timestr, '%y-%m-%d')
        return date.isoweekday() % 7

    vectorized_to_weekday = np.vectorize(to_weekday)
    day_df['time'] = vectorized_to_weekday(day_df['time'])

    # month_df is all_data, but with time column switch to months.
    day_df = day_df.rename(columns={'time': 'weekday'})

    # Find vid ct per day of week
    # Note: Indicies correspond with the weekday number as determined in to_weekday
    days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    data = {}

    for i in range(7):
        data[days[i]] = len(day_df[day_df['weekday'] == i])

    print("Video Count by Day of Week")

    for i in range(7):
        print(days[i] + ": " + str(data[days[i]]))

    # Write to JSON file
    with open(day_ct_path, 'w') as file:
        json.dump(data, file)

def month_year_ct():
    df = pd.read_csv(data_path)

    # Converts to month/year
    def to_my(timestr):
        index = timestr.index("T")
        timestr = timestr[2:index]
        date = datetime.strptime(timestr, '%y-%m-%d')
        return str(date.month) + "/" + str(date.year)

    vectorized_to_my = np.vectorize(to_my)
    df['time'] = vectorized_to_my(df['time'])

    # month_df is all_data, but with time column switch to months.
    df = df.rename(columns={'time': 'month_year'})

    def compare_mys(a, b):
        # one month/year is greater than the other if year is greater and month is greater
        a_slash = a.index("/")
        b_slash = b.index("/")
        a_month = int(a[0:a_slash])
        b_month = int(b[0:b_slash])
        a_year = int(a[a_slash + 1:len(a)])
        b_year = int(b[b_slash + 1:len(b)])
        if a_year > b_year:
            return 1
        elif a_year < b_year:
            return -1
        else:
            if a_month > b_month:
                return 1
            elif a_month < b_month:
                return -1
            else:
                return 0

    indices = sorted(df['month_year'].unique(), key=functools.cmp_to_key(compare_mys))
    data = {}

    for i in range(len(indices)):
        data[indices[i]] = len(df[df['month_year'] == indices[i]])

    print("Video Count by Month/Year")

    for i in range(len(indices)):
        print(indices[i] + ": " + str(data[indices[i]]))

    # Write to JSON file
    with open(month_year_ct_path, 'w') as file:
       json.dump(data, file)



# history_to_csv()
# month_ct()
# day_ct()
month_year_ct()

