from django.contrib import admin
from .models import LoginHistory

@admin.register(LoginHistory)
class LoginHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'ip_address', 'user_agent', 'timestamp')
    search_fields = ('user__email', 'ip_address')
    list_filter = ('timestamp',)
