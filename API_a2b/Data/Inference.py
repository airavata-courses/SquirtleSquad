from matplotlib import image 
import pyart
import sys
from kafka import KafkaProducer, KafkaConsumer

class Inference:
    def __init__(self):
        self.topic = 'topic2' '''change this later'''
        self.producer = KafkaProducer(bootstrap_servers='localhost:9092')
                                       
    def publish_message(key=None, message):
        key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(self.topic, key = key, value = val)
        self.producer.flush()

    def getFlag():
        self.consumer = KafkaConsumer('topic1',
                                  bootstrap_servers = 'localhost:9092', 
                                  auto_offset_reset = 'earliest')

        for flag in self.consumer:
            command = mssg
        consumer.close()
        sleep(5)
        return command

if __name__ == '__main__':
    inf = Inference()
    if(inf.getFlag()):
        data = image.imread('Data/test_fig.png')
        inf.publish_message(data)

    