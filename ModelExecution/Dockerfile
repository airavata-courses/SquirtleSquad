FROM continuumio/miniconda3

ADD . /ModelExecution

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

RUN conda install -c conda-forge arm_pyart

RUN conda install -c conda-forge matplotlib

RUN pip install kafka-python
	
WORKDIR /ModelExecution

CMD ["python", "ModelExecution.py"]
