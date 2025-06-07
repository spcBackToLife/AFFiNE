// packages/backend/server-go/services/supabase_client.go
package services

import (
	"fmt"
	"sync"

	"github.com/beego/beego/v2/server/web"
	"github.com/supabase-community/gotrue-go"
)

var (
	supabaseAuthClient *gotrue.Client
	onceAuth           sync.Once
)

// GetSupabaseAuthClient initializes and returns a Supabase GoTrue client.
func GetSupabaseAuthClient() (*gotrue.Client, error) {
	var initErr error
	onceAuth.Do(func() {
		supabaseURL, err := web.AppConfig.String("SUPABASE_URL")
		if err != nil {
			initErr = fmt.Errorf("error reading SUPABASE_URL from config: %w", err)
			return
		}
		supabaseAnonKey, err := web.AppConfig.String("SUPABASE_ANON_KEY")
		if err != nil {
			initErr = fmt.Errorf("error reading SUPABASE_ANON_KEY from config: %w", err)
			return
		}

		if supabaseURL == "" {
			initErr = fmt.Errorf("SUPABASE_URL is not configured")
            return
        }
        if supabaseAnonKey == "" {
            initErr = fmt.Errorf("SUPABASE_ANON_KEY is not configured")
            return
        }

		client := gotrue.New(supabaseURL, supabaseAnonKey)
		supabaseAuthClient = &client
	})
    if initErr != nil {
        return nil, initErr
    }
	if supabaseAuthClient == nil && initErr == nil { // Should not happen if once.Do executed without error
        return nil, fmt.Errorf("supabase client initialization failed without explicit error")
    }
	return supabaseAuthClient, nil
}
