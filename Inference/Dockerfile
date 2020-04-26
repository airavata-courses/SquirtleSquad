FROM python:3
ADD . /Inference
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
RUN pip install kafka-python
RUN pip install matplotlib
WORKDIR /Inference
ENV PYTHONUNBUFFERED=1
CMD ["python", "Inference.py"]

