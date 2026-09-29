window.SOURCE = {
  "LoadActivity": {
    "start": 124,
    "code": "def LoadActivity(Individual, ActivityLog):\n  ActivityLog = []\n  DataFile = open(ACTIVITY_FILE, 'r')\n  DataLine = DataFile.readline()\n  while DataLine !=\"\":\n    Activity = Exercise()\n    ActivityData = DataLine.split(\",\")\n    Activity.PersonID = ActivityData[0]\n    Activity.Age = int(ActivityData[1])\n    Activity.DayNo = int(ActivityData[2])\n    Activity.WeekNo = int(ActivityData[3])\n    Activity.Time = ActivityData[4]\n    Activity.Type = ActivityData[5]\n    Activity.Duration = int(ActivityData[6])              \n    Activity.Distance = float(ActivityData[7])             \n    Activity.AverageHeartRate = int(ActivityData[8])\n    Activity.Weight = float(ActivityData[9])\n    Activity.CaloriesBurned = CalculateCalories(Activity,Individual)\n    if Activity.PersonID == Individual.ID:\n      ActivityLog.append(Activity)\n    DataLine = DataFile.readline()\n  DataFile.close()\n  return ActivityLog"
  },
  "AppendActivityToFile": {
    "start": 245,
    "code": "def AppendActivityToFile(Activity):\n  DataLine = \"\\n\" + Activity.PersonID\n  DataLine = DataLine + \",\" + str(Activity.Age)\n  DataLine = DataLine + \",\" + str(Activity.DayNo)\n  DataLine = DataLine + \",\" + str(Activity.WeekNo)\n  DataLine = DataLine + \",\" + Activity.Time\n  DataLine = DataLine + \",\" + Activity.Type\n  DataLine = DataLine + \",\" + str(Activity.Duration)\n  DataLine = DataLine + \",\" + str(Activity.Distance)\n  DataLine = DataLine + \",\" + str(Activity.AverageHeartRate)\n  DataLine = DataLine + \",\" + str(Activity.Weight)\n  DataFile = open(ACTIVITY_FILE, 'a')\n  DataFile.write(DataLine)\n  DataFile.close()"
  },
  "EnterHeartRate": {
    "start": 193,
    "code": "def EnterHeartRate():\n  AverageHeartRate = int(input(\"Enter average heart rate during activity (Beats per minute): \"))\n  while AverageHeartRate <= 0:\n    print(\"Average heart rate must be greater than 0\")\n    AverageHeartRate = int(input(\"Enter average heart rate during activity (Beats per minute): \"))\n  return AverageHeartRate"
  },
  "AddActivity": {
    "start": 200,
    "code": "def AddActivity(Individual, ActivityLog):\n  Activity = Exercise()\n  Activity.PersonID = Individual.ID\n  Activity.Age = Individual.Age\n  Activity.Weight = Individual.Weight\n  print()\n  print(\"Add an Activity\")\n  print()\n  print(\"ID: \", Activity.PersonID)\n  print()\n  Activity.DayNo = EnterDayNumber()     \n  Activity.WeekNo = EnterWeekNumber()  \n  Activity.Time = EnterTime()\n  Activity.AverageHeartRate = EnterHeartRate()\n  Activity.Type = input(\"Type of Activity (e.g. running, swimming, cycling): \")\n  Activity.Duration = EnterDuration()\n  Activity.Distance = EnterDistance()\n  Activity = DisplayNewActivity(Activity, Individual)\n  ActivityLog.append(Activity)\n  AppendActivityToFile(Activity)\n  return ActivityLog"
  },
  "records": [
    "1001,21,1,3,08:30,Running,60,10.0,148,70.1",
    "1001,21,2,3,07:30,Running,58,10.9,137,71.2",
    "1001,21,2,3,18:30,Running,65,11.0,178,69.9",
    "1001,21,3,3,18:30,Running,60,11.2,154,70.5",
    "1001,21,4,3,10:00,Running,70,12.8,160,72.0",
    "1001,21,4,3,18:30,Cycling,62,25.6,178,72.5",
    "1001,21,5,3,13:30,Cycling,55,28.9,145,71.9",
    "1001,21,6,3,08:30,Cycling,70,31.0,123,71.1",
    "1001,21,7,3,07:30,Cycling,30,15.6,188,70.5",
    "1001,21,1,4,11:00,Cycling,20,12.8,192,69.9",
    "1001,21,2,4,08:10,cycling,87,33.3,189,70.3",
    "1001,21,4,44,13:40,running,140,24.1,156,72.5",
    "1001,21,4,32,17:34,running,77,10.6,177,70.1",
    "1002,60,6,5,10:20,running,40,20.0,120,90.0"
  ]
};
