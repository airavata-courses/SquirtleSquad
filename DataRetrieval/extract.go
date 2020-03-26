package main

import (
    "fmt"
    forecast "github.com/mlbright/darksky/v2"
    "log"
    "strings"
)

func main() {

    test = "68a391b503f11aa6fa13d405bfefdaba"
    key := string(test)
    key = strings.TrimSpace(key)

    lat := "43.6595"
    long := "-79.3433"

    file, err := forecast.Get(key, lat, long, "now", forecast.CA, forecast.English)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("%s: %s\n", file.Timezone, file.Currently.Summary)
    fmt.Printf("humidity: %.2f\n", file.Currently.Humidity)
    fmt.Printf("temperature: %.2f Celsius\n", file.Currently.Temperature)
    fmt.Printf("wind speed: %.2f\n", file.Currently.WindSpeed)

}
