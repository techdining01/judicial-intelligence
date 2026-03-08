from fastapi import Depends, HTTPException
from .jwt import get_current_user


def require_role(required_role: str):
    def checker(user=Depends(get_current_user)):
        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return checker
