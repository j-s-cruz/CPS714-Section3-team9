from datetime import datetime, date, timedelta
from data.data_repo import *

def getMembershipData():
    membership_data = [
        ["2024-01-01", 50],
        ["2024-02-01", 75],
        ["2024-03-01", 100],
        ["2024-04-01", 80],
        ["2024-05-01", 120],
        ["2024-06-01", 90],
        ["2024-07-01", 110],
    ]

    return membership_data

def getSignupsAndCancellationsData():

    data = getSignupsAndCancellationsDataFromRepo()

    signup_dates = []
    cancellation_dates = []

    today = date.today()

    for row in data:
        # convert to datetime and then date
        signup_dates.append(datetime.fromisoformat(row['created_at']).date())

        if row['current_period_end'] != None:
            # only count memberships that have ended, not ones that will end
            if (datetime.fromisoformat(row['current_period_end']) < (today + timedelta(days = 1))):
                cancellation_dates.append(datetime.fromisoformat(row['current_period_end']).date())

    # sort to get the earliest date
    signup_dates.sort()

    # generate list of dates starting from earliest day to today
    start = signup_dates[0]
    end = today
    date_generated = [start + timedelta(days=x) for x in range(0, (end - start + timedelta(days = 1)).days)]

    signup_dates_dict = {}

    # create signup_dates_dict with 0 values
    for generated_date in date_generated:
        signup_dates_dict[generated_date.strftime("%Y-%m-%d")] = 0

    cancellation_dates_dict = signup_dates_dict.copy()

    # read through signup_dates and cancellation_dates and increment dictionary
    for signup_date in signup_dates:
        signup_dates_dict[signup_date.strftime("%Y-%m-%d")] = signup_dates_dict[signup_date.strftime("%Y-%m-%d")] + 1

    for cancellation_date in cancellation_dates:
        cancellation_dates_dict[cancellation_date.strftime("%Y-%m-%d")] = cancellation_dates_dict[cancellation_date.strftime("%Y-%m-%d")] + 1

    # turns dictionary into list
    signups_data = [list(item) for item in signup_dates_dict.items()]
    cancellations_data = [list(item) for item in cancellation_dates_dict.items()]

    # remove last 3 characters which are the dates so that we only deal with months
    for row in signups_data:
        row[0] = row[0][:-3]

    for row in cancellations_data:
        row[0] = row[0][:-3]

    # combine together all the months 
    counter = Counter()
    for month, number in signups_data:
        counter[month] += number

    # list(counter.items()) is a list of tuples so we convert to a list of lists
    signups_data = [list(t) for t in list(counter.items())]

    counter = Counter()
    for month, number in cancellations_data:
        counter[month] += number

    cancellations_data = [list(t) for t in list(counter.items())]

    # signups_data = [
    #     ["2025-01", 50],
    #     ["2025-02", 75],
    #     ["2025-03", 100],
    #     ["2025-04", 80],
    #     ["2025-05", 120],
    #     ["2025-06", 90],
    #     ["2025-07", 110],
    # ]

    # cancellations_data = [
    #     ["2025-01", 5],
    #     ["2025-02", 7],
    #     ["2025-03", 10],
    #     ["2025-04", 8],
    #     ["2025-05", 12],
    #     ["2025-06", 9],
    #     ["2025-07", 11],
    # ]

    return [signups_data, cancellations_data]

def getClassPopularityData():
    class_popularity_data = [
        ["Yoga", 15],
        ["Pilates", 12],
        ["Spinning", 20],
        ["Zumba", 18],
        ["CrossFit", 22],
        ["Boxing", 30],
        ["HIIT", 25],
        ["Yoga2", 15],
        ["Pilates2", 12],
        ["Spinning2", 20],
        ["Zumba2", 18],
        ["CrossFit2", 22],
        ["Boxing2", 30],
        ["HIIT2", 25],
        ["Yoga3", 15],
        ["Pilates3", 12],
        ["Spinning3", 20],
        ["Zumba3", 18],
        ["CrossFit3", 22],
        ["Boxing3", 30],
        ["HIIT3", 25],
    ]

    class_popularity_data.sort(key=lambda x: x[1], reverse=True)

    class_names = [row[0] for row in class_popularity_data]
    class_counts = [row[1] for row in class_popularity_data]

    top_class_names = class_names[:10]
    top_class_counts = class_counts[:10]

    return [top_class_names, top_class_counts]

def getClassTimesPopularityData():
    class_popularity_data = [
        ["Yoga", "10:00 am", 15],
        ["Pilates", "4:00 pm", 12],
        ["Spinning", "10:00 am",20],
        ["Zumba", "4:00 pm", 18],
        ["CrossFit", "10:00 am",22],
        ["Boxing", "10:00 am",30],
        ["HIIT", "4:00 pm", 25],
        ["Yoga2", "4:00 pm", 15],
        ["Pilates2", "4:00 pm", 12],
        ["Spinning2", "10:00 am",20],
        ["Zumba2", "4:00 pm", 18],
        ["CrossFit2", "10:00 am",22],
        ["Boxing2", "4:00 pm", 30],
        ["HIIT2", "10:00 am",25],
        ["Yoga3", "4:00 pm", 15],
        ["Pilates3", "10:00 am",12],
        ["Spinning3", "4:00 pm", 20],
        ["Zumba3", "10:00 am",18],
        ["CrossFit3", "4:00 pm", 22],
        ["Boxing3", "10:00 am", 30],
        ["HIIT3", "4:00 pm", 25],
    ]

    class_popularity_data.sort(key=lambda x: x[2], reverse=True)

    class_names = [row[1] for row in class_popularity_data]
    class_counts = [row[2] for row in class_popularity_data]

    top_class_names = class_names[:10]
    top_class_counts = class_counts[:10]

    return [top_class_names, top_class_counts]

def getGymOccupancyData():
    occupancy_data = [
        ["2024-01-01 10:00", 30],
        ["2024-01-01 11:00", 45],
        ["2024-01-01 12:00", 50],
        ["2024-01-01 13:00", 40],
        ["2024-01-01 14:00", 60],
        ["2024-01-01 15:00", 55],
        ["2024-01-01 16:00", 70],
        ["2025-01-01 10:00", 30],
        ["2025-01-01 11:00", 45],
        ["2025-01-01 12:00", 50],
        ["2025-01-01 13:00", 40],
        ["2025-01-01 14:00", 60],
        ["2025-01-01 15:00", 55],
        ["2025-01-01 16:00", 70],
    ]

    return occupancy_data

def getDailyVisitsData():
    daily_visits_data = [
        ["2025-01-01", 150],
        ["2025-02-02", 175],
        ["2025-03-03", 200],
        ["2025-04-04", 180],
        ["2025-05-05", 220],
        ["2025-06-06", 190],
        ["2025-07-07", 210],
        ["2025-12-31", 210],
    ]

    return daily_visits_data

def getHourlyUsageData():
    hourly_usage_data = [
        ["2024-01-01 06:00", 20],
        ["2024-01-01 07:00", 35],
        ["2024-01-01 08:00", 50],
        ["2024-01-01 09:00", 40],
        ["2024-01-01 10:00", 60],
        ["2024-01-01 11:00", 55],
        ["2024-01-01 12:00", 70],
        ["2025-01-01 06:00", 20],
        ["2025-01-01 07:00", 35],
        ["2025-01-01 08:00", 50],
        ["2025-01-01 09:00", 40],
        ["2025-01-01 10:00", 60],
        ["2025-01-01 11:00", 55],
        ["2025-01-01 12:00", 70],
        ["2025-01-08 12:00", 70],
    ]

    format_string = "%Y-%m-%d %H:%M"

    converted_datetime_dates = [datetime.strptime(row[0], format_string) for row in hourly_usage_data]
    converted_days_of_week_and_times = [date.strftime("%A %H:%M") for date in converted_datetime_dates]

    recombined_hourly_usage_data = [[converted_days_of_week_and_times[i], hourly_usage_data[i][1]] for i in range(len(hourly_usage_data))]

    summed_data = {}

    for row in recombined_hourly_usage_data:
        key = row[0]
        value = row[1]
        if key in summed_data:
            summed_data[key] += value
        else:
            summed_data[key] = value

    converted_hourly_usage_data = [[key, value] for key, value in summed_data.items()]
    for row in converted_hourly_usage_data:
        row[0] = row[0].replace("Sunday", "2025-11-02")
        row[0] = row[0].replace("Monday", "2025-11-03")
        row[0] = row[0].replace("Tuesday", "2025-11-04")
        row[0] = row[0].replace("Wednesday", "2025-11-05")
        row[0] = row[0].replace("Thursday", "2025-11-06")
        row[0] = row[0].replace("Friday", "2025-11-07")
        row[0] = row[0].replace("Saturday", "2025-11-08")

    total = sum(row[1] for row in converted_hourly_usage_data)

    # Convert number of people in gym to percentages
    final_hourly_usage_data = [[row[0], round(row[1] / total * 100, 2)] for row in converted_hourly_usage_data]

    return final_hourly_usage_data

def getNumberActiveMembers():
    data = getNumberActiveMembersFromRepo()

    total_members = len(data)

    return total_members
    
def getMemberTypesData():

    data = getMemberTypesDataFromRepo()

    tiers = []

    for row in data:
        tiers.append(row['tier'])

    tier_counts = Counter(tiers)

    tiersList = []
    tiersCountList = []

    for tier, count in tier_counts.items():
        tiersList.append(tier)
        tiersCountList.append(count)

    return [tiersList, tiersCountList]