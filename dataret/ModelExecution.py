import matplotlib.pyplot as plt
import pyart
import sys
from kafka import KafkaProducer, KafkaConsumer
from flask import Flask

app = Flask(__name__)


class Execution:
    def __init__(self):
        '''change this later'''
        self.topic = 'topic1' 
        self.producer = KafkaProducer(bootstrap_servers='localhost:9092')
                                    
    def publish_message(key=None, message):
        key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(self.topic, key = key, value = val)
        self.producer.flush()

    def getFilename():
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'localhost:9092', 
                                 auto_offset_reset = 'earliest')
        for mssg in consumer:
            filename = mssg
        consumer.close()
        sleep(5)
        return filename

    def Model(filename):
        assert filename == "KATX20130717_195021_V06", "Incorrect filename"
        #Add AWS path below
        path = ""+filename
        radar = pyart.io.read_nexrad_archive(path)

        display = pyart.graph.RadarDisplay(radar)
        fig = plt.figure(figsize=(10, 10))

        ax = fig.add_subplot(221)
        display.plot('velocity', 1, ax=ax, title='Doppler Velocity',
                    colorbar_label='',
                    axislabels=('', 'North South distance from radar (km)'))
        display.set_limits((-300, 300), (-300, 300), ax=ax)

        ax = fig.add_subplot(222)
        display.plot('differential_reflectivity', 0, ax=ax,
                    title='Differential Reflectivity', colorbar_label='',
                    axislabels=('', ''))
        display.set_limits((-300, 300), (-300, 300), ax=ax)

        ax = fig.add_subplot(223)
        display.plot('differential_phase', 0, ax=ax,
                    title='Differential Phase', colorbar_label='')
        display.set_limits((-300, 300), (-300, 300), ax=ax)

        ax = fig.add_subplot(224)
        display.plot('cross_correlation_ratio', 0, ax=ax,
                    title='Correlation Coefficient', colorbar_label='',
                    axislabels=('East West distance from radar (km)', ''))
        display.set_limits((-300, 300), (-300, 300), ax=ax)
        plt.savefig(filename+'.png') 




if __name__ == __main__:
    exe = Execution()
    filename = exe.getFilename()
    exe.Model(filename)
    if sys.argv[2]:
        exe.publish_message("Model_executed");    
