from matplotlib import image 
import matplotlib.pyplot as plt
#import pyart
import sys
from kafka import KafkaProducer, KafkaConsumer

class Inference:
    def __init__(self):
        #Change the below topic accordingly...
        self.topic = 'modelexecution' 
        self.producer = KafkaProducer(bootstrap_servers='localhost:9092')
                                       
    def publish_message(self,message, topic, key=None):
        key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(topic, key = key, value = val)
        self.producer.flush()

    def postAnalysis(self, filename):
        path = '../Data/'
        img = image.imread(path + filename)
        plt.imshow(img)
        print("Image recieved and posted...")

    def getFilename(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'localhost:9092', 
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            filename = mssg
            self.postAnalysis(filename.value.decode('utf-8'))
        return command

    

if __name__ == '__main__':
    inf = Inference()
    print("Consumer started..")
    inf.getFilename()

    