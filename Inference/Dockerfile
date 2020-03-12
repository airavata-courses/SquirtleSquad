FROM python:3

ADD . /Inference

RUN pip install kafka-python

WORKDIR /Inference

CMD ["python", "Inference.py"]

