# We specify the base image we need for our
# go application
FROM golang:latest
# We create an /app directory within our
# image that will hold our application source
# files
RUN mkdir /app

#Server setup from Session management
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

# We copy everything in the root directory
# into our /app directory
ADD . /app
# We specify that we now wish to execute
# any further commands inside our /app
# directory
WORKDIR /app
# we run go build to compile the binary
# executable of our Go program
RUN go get github.com/go-kit/kit/log
RUN go get github.com/go-kit/kit/metrics/prometheus
RUN go get github.com/go-kit/kit/transport/http
RUN go get github.com/Shopify/sarama
RUN go get github.com/mlbright/darksky/v2

RUN go build -o connector .

# Our start command which kicks off
# our newly created binary executable
CMD ["/app/connector"]
