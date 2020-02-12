import csv


def data_reader():
    reader = csv.DictReader(open("data.csv"))
    for raw in reader:
        print(raw)