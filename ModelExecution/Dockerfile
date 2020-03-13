FROM continuumio/miniconda3

ADD . /ModelExecution

RUN conda install -c conda-forge arm_pyart

RUN conda install -c conda-forge matplotlib

RUN pip install kafka-python
	
WORKDIR /ModelExecution

CMD ["python", "ModelExecution.py"]
