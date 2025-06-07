package models
import "time"

// Subscription (subscriptions table)
type Subscription struct {
	ID                   int        `json:"id" orm:"auto;pk;column(id)"`
	TargetID             string     `json:"targetId" orm:"column(target_id);type(varchar)"`
	Plan                 string     `json:"plan" orm:"size(20);type(varchar)"`
	Recurring            string     `json:"recurring" orm:"size(20);type(varchar)"`
	Variant              *string    `json:"variant,omitempty" orm:"null;size(20);type(varchar)"`
	Quantity             int        `json:"quantity" orm:"default(1)"`
	StripeSubscriptionID *string    `json:"stripeSubscriptionId,omitempty" orm:"null;unique;column(stripe_subscription_id);type(varchar)"`
	StripeScheduleID     *string    `json:"stripeScheduleId,omitempty" orm:"null;column(stripe_schedule_id);type(varchar)"`
	Status               string     `json:"status" orm:"size(20);type(varchar)"`
	Start                time.Time  `json:"start" orm:"column(start);type(timestamp with time zone)"` // Prisma uses 'start'
	End                  *time.Time `json:"end,omitempty" orm:"null;column(end);type(timestamp with time zone)"`   // Prisma uses 'end'
	NextBillAt           *time.Time `json:"nextBillAt,omitempty" orm:"null;column(next_bill_at);type(timestamp with time zone)"`
	CanceledAt           *time.Time `json:"canceledAt,omitempty" orm:"null;column(canceled_at);type(timestamp with time zone)"`
	TrialStart           *time.Time `json:"trialStart,omitempty" orm:"null;column(trial_start);type(timestamp with time zone)"`
	TrialEnd             *time.Time `json:"trialEnd,omitempty" orm:"null;column(trial_end);type(timestamp with time zone)"`
	CreatedAt            time.Time  `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt            time.Time  `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"`
}

// Invoice (invoices table)
type Invoice struct {
	StripeInvoiceID           string     `json:"stripeInvoiceId" orm:"pk;column(stripe_invoice_id);type(varchar)"`
	TargetID                  string     `json:"targetId" orm:"column(target_id);type(varchar)"`
	Currency                  string     `json:"currency" orm:"size(3);type(varchar)"`
	Amount                    int        `json:"amount"`
	Status                    string     `json:"status" orm:"size(20);type(varchar)"`
	Reason                    *string    `json:"reason,omitempty" orm:"null;type(varchar)"`
	Link                      *string    `json:"link,omitempty" orm:"null;type(text)"`
	OnetimeSubscriptionRedeemed bool      `json:"onetimeSubscriptionRedeemed" orm:"default(false);column(onetime_subscription_redeemed)"`
	CreatedAt                 time.Time  `json:"createdAt" orm:"auto_now_add;column(created_at);type(timestamp with time zone)"`
	UpdatedAt                 time.Time  `json:"updatedAt" orm:"auto_now;column(updated_at);type(timestamp with time zone)"`
	LastPaymentError          *string    `json:"lastPaymentError,omitempty" orm:"null;column(last_payment_error);type(text)"`
}
