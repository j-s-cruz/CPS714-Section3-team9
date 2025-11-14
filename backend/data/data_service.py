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

def getSignupsData():
    signups_data = [
        ["2024-01-01", 50],
        ["2024-02-01", 75],
        ["2024-03-01", 100],
        ["2024-04-01", 80],
        ["2024-05-01", 120],
        ["2024-06-01", 90],
        ["2024-07-01", 110],
        ["2025-07-01", 110],
    ]

    return signups_data

def getCancellationsData():
    cancellations_data = [
        ["2024-01-01", 5],
        ["2024-02-01", 7],
        ["2024-03-01", 10],
        ["2024-04-01", 8],
        ["2024-05-01", 12],
        ["2024-06-01", 9],
        ["2024-07-01", 11],
        ["2025-07-01", 11],
    ]

    return cancellations_data

def getSignupsAndCancellationsData():
    signups_data = [
        ["2024-01-01", 50],
        ["2024-02-01", 75],
        ["2024-03-01", 100],
        ["2024-04-01", 80],
        ["2024-05-01", 120],
        ["2024-06-01", 90],
        ["2024-07-01", 110],
        ["2025-07-01", 110],
    ]

    cancellations_data = [
        ["2024-01-01", 5],
        ["2024-02-01", 7],
        ["2024-03-01", 10],
        ["2024-04-01", 8],
        ["2024-05-01", 12],
        ["2024-06-01", 9],
        ["2024-07-01", 11],
        ["2025-07-01", 11],
    ]

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

    class_names = [row[0] + ": " + row[1] for row in class_popularity_data]
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
        ["2024-01-01", 150],
        ["2024-02-02", 175],
        ["2024-03-03", 200],
        ["2024-04-04", 180],
        ["2024-05-05", 220],
        ["2024-06-06", 190],
        ["2024-07-07", 210],
    ]

    return daily_visits_data