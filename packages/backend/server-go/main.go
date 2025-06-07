package main

import (
	"fmt"
	"os"

	"app/server-go/models" // Add this import
	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/lib/pq" // PostgreSQL driver
	_ "app/server-go/routers" // Placeholder for routers - YOUR_MODULE_PATH replaced with app/server-go
)

func main() {
	// Load config
	dbHost, _ := beego.AppConfig.String("DB_HOST")
	dbPort, _ := beego.AppConfig.String("DB_PORT")
	dbUser, _ := beego.AppConfig.String("DB_USER")
	dbPassword, _ := beego.AppConfig.String("DB_PASSWORD")
	dbName, _ := beego.AppConfig.String("DB_NAME")
	dbSSLMode, _ := beego.AppConfig.String("DB_SSLMODE")

	fmt.Println("Attempting to connect to database with the following (partial) config:")
	fmt.Printf("Host: %s, Port: %s, User: %s, DBName: %s, SSLMode: %s\n", dbHost, dbPort, dbUser, dbName, dbSSLMode)

    // Construct connection string
    // Example: "host=your_host port=your_port user=your_user password=your_password dbname=your_db sslmode=require"
    connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
        dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	// Register database driver
	// The alias "default" is used for the default database connection.
	err := orm.RegisterDriver("postgres", orm.DRPostgres)
	if err != nil {
		fmt.Printf("Failed to register driver: %v\n", err)
        os.Exit(1)
	}

    // Register database alias
    // IMPORTANT: Actual connection attempt happens when ORM operations are performed.
    // This line just registers the alias and connection string.
	err = orm.RegisterDataBase("default", "postgres", connStr)
	if err != nil {
		fmt.Printf("Failed to register database: %v\n", err)
        os.Exit(1)
	} else {
        fmt.Println("Database registered successfully.")
    }
    orm.RegisterModel(new(models.Workspace)) // Register Workspace model

    // Optional: Enable ORM debugging if in dev mode
    runMode, _ := beego.AppConfig.String("runmode")
    if runMode == "dev" {
        orm.Debug = true
    }

	// Placeholder for a simple route
	beego.Get("/", func(ctx *beego.Context) {
		ctx.WriteString("Hello from Beego on Go (New Backend)!")
	})

    supabaseURL, _ := beego.AppConfig.String("SUPABASE_URL")
    fmt.Printf("Supabase URL from config: %s\n", supabaseURL)

    httpPort, _ := beego.AppConfig.Int("httpport")
	fmt.Printf("Starting Beego server on port %d\n", httpPort)
	beego.Run()
}
