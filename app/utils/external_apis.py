"""
External API utilities for countries and exchange rates.
"""
import httpx
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from ..config import get_settings
from ..schemas.common import CountryInfo, ExchangeRate
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class CountryAPI:
    """Country API client."""
    
    def __init__(self):
        self.base_url = settings.restcountries_api_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def get_country_info(self, country_name: str) -> Optional[CountryInfo]:
        """Get country information by name."""
        try:
            response = await self.client.get(
                f"{self.base_url}/name/{country_name}",
                params={"fields": "name,cca2,currencies"}
            )
            response.raise_for_status()
            data = response.json()
            
            if data and len(data) > 0:
                country = data[0]
                currencies = country.get("currencies", {})
                currency_code = list(currencies.keys())[0] if currencies else "USD"
                currency_info = currencies.get(currency_code, {})
                currency_symbol = currency_info.get("symbol", currency_code)
                
                return CountryInfo(
                    name=country["name"]["common"],
                    code=country["cca2"],
                    currency=currency_code,
                    currency_symbol=currency_symbol
                )
        except Exception as e:
            logger.error(f"Error fetching country info for {country_name}: {e}")
            return None
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


class ExchangeRateAPI:
    """Exchange rate API client."""
    
    def __init__(self):
        self.base_url = settings.exchange_rate_api_url
        self.api_key = settings.exchange_rate_api_key
        self.client = httpx.AsyncClient(timeout=30.0)
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_expiry: Dict[str, datetime] = {}
    
    async def get_exchange_rate(self, from_currency: str, to_currency: str) -> Optional[float]:
        """Get exchange rate between two currencies."""
        if from_currency == to_currency:
            return 1.0
        
        cache_key = f"{from_currency}_{to_currency}"
        now = datetime.now()
        
        # Check cache first
        if (cache_key in self.cache and 
            cache_key in self.cache_expiry and 
            now < self.cache_expiry[cache_key]):
            return self.cache[cache_key]["rate"]
        
        try:
            # Try to get rate from base currency
            if from_currency == "USD":
                rate = await self._get_rate_from_usd(to_currency)
            else:
                # Convert through USD
                usd_rate = await self._get_rate_from_usd(from_currency)
                target_rate = await self._get_rate_from_usd(to_currency)
                if usd_rate and target_rate:
                    rate = target_rate / usd_rate
                else:
                    rate = None
            
            if rate:
                # Cache the result for 1 hour
                self.cache[cache_key] = {"rate": rate}
                self.cache_expiry[cache_key] = now + timedelta(hours=1)
                return rate
                
        except Exception as e:
            logger.error(f"Error fetching exchange rate {from_currency} to {to_currency}: {e}")
            return None
    
    async def _get_rate_from_usd(self, currency: str) -> Optional[float]:
        """Get exchange rate from USD to target currency."""
        try:
            url = f"{self.base_url}/USD"
            if self.api_key:
                url += f"?access_key={self.api_key}"
            
            response = await self.client.get(url)
            response.raise_for_status()
            data = response.json()
            
            if "rates" in data:
                return data["rates"].get(currency)
            elif "data" in data:
                return data["data"].get(currency)
                
        except Exception as e:
            logger.error(f"Error fetching USD to {currency} rate: {e}")
            return None
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


class OCRService:
    """OCR service for receipt processing."""
    
    def __init__(self):
        self.api_key = settings.ocr_api_key
        self.api_url = settings.ocr_api_url
        self.enabled = settings.ocr_enabled
        self.client = httpx.AsyncClient(timeout=60.0) if self.enabled else None
    
    async def extract_text(self, file_path: str, mime_type: str) -> Optional[str]:
        """Extract text from image or PDF using OCR."""
        if not self.enabled or not self.client:
            return None
        
        try:
            with open(file_path, "rb") as file:
                files = {"file": (file_path, file, mime_type)}
                data = {"api_key": self.api_key}
                
                response = await self.client.post(
                    self.api_url,
                    files=files,
                    data=data
                )
                response.raise_for_status()
                
                result = response.json()
                return result.get("text", "")
                
        except Exception as e:
            logger.error(f"Error extracting OCR text from {file_path}: {e}")
            return None
    
    async def close(self):
        """Close the HTTP client."""
        if self.client:
            await self.client.aclose()


# Global instances
country_api = CountryAPI()
exchange_rate_api = ExchangeRateAPI()
ocr_service = OCRService()


async def cleanup_apis():
    """Cleanup all API clients."""
    await country_api.close()
    await exchange_rate_api.close()
    await ocr_service.close()
