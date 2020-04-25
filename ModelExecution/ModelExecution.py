'''
Author: Anurag Kumar
'''
import sys
from kafka import KafkaProducer, KafkaConsumer
import json
from collections import namedtuple

#Testing CI by adding this comment
class Execution:
    def __init__(self):
        self.topic = 'DataRetrieval'
        self.producer = KafkaProducer(bootstrap_servers='kafka-service:9092')

    def publish_message(self, message, topic, key=None):
        if key:
            key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(topic, key = key, value = val)
        self.producer.flush()

    def extract_data(self, message):
        data = message["value"]
        j = {
             'summary' : data['summary'],
             'humidity' : data['humidity'],
             'temperature' : data['temperature'],
             'WindSpeed' : data['windSpeed']
        }
        return j

    def getData(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'kafka-service:9092',
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            if len(mssg) > 0:
                message = json.loads(mssg.value)
                print(mssg)
                data = self.extract_data(message)
                data = json.dumps(data)
                print("Information extracted")
                #Since we need to pass the message to the next API call, we
                #need to change the mssage parameters and convert mssg back from json object to string
                mssg = {"sessID": message["sessID"],
                        "userID": message["userID"],
                        "action": "postanalysis",
                        "value": data,
                        "timeStamp": message["timeStamp"]}
                mssg = json.dumps(mssg)
                self.publish_message(message = mssg, topic = 'modelexecution')
                print("Data sent for post analysis...")

if __name__ == '__main__':
    print("Starting ME Service")
    exe = Execution()
    print("Consumer started..")
    exe.getData()
