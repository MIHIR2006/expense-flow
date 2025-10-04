"""
File storage utilities for handling file uploads.
"""
import os
import uuid
import aiofiles
from typing import Optional, BinaryIO
from fastapi import UploadFile, HTTPException
from ..config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class FileStorage:
    """File storage handler."""
    
    def __init__(self):
        self.upload_dir = settings.upload_dir
        self.max_file_size = settings.max_file_size
        self.allowed_types = settings.allowed_file_types
        self._ensure_upload_dir()
    
    def _ensure_upload_dir(self):
        """Ensure upload directory exists."""
        os.makedirs(self.upload_dir, exist_ok=True)
    
    def _validate_file(self, file: UploadFile) -> None:
        """Validate uploaded file."""
        if file.size and file.size > self.max_file_size:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {self.max_file_size} bytes."
            )
        
        if file.content_type not in self.allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(self.allowed_types)}"
            )
    
    def _generate_filename(self, original_filename: str) -> str:
        """Generate unique filename."""
        ext = os.path.splitext(original_filename)[1]
        return f"{uuid.uuid4()}{ext}"
    
    async def save_file(self, file: UploadFile) -> dict:
        """Save uploaded file to disk."""
        self._validate_file(file)
        
        filename = self._generate_filename(file.filename)
        file_path = os.path.join(self.upload_dir, filename)
        
        try:
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            return {
                "filename": filename,
                "original_filename": file.filename,
                "file_path": file_path,
                "file_size": len(content),
                "mime_type": file.content_type
            }
        except Exception as e:
            logger.error(f"Error saving file {file.filename}: {e}")
            raise HTTPException(status_code=500, detail="Error saving file")
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from disk."""
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file {file_path}: {e}")
            return False
    
    def get_file_path(self, filename: str) -> str:
        """Get full file path for filename."""
        return os.path.join(self.upload_dir, filename)


class S3Storage:
    """S3 storage handler (optional)."""
    
    def __init__(self):
        self.bucket_name = settings.s3_bucket_name
        self.aws_access_key = settings.aws_access_key_id
        self.aws_secret_key = settings.aws_secret_access_key
        self.region = settings.aws_region
        self._client = None
    
    async def _get_client(self):
        """Get S3 client."""
        if not self._client and self.bucket_name:
            try:
                import boto3
                self._client = boto3.client(
                    's3',
                    aws_access_key_id=self.aws_access_key,
                    aws_secret_access_key=self.aws_secret_key,
                    region_name=self.region
                )
            except ImportError:
                logger.warning("boto3 not installed, S3 storage disabled")
        return self._client
    
    async def save_file(self, file: UploadFile, folder: str = "expenses") -> dict:
        """Save file to S3."""
        client = await self._get_client()
        if not client:
            raise HTTPException(status_code=500, detail="S3 not configured")
        
        filename = f"{uuid.uuid4()}_{file.filename}"
        key = f"{folder}/{filename}"
        
        try:
            content = await file.read()
            client.put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=content,
                ContentType=file.content_type
            )
            
            return {
                "filename": filename,
                "original_filename": file.filename,
                "file_path": f"s3://{self.bucket_name}/{key}",
                "file_size": len(content),
                "mime_type": file.content_type
            }
        except Exception as e:
            logger.error(f"Error saving file to S3: {e}")
            raise HTTPException(status_code=500, detail="Error saving file to S3")
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete file from S3."""
        client = await self._get_client()
        if not client:
            return False
        
        try:
            # Extract key from s3://bucket/key format
            key = file_path.split("/", 3)[-1]
            client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except Exception as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False


# Global instances
file_storage = FileStorage()
s3_storage = S3Storage()


def get_storage() -> FileStorage:
    """Get appropriate storage handler."""
    if settings.s3_bucket_name:
        return s3_storage
    return file_storage
