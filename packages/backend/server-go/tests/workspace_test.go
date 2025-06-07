// packages/backend/server-go/tests/workspace_test.go
package tests

import (
	"app/server-go/models"
	_ "app/server-go/routers" // Import to initialize routers
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/lib/pq"
)

// TestMain sets up the test environment
func TestMain(m *testing.M) {
	// It's crucial to set this path correctly if your conf files are not in default locations
	// relative to where the test binary runs. Beego might look for `conf/app.conf`.
	// If running `go test` from `packages/backend/server-go`, it should find `conf/app.conf`.
	// Explicitly setting conf path if needed:
	// confPath := path.Join(os.Getenv("GOPATH"), "src", "app/server-go", "conf", "app.conf")
	// web.TestBeegoInit(confPath) // Alternative way to initialize for testing if defaults don't work

	beego.BConfig.RunMode = "test" // Set Beego to test mode

	// Initialize Beego application configuration (reads app.conf)
	// This is often done automatically if routers are imported and Beego app starts,
	// but explicit init can be more reliable in tests.
	// beego.LoadAppConfig("ini", "../conf/app.conf") // Adjust path if running test from /tests directory


	// Database Configuration (from environment variables, similar to main.go)
	// These should ideally match how your main.go loads them for consistency.
	// For tests, you might override them or point to a specific test DB.
	dbHost := os.Getenv("DB_HOST_TEST")
	if dbHost == "" { dbHost = os.Getenv("DB_HOST"); if dbHost == "" { dbHost = "127.0.0.1" } }
	dbPort := os.Getenv("DB_PORT_TEST")
	if dbPort == "" { dbPort = os.Getenv("DB_PORT"); if dbPort == "" { dbPort = "5432" } }
	dbUser := os.Getenv("DB_USER_TEST")
	if dbUser == "" { dbUser = os.Getenv("DB_USER"); if dbUser == "" { dbUser = "postgres" } }
	dbPassword := os.Getenv("DB_PASSWORD_TEST")
	if dbPassword == "" { dbPassword = os.Getenv("DB_PASSWORD"); if dbPassword == "" { dbPassword = "secret"} } // Provide a default test password
	dbName := os.Getenv("DB_NAME_TEST")
	if dbName == "" { dbName = os.Getenv("DB_NAME"); if dbName == "" { dbName = "postgres_test"} } // IMPORTANT: Use a dedicated test database
	dbSSLMode := os.Getenv("DB_SSLMODE_TEST")
	if dbSSLMode == "" { dbSSLMode = os.Getenv("DB_SSLMODE"); if dbSSLMode == "" { dbSSLMode = "disable"} }


	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	orm.RegisterDriver("postgres", orm.DRPostgres)
	err := orm.RegisterDataBase("default", "postgres", connStr)
	if err != nil {
		fmt.Println("Failed to register database for test:", err)
		os.Exit(1)
	}
	orm.RegisterModel(new(models.Workspace))

	// Routers are initialized by importing `_ "app/server-go/routers"` which calls init() in router.go

	// Optional: Create schema if it does not exist.
	// WARNING: This can be destructive. Best to have a separate, managed test DB.
	// orm.RunSyncdb("default", false, true) // false: don't force drop, true: verbose output

	// Ensure BeeApp is initialized for ServeHTTP
    if beego.BeeApp == nil {
        beego.BeeApp = beego.NewApp() // Basic initialization
		beego.BeeApp.Handlers = beego.NewControllerRegister() // Crucial for routing
		beego.SetStaticPath("/static", "static") // Example static path if needed
		// Initialize routers again if BeeApp was manually created,
		// though importing routers package should handle this.
		// The import _ "app/server-go/routers" should suffice if it adds to global BeeApp.
    }


	exitCode := m.Run()
	os.Exit(exitCode)
}

// Helper to clear workspaces table
func clearWorkspacesTable() {
	o := orm.NewOrm()
	// Using QueryTable to delete to be more ORM-idiomatic, though RAW is fine too.
	// This deletes all records from the 'workspaces' table.
	if _, err := o.QueryTable(new(models.Workspace)).Filter("id__isnull", false).Delete(); err != nil {
		// If filter is not needed: o.QueryTable(new(models.Workspace)).Delete() though this might be ORM specific.
		// Raw is often safer for complete clears if QueryTable().Delete() has issues without filters.
		// Let's use Raw for simplicity and certainty of clearing.
		_, err := o.Raw("DELETE FROM workspaces").Exec()
		if err != nil {
			// It's a test helper, so fatal is okay.
			fmt.Printf("Failed to clear workspaces table: %v\n", err)
		}
	}
}


// TestCreateWorkspace tests the POST /v1/workspaces endpoint
func TestCreateWorkspace(t *testing.T) {
	clearWorkspacesTable()

	payload := map[string]interface{}{
		"name":   "Test Workspace Create",
		"public": true,
	}
	jsonPayload, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", "/v1/workspaces/", bytes.NewBuffer(jsonPayload))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
		t.Errorf("response body: %s", rr.Body.String())
		return
	}

	var createdWorkspace models.Workspace
	if err := json.Unmarshal(rr.Body.Bytes(), &createdWorkspace); err != nil {
		t.Fatalf("Could not parse response body: %v", err)
	}

	if createdWorkspace.ID == "" {
		t.Errorf("Expected workspace ID to be set, got empty")
	}
	if createdWorkspace.Name == nil || *createdWorkspace.Name != "Test Workspace Create" {
		t.Errorf("Expected workspace name to be '%s', got '%v'", "Test Workspace Create", createdWorkspace.Name)
	}
	if !createdWorkspace.Public {
		 t.Errorf("Expected workspace public to be true, got false")
	}

	o := orm.NewOrm()
	dbWs := models.Workspace{ID: createdWorkspace.ID}
	if err := o.Read(&dbWs); err != nil {
		t.Errorf("Could not find created workspace in DB: %v. ID used: %s", err, createdWorkspace.ID)
	} else {
        if dbWs.SID == 0 { // SID is SERIAL, should not be 0 after insert
            t.Errorf("Expected SID to be populated in DB, got 0")
        }
    }
}

// TestGetWorkspaceByID tests GET /v1/workspaces/{id}
func TestGetWorkspaceByID(t *testing.T) {
	clearWorkspacesTable()
	o := orm.NewOrm()

	testName := "Workspace For Get"
	// ID is generated by DB, SID is also by DB. CreatedAt by ORM/DB.
	ws := models.Workspace{Name: &testName, Public: true}
	_, err := o.Insert(&ws) // ws.ID and ws.SID should be populated by this
	if err != nil {
		t.Fatalf("Failed to create workspace for test setup: %v", err)
	}
	if ws.ID == "" {
		t.Fatalf("Workspace ID was not populated after insert for test setup.")
	}


	req, _ := http.NewRequest("GET", "/v1/workspaces/"+ws.ID, nil)
	rr := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v. Body: %s", status, http.StatusOK, rr.Body.String())
		return
	}

	var fetchedWs models.Workspace
	if err := json.Unmarshal(rr.Body.Bytes(), &fetchedWs); err != nil {
		t.Fatalf("Could not parse response body: %v", err)
	}
	if fetchedWs.ID != ws.ID {
		t.Errorf("Expected workspace ID %s, got %s", ws.ID, fetchedWs.ID)
	}
	if fetchedWs.Name == nil || *fetchedWs.Name != testName {
		t.Errorf("Expected workspace name '%s', got '%v'", testName, fetchedWs.Name)
	}

	reqNotFound, _ := http.NewRequest("GET", "/v1/workspaces/nonexistent-uuid", nil)
	rrNotFound := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rrNotFound, reqNotFound)
	if status := rrNotFound.Code; status != http.StatusNotFound {
		t.Errorf("handler returned wrong status code for non-existent ID: got %v want %v", status, http.StatusNotFound)
	}
}

// TestGetAllWorkspaces tests GET /v1/workspaces
func TestGetAllWorkspaces(t *testing.T) {
	clearWorkspacesTable()
	o := orm.NewOrm()

	wsName1 := "WS1"; wsName2 := "WS2"
	ws1 := models.Workspace{Name: &wsName1, Public: false, CreatedAt: time.Now()} // CreatedAt will be overridden by auto_now_add
	ws2 := models.Workspace{Name: &wsName2, Public: true, CreatedAt: time.Now()}
	if _, err := o.Insert(&ws1); err != nil { t.Fatalf("Failed to insert ws1: %v", err) }
	if _, err := o.Insert(&ws2); err != nil { t.Fatalf("Failed to insert ws2: %v", err) }


	req, _ := http.NewRequest("GET", "/v1/workspaces/", nil)
	rr := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v. Body: %s", status, http.StatusOK, rr.Body.String())
		return
	}

	var workspaces []models.Workspace
	if err := json.Unmarshal(rr.Body.Bytes(), &workspaces); err != nil {
		t.Fatalf("Could not parse response body: %v", err)
	}
	if len(workspaces) != 2 {
		t.Errorf("Expected 2 workspaces, got %d. Body: %s", len(workspaces), rr.Body.String())
	}
}

// TestUpdateWorkspace tests PUT /v1/workspaces/{id}
func TestUpdateWorkspace(t *testing.T) {
	clearWorkspacesTable()
	o := orm.NewOrm()

	initialName := "Initial Update Name"
	ws := models.Workspace{Name: &initialName, Public: false}
	_, err := o.Insert(&ws)
	if err != nil { t.Fatalf("Setup failed: %v", err) }
	if ws.ID == "" { t.Fatalf("Workspace ID not populated after insert for test setup.")}


	updatedName := "Updated Workspace Name"
	updatePayload := map[string]interface{}{"name": updatedName, "public": true}
	jsonPayload, _ := json.Marshal(updatePayload)

	req, _ := http.NewRequest("PUT", "/v1/workspaces/"+ws.ID, bytes.NewBuffer(jsonPayload))
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v. Body: %s", status, http.StatusOK, rr.Body.String())
		return
	}

	var updatedWs models.Workspace
	if err := json.Unmarshal(rr.Body.Bytes(), &updatedWs); err != nil {
		t.Fatalf("Could not parse response: %v", err)
	}
	if updatedWs.Name == nil || *updatedWs.Name != updatedName {
		t.Errorf("Expected updated name to be '%s', got '%v'", updatedName, updatedWs.Name)
	}
	if !updatedWs.Public {
		t.Errorf("Expected updated public to be true, got false")
	}
}

// TestDeleteWorkspace tests DELETE /v1/workspaces/{id}
func TestDeleteWorkspace(t *testing.T) {
	clearWorkspacesTable()
	o := orm.NewOrm()

	wsName := "To Be Deleted"
	ws := models.Workspace{Name: &wsName, Public: true}
	_, err := o.Insert(&ws)
	if err != nil { t.Fatalf("Setup failed: %v", err) }
	if ws.ID == "" { t.Fatalf("Workspace ID not populated for test setup.")}


	req, _ := http.NewRequest("DELETE", "/v1/workspaces/"+ws.ID, nil)
	rr := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v. Body: %s", status, http.StatusOK, rr.Body.String())
		return
	}

	// Verify in DB
	checkWs := models.Workspace{ID: ws.ID}
	err = o.Read(&checkWs) // Attempt to read the deleted workspace
	if err == nil { // If err is nil, it means record was found
		t.Errorf("Expected workspace to be deleted from DB, but it was found.")
	} else if err != orm.ErrNoRows { // If error is something other than ErrNoRows
		t.Errorf("Error checking for deleted workspace: %v", err)
	}

	// Test Not Found on delete
	reqNotFound, _ := http.NewRequest("DELETE", "/v1/workspaces/nonexistent-uuid-for-delete", nil)
	rrNotFound := httptest.NewRecorder()
	beego.BeeApp.Handlers.ServeHTTP(rrNotFound, reqNotFound)
	if status := rrNotFound.Code; status != http.StatusNotFound {
		t.Errorf("handler returned wrong status code for non-existent ID on delete: got %v want %v. Body: %s", status, rrNotFound.Code, rrNotFound.Body.String())
	}
}
