from kafka import KafkaProducer, KafkaConsumer
import sys
import os
from forecastiopy import *


class DataRetrieval:
    def __init__(self):
        self.topic = 'apigateway'
        self.producer = KafkaProducer(bootstrap_servers='kafka-service:9092')

    def publish_message(self, message, topic, key=None):
        if key:
            key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(topic, key = key, value = val)
        self.producer.flush()

    def extract_data(self, message):
        latitude = message['latitiude']
        longitude = message['longitude']
        fio = ForecastIO.ForecastIO("68a391b503f11aa6fa13d405bfefdaba", latitude=latitude, longitude=longitude)
        current = FIOCurrently.FIOCurrently(fio)
        mssg = {'summary':current.summary, 
                'windSpeed':current.windSpeed,
                'humidity':current.humidity,
                'temperature':current.temperature}
        return mssg

    def getData(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'kafka-service:9092',
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            if len(mssg) > 0:
                try:
                    message = json.loads(mssg.value)
                    print("Recieved Message..")
                    data = self.extract_data(message)
                    data = json.dumps(data)
                    print("Information extracted")
                    #Since we need to pass the message to the next API call, we
                    #need to change the mssage parameters and convert mssg back from json object to string
                    mssg = {"sessID": message["SessID"],
                            "userID": message["UserID"],
                            "action": "modelexecution",
                            "value": data,
                            "timeStamp": message["timeStamp"]}
                    mssg = json.dumps(mssg)
                    self.publish_message(message = mssg, topic = 'modelexecution')
                    print("Data sent for model execution...")
                except Exception as e:
                    print(e)
                    print("Data couldn't be recieved again, retry sending again..")
                    continue


if __name__ == "__main__":
    DATARET = DataRetrieval()
    print("Consumer started..")
    DATARET.getData()

