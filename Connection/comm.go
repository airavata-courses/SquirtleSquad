package main

import (
	"fmt"
	"github.com/Shopify/sarama"
)

func main() {

	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 10
	//brokers := []string{"0.0.0.0:9092"}
	brokers := []string{"localhost:9092"}
	producer, err := sarama.NewSyncProducer(brokers, config)
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := producer.Close(); err != nil {
			panic(err)
		}
	}()

	topic := "test"
	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder("Connection has been made"),
	}

	partition, offset, err := producer.SendMessage(msg)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Message has been stored in topic(%s)/partition(%d)/offset(%d)\n", topic, partition, offset)
}