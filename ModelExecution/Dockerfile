FROM python:3

ADD . /ModelExecution

RUN wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh && \
    chmod +x Miniconda-latest-Linux-x86_64.sh && \
    ./Miniconda-latest-Linux-x86_64.sh && \
    export PATH=~/miniconda/bin:$PATH && \
    conda install -c conda-forge arm_pyart && \
    conda install -c conda-forge matplotlib && \
    pip install kafka-python && \
	

WORKDIR /ModelExecution

CMD ["python", "ModelExecution.py"]
