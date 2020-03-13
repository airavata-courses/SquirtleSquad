FROM python:3

ADD . /Inference

RUN pip install kafka-python

RUN pip install matplotlib

WORKDIR /Inference

CMD ["python", "Inference.py"]

