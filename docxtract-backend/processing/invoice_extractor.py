from .base_extractor import BaseExtractor
from schemas.invoice_schema import InvoiceSchema

class InvoiceExtractor(BaseExtractor):
    def extract_invoice(self, text):
        return self.extract(text, InvoiceSchema)
