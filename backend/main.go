package main

import (
	"StockPaperTradingApp/db"
	"StockPaperTradingApp/middlewares"
	"StockPaperTradingApp/routes"
	"os"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	//  https://pkg.go.dev/github.com/robfig/cron#hdr-Usage
)

func main() {
	server := gin.Default()
	db.ConnectToDB()
	server.Use(middlewares.CORSMiddleware())

	// updates networth for all user at 4:30:00 everyday
	// c := cron.New()
	// c.AddFunc("0 30 4 * * *", controllers.Helper().UpdateNetworths)
	// c.Start()

	auth := server.Group("/auth")
	{
		auth.POST("/register", routes.RegisterEndpoint)
		auth.POST("/login", routes.LoginEnpdpoint)
		auth.GET("/loginAuthToken", middlewares.Authentication, routes.LoginWithTokenEnpdpoint)
	}

	holdings := server.Group("/holdings").Use(middlewares.Authentication)
	{
		holdings.POST("/", routes.CreateHoldingsEndpoint)
		holdings.GET("/", routes.GetAllHoldingsEndpoint)
		holdings.GET("/:id", routes.GetHoldingsEndpoint)
		holdings.PATCH("/:id", routes.UpdateHoldingsEndpoint)
		holdings.DELETE("/:id", routes.DeleteHoldingsEndpoint)
	}

	activity := server.Group("/activity").Use(middlewares.Authentication)
	{
		activity.POST("/", routes.CreateActivityEndpoint)
		activity.GET("/", routes.GetAllActivityEndpoint)
		activity.GET("/:id", routes.GetActivityEndpoint)
	}

	finance := server.Group("/finance").Use(middlewares.Authentication)
	{
		finance.GET("/autocomplete", routes.AutoCompleteEndpoint)
		finance.GET("/trending", routes.TrendingEndpoint)
		finance.GET("/dashboard", routes.DashBoardEndpoint)
		finance.GET("/stock", routes.StockInformationEndpoint)
		finance.GET("/stockPage", routes.StockPageInformationEndpoint)
	}

	api := server.Group("/api").Use(middlewares.Authentication)
	{
		api.POST("/buyStock", routes.BuyStockEndpoint)
		api.POST("/sellStock", routes.SellStockEndpoint)
		api.GET("/getAllData", routes.GetAllDataEndpoint)
	}

	server.Use(static.Serve("/", static.LocalFile("./build", true)))
	port := os.Getenv("PORT")
	if port == "" {
		println("listening to port: 8080")
		server.Run(":8080")
	} else {
		println("listening to port: " + port)
		server.Run(":" + port)
	}
}
