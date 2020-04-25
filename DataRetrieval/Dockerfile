FROM python:3
ADD . /DataRetrieval
RUN pip3 install darksky_weather 
RUN pip install kafka-python
WORKDIR /DataRetrieval
EXPOSE 8083
ENV PYTHONUNBUFFERED=1
CMD ["python", "dataretrieval.py"]
