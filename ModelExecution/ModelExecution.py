from kafka import KafkaProducer, KafkaConsumer
import json
from collections import namedtuple

class ModelExecution:
    def __init__(self):
        self.topic = 'dataretrieval'
        self.producer = KafkaProducer(bootstrap_servers='kafka-service:9092')

    def publish_message(self,message, topic, key=None):
        if key:
            key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(topic, key = key, value = val)
        self.producer.flush()

    def getFilename(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'kafka-service:9092',
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            if len(mssg)>0:
                try:
                    mssg = json.loads(mssg.value, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
                    print("Recieved message:", mssg)
                    #self.postAnalysis(decodedFile)
                    #Since we need to pass the message to the next API call, we
                    #need to change the mssage parameters and convert mssg back from json object to string
                    mssg = {"sessID": mssg.sessID,
                            "userID": mssg.userID,
                            "action":"postanalysis",
                            "value": mssg.value,
                            "timeStamp": mssg.timeStamp
                            }
                    mssg = json.dumps(mssg)
                    self.publish_message(message = mssg, topic = 'modelexecution')
                    print("Displaying data...")
                except Exception as e:
                    print(e)
                    print("Data couldn't be recieved again, retry sending again..")
                    continue

if __name__ == '__main__':
    model = ModelExecution()
    print("Consumer started..")
    model.getFilename()
