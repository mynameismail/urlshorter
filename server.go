package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Profile struct
type Profile struct {
	Name    string   `json:"name"`
	Age     int      `json:"age"`
	Hobbies []string `json:"hobbies"`
}

func customMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		if age := c.QueryParam("age"); age == "" {
			return c.String(http.StatusBadRequest, "Missing parameter age")
		}

		return next(c)
	}
}

func hello(c echo.Context) error {
	name := c.Param("name")
	age := c.QueryParam("age")
	result := "Hello " + name + " " + age + " y.o.!"
	return c.String(http.StatusOK, result)
}

func main() {
	e := echo.New()
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "[${time_rfc3339_nano}] ${remote_ip} ${method} ${uri} ${status} ${user_agent}\n",
	}))
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello World!")
	})
	e.GET("/hello/:name", customMiddleware(hello))
	e.Logger.Fatal(e.Start(":1323"))
}
