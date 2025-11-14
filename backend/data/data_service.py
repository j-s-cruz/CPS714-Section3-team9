# service here

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