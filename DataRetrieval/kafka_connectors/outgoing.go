package main

import (
    "fmt"
		"github.com/Shopify/sarama"
	)

var brokers = []string{"127.0.0.1:9092"} // Change to localhost depending on OS, windows refer to this string format--> "localhost:9092"

func newProducer() (sarama.SyncProducer, error) {
	config := sarama.NewConfig()
	config.Producer.Partitioner = sarama.NewRandomPartitioner
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Return.Successes = true // The Successes must return true for the producer to generate values onto the Topic
	producer, err := sarama.NewSyncProducer(brokers, config)

	return producer, err
}

func prepareMessage(topic, message string) *sarama.ProducerMessage {
	msg := &sarama.ProducerMessage{
		Topic:     topic,
		Partition: -3,
		Value:     sarama.StringEncoder(message),
	}

	return msg
}


func main() {

	config := sarama.NewConfig()
	config.Producer.Partitioner = sarama.NewRandomPartitioner
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5
	config.Producer.Return.Successes = true

	// brokers := []string{"192.168.59.103:9092"}
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
  message := []string{"KATX20130717_195021_V06"}
	topic := "DataRetrieval"
	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder("KATX20130717_195021_V06"), // Replace with a string object before production
	}
  for i := 0; i < 10; i++ {
		if err != nil {
			panic(err)  // Checks for the err returned by NewSyncProducer
		}
	}
  partition, offset, err := producer.SendMessage(msg)
	if err != nil {
		panic(err)
	}

	fmt.Printf("The message : \"(%s)\" has been handed over to the topic (%s)/partition(%d)/offset(%d)\n", message , topic, partition, offset)
}
