'''
This code has been referred from https://github.com/ARM-DOE/pyart/tree/master/examples.
The files available for upload have been taken from https://engineering.arm.gov/~jhelmus/pyart_example_data/
I would also like to cite PyART module used in this project: 'JJ Helmus and SM Collis, JORS 2016, doi: 10.5334/jors.119'


Author: Anurag Kumar
'''
import matplotlib.pyplot as plt
import pyart
import sys
from kafka import KafkaProducer, KafkaConsumer
from flask import Flask

app = Flask(__name__)


class Execution:
    def __init__(self):
        self.topic = 'DataRetrieval' 
        self.producer = KafkaProducer(bootstrap_servers='localhost:9092')
                                    
    def publish_message(self, message, topic, key=None):
        if key:
            key = bytes(key, encoding = 'utf-8')
        val = bytes(message, encoding= 'utf-8')
        self.producer.send(topic, key = key, value = val)
        self.producer.flush()

    def getFilename(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'localhost:9092', 
                                 group_id=None)
        print("Consumer running..")
        for mssg in consumer:
            filename = mssg
            decodedFile = filename.value.decode('utf-8')
            print("Recieved filename:", decodedFile)
            imageFilename=""
            if decodedFile == "KATX20130717_195021_V06":
                imageFilename = self.Model1(filename.value.decode('utf-8'))
            if decodedFile == "Level2_KATX_20130717_1950.ar2v":
                imageFilename = self.Model2(filename.value.decode('utf-8'))
            self.publish_message(message = imageFilename, topic = 'modelexecution')
            print("File has published from ModelExecution..")
        return filename

    def Model1(self, filename):
        #Check to make sure this model gets the right file.
        assert filename == "KATX20130717_195021_V06", "Incorrect filename"
        #Path to where the file is downloaded.
        path = "../Data/"
        
        radar = pyart.io.read_nexrad_archive(path + filename)

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
        plt.savefig(path + filename+'_multiplot.png')
        return filename+'_multiplot.png'

    def Model2(self, filename):
        #Check to make sure this model gets the right file.
        assert filename == "Level2_KATX_20130717_1950.ar2v", "Incorrect filename"
        #Path to where the file is downloaded.
        path = "../Data/"
        
        # open the file, create the displays and figure
        radar = pyart.io.read_nexrad_archive(path + filename)
        display = pyart.graph.RadarDisplay(radar)
        fig = plt.figure(figsize=(6, 5))

        # plot super resolution reflectivity
        ax = fig.add_subplot(111)
        display.plot('reflectivity', 0, title='NEXRAD Reflectivity',
                    vmin=-32, vmax=64, colorbar_label='', ax=ax)
        display.plot_range_ring(radar.range['data'][-1]/1000., ax=ax)
        display.set_limits(xlim=(-500, 500), ylim=(-500, 500), ax=ax)
        plt.savefig(path + filename+'_reflectivity.png')
        return filename+'_reflectivity.png'




if __name__ == '__main__':
    exe = Execution()
    print("Consumer started..")
    exe.getFilename()
          
