// api_gateway_parser
package main

import (
	"fmt"
	"sync"
)

type addRequest struct {
	V int `json:"v"`
}

func (r addRequest) String() string {
	return fmt.Sprintf("%d", r.V)
}

type addResponse struct {
	V int `json:"v"`
}

func (r addResponse) String() string {
	return fmt.Sprintf("%d", r.V)
}

type Counter interface {
	Add(int) int
}

type countService struct {
	v int32
	m sync.Mutex
}

func (c *countService) Add(v int) int {
	c.m.Lock()
	defer Println("working!")
	defer c.m.Unlock()
	c.v += v
	return c.v
}
