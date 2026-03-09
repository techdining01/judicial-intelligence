"""
SaaS Platform Models
Law firm accounts, billing, subscriptions, and audit logs
"""

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class LawFirm(models.Model):
    """Law firm organization model"""
    
    PLAN_CHOICES = (
        ('STARTER', 'Starter'),
        ('PROFESSIONAL', 'Professional'),
        ('ENTERPRISE', 'Enterprise'),
        ('CUSTOM', 'Custom'),
    )
    
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('SUSPENDED', 'Suspended'),
        ('TRIAL', 'Trial'),
        ('CANCELLED', 'Cancelled'),
    )
    
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Contact information
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    
    # Subscription details
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='STARTER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIAL')
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    subscription_renews_at = models.DateTimeField(null=True, blank=True)
    
    # Usage limits
    max_users = models.IntegerField(default=5)
    max_cases = models.IntegerField(default=100)
    api_calls_per_month = models.IntegerField(default=10000)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def is_trial_active(self):
        """Check if trial is still active"""
        if self.status != 'TRIAL' or not self.trial_ends_at:
            return False
        return timezone.now() < self.trial_ends_at
    
    @property
    def days_until_trial_ends(self):
        """Days remaining in trial"""
        if not self.trial_ends_at:
            return 0
        delta = self.trial_ends_at - timezone.now()
        return max(0, delta.days)

class LawFirmMember(models.Model):
    """Law firm member relationships"""
    
    ROLE_CHOICES = (
        ('OWNER', 'Owner'),
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
        ('READ_ONLY', 'Read Only'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    law_firm = models.ForeignKey(LawFirm, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='invited_members')
    
    class Meta:
        unique_together = ['user', 'law_firm']
    
    def __str__(self):
        return f"{self.user.email} - {self.law_firm.name}"

class Subscription(models.Model):
    """Subscription and billing model"""
    
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('CANCELLED', 'Cancelled'),
        ('PAST_DUE', 'Past Due'),
        ('UNPAID', 'Unpaid'),
    )
    
    INTERVAL_CHOICES = (
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    )
    
    law_firm = models.ForeignKey(LawFirm, on_delete=models.CASCADE)
    plan = models.CharField(max_length=20, choices=LawFirm.PLAN_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    interval = models.CharField(max_length=10, choices=INTERVAL_CHOICES, default='MONTHLY')
    
    # Pricing
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    
    # Billing dates
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    canceled_at = models.DateTimeField(null=True, blank=True)
    
    # Payment method
    payment_method_id = models.CharField(max_length=255, blank=True)
    last_payment_at = models.DateTimeField(null=True, blank=True)
    next_payment_at = models.DateTimeField()
    
    # Usage tracking
    api_calls_used = models.IntegerField(default=0)
    storage_used_gb = models.FloatField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.law_firm.name} - {self.plan}"
    
    @property
    def is_active(self):
        """Check if subscription is active"""
        return self.status == 'ACTIVE' and self.current_period_end > timezone.now()
    
    @property
    def days_until_renewal(self):
        """Days until next renewal"""
        delta = self.next_payment_at - timezone.now()
        return max(0, delta.days)

class Invoice(models.Model):
    """Invoice model for billing"""
    
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('SENT', 'Sent'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('VOID', 'Void'),
    )
    
    law_firm = models.ForeignKey(LawFirm, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, null=True, blank=True)
    
    invoice_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')
    
    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    
    # Dates
    issued_at = models.DateTimeField(auto_now_add=True)
    due_at = models.DateTimeField()
    paid_at = models.DateTimeField(null=True, blank=True)
    
    # Payment details
    payment_method = models.CharField(max_length=100, blank=True)
    transaction_id = models.CharField(max_length=255, blank=True)
    
    # Description
    description = models.TextField()
    line_items = models.JSONField(default=dict)  # Store line items as JSON
    
    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.law_firm.name}"

class UsageMetrics(models.Model):
    """Track usage metrics for billing and limits"""
    
    law_firm = models.ForeignKey(LawFirm, on_delete=models.CASCADE)
    metric_type = models.CharField(max_length=50)  # 'api_calls', 'storage', 'users', 'cases'
    metric_value = models.IntegerField(default=0)
    
    # Period
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['law_firm', 'metric_type', 'period_start', 'period_end']
    
    def __str__(self):
        return f"{self.law_firm.name} - {self.metric_type}: {self.metric_value}"

class AuditLog(models.Model):
    """Audit log for compliance and security"""
    
    ACTION_CHOICES = (
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('EXPORT', 'Export'),
        ('SHARE', 'Share'),
        ('ACCESS', 'Access'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    law_firm = models.ForeignKey(LawFirm, on_delete=models.SET_NULL, null=True, blank=True)
    
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=50)  # 'user', 'case', 'document', etc.
    resource_id = models.CharField(max_length=100, blank=True)
    
    # Details
    description = models.TextField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    
    # Changes (for UPDATE actions)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    
    # Result
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['law_firm', 'timestamp']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]
    
    def __str__(self):
        return f"{self.user.email if self.user else 'System'} - {self.action} - {self.resource_type}"

class Permission(models.Model):
    """Custom permissions for fine-grained access control"""
    
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    
    # Group permissions into categories
    category = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class RolePermission(models.Model):
    """Assign permissions to roles"""
    
    user_role = models.CharField(max_length=20, choices=User.ROLE_CHOICES)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['user_role', 'permission']
    
    def __str__(self):
        return f"{self.user_role} - {self.permission.name}"

class FeatureFlag(models.Model):
    """Feature flags for enabling/disabling features"""
    
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    enabled = models.BooleanField(default=True)
    
    # Target specific plans or firms
    target_plans = models.JSONField(default=list)  # List of plan types
    target_firms = models.ManyToManyField(LawFirm, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class APIKey(models.Model):
    """API keys for external integrations"""
    
    law_firm = models.ForeignKey(LawFirm, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=255, unique=True)
    
    # Permissions and limits
    permissions = models.JSONField(default=list)  # List of allowed endpoints
    rate_limit = models.IntegerField(default=1000)  # Requests per hour
    
    # Status
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"{self.law_firm.name} - {self.name}"
