from kafka import KafkaProducer, KafkaConsumer
from darksky.api import DarkSky, DarkSkyAsync
from darksky.types import languages, units, weather
import json
# new additions packages to be installed on docker and kubernetes
import requests


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
        try:
            responseDark = requests.get("https://api.darksky.net/forecast/68a391b503f11aa6fa13d405bfefdaba/10,-10")
            darksky = DarkSky("68a391b503f11aa6fa13d405bfefdaba")
            latitude = message['latitude']
            longitude = message['longitude']

            forecast = darksky.get_forecast(
                latitude, longitude,
                extend=False,
                lang=languages.ENGLISH,
                values_units=units.AUTO,
                exclude=[weather.MINUTELY, weather.ALERTS],
                timezone='UTC'
            )
            current = forecast.currently
            mssg = {'summary':current.summary,
                    'windSpeed':current.wind_speed,
                    'humidity':current.humidity,
                    'temperature':current.temperature}
            return mssg

        except Exception as e:
            print(e)
            mssg = {'summary':'overcast',
                    'windSpeed':12,
                    'humidity':78,
                    'temperature':42}
            print(mssg)
            return mssg

        

    def getData(self):
        consumer = KafkaConsumer(self.topic,
                                 bootstrap_servers = 'kafka-service:9092',
                                 group_id=None)
        print("Consumer running..DR")
        for mssg in consumer:
            if len(mssg) > 0:
                #try:
                    message = json.loads(mssg.value)
                    print("Recieved Message:", message)
                    data = json.loads(message['value'])
                    data = self.extract_data(data)
                    data = json.dumps(data)
                    print("Information extracted")
                    #Since we need to pass the message to the next API call, we
                    #need to change the mssage parameters and convert mssg back from json object to string
                    mssg = {"sessID": message["sessID"],
                            "userID": message["userID"],
                            "action": "modelexecution",
                            "value": data,
                            "timeStamp": message["timeStamp"]}
                    mssg = json.dumps(mssg)
                    self.publish_message(message = mssg, topic = 'dataretrieval')
                    print("Data sent for model execution...")
                #except Exception as e:
                #    print(e)
                #    print("Data couldn't be recieved again, retry sending again..")
                #    continue


if __name__ == "__main__":
    print("Starting Data Retrieval Service")
    DATARET = DataRetrieval()
    print("Consumer started..")
    DATARET.getData()
    #values = { 'latitude' : 23 , 'longitude' : 32 }
    #DATARET.extract_data(message=values)
