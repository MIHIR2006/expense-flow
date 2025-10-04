"""
Utility functions and helpers.
"""
from .auth import (
    verify_password, get_password_hash, create_access_token, 
    create_refresh_token, verify_token, create_tokens
)
from .rbac import (
    get_current_user, require_role, require_admin, require_manager_or_admin,
    require_same_company, require_same_company_or_admin, can_manage_user,
    can_approve_expense, can_view_expense
)
from .external_apis import country_api, exchange_rate_api, ocr_service, cleanup_apis
from .file_storage import file_storage, s3_storage, get_storage

__all__ = [
    "verify_password", "get_password_hash", "create_access_token",
    "create_refresh_token", "verify_token", "create_tokens",
    "get_current_user", "require_role", "require_admin", "require_manager_or_admin",
    "require_same_company", "require_same_company_or_admin", "can_manage_user",
    "can_approve_expense", "can_view_expense",
    "country_api", "exchange_rate_api", "ocr_service", "cleanup_apis",
    "file_storage", "s3_storage", "get_storage"
]
