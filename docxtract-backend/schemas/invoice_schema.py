from pydantic import BaseModel, Field
from typing import List, Optional

class InvoiceItem(BaseModel):
    number: Optional[str] = Field(None)
    prod_number: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    quantity: Optional[str] = Field(None)
    hs_code: Optional[str] = Field(None)
    uom: Optional[str] = Field(None)
    origin: Optional[str] = Field(None)
    vendor_name: Optional[str] = Field(None)
    vendor_number: Optional[str] = Field(None)
    unit_price: Optional[str] = Field(None)
    currency: Optional[str] = Field(None)

class InvoiceSchema(BaseModel):
    seller_name: Optional[str] = None
    seller_address: Optional[str] = None
    seller_country: Optional[str] = None
    seller_phone: Optional[str] = None

    buyer_name: Optional[str] = None
    buyer_address: Optional[str] = None
    buyer_country: Optional[str] = None
    buyer_phone: Optional[str] = None

    ship_to: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[str] = None
    payment_terms: Optional[str] = None
    inco_terms: Optional[str] = None
    freight_terms: Optional[str] = None
    origin: Optional[str] = None
    ultimate_dest: Optional[str] = None
    tax_id: Optional[str] = None
    items: Optional[List[InvoiceItem]] = None
