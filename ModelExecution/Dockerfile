FROM python:3
ADD . /ModelExecution
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
RUN pip install kafka-python
WORKDIR /ModelExecution
CMD ["python", "ModelExecution.py"]
