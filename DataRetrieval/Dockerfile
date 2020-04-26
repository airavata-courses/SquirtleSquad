FROM python:3
ADD . /DataRetrieval
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
RUN pip3 install darksky_weather 
RUN pip install kafka-python
WORKDIR /DataRetrieval
CMD ["python", "dataretrieval.py"]
