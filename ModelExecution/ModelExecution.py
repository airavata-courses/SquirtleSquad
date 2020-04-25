'''
This code has been referred from https://github.com/ARM-DOE/pyart/tree/master/examples.
The files available for upload have been taken from https://engineering.arm.gov/~jhelmus/pyart_example_data/
I would also like to cite PyART module used in this project: 'JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119'


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
             'summary' : data[0],
             'humidity' : data[1],
             'temperature' : data[2],
             'WindSpeed' : data[3]
        }
        return j

    def getFilename(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'kafka-service:9092',
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            if len(mssg) > 0:
                message = json.loads(mssg.value)#, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
                print(mssg)
                print("Recieved Message..")
                print(data)
                data = self.extract_data(message)
                data = json.dumps(data)
                print("Information extracted")
                #Since we need to pass the message to the next API call, we
                #need to change the mssage parameters and convert mssg back from json object to string
                mssg = {"sessID": message["SessID"],
                        "userID": message["UserID"],
                        "action": "postanalysis",
                        "value": data,
                        "timeStamp": message["TimeStamp"]}
                mssg = json.dumps(mssg)
                self.publish_message(message = mssg, topic = 'modelexecution')
                print("Data sent for post analysis...")

if __name__ == '__main__':
    exe = Execution()
    print("Consumer started..")
    exe.getFilename()
