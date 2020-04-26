FROM python:3
ADD . /DataRetrieval
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
ADD https://github.com/bitpixdigital/forecastiopy3 /forecastiopy3
RUN chmod +x /forecastiopy3
CMD ['python','forecastiopy3/setup.py', 'install']  
RUN pip install kafka-python
WORKDIR /DataRetrieval
CMD ["python", "dataretrieval.py"]
