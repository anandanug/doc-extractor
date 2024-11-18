import streamlit as st
import pandas as pd
import fitz  # PyMuPDF untuk membaca PDF
from pydantic import BaseModel, Field, ValidationError
from typing import Optional, List
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

# Model Data
class InvoiceItem(BaseModel):
    """Schema for extracting key information from PL"""
    
    number: Optional[str] = Field(..., description="The number of the transaction")
    datetime: Optional[str] = Field(..., description="The date and time transaction")
    serice_name: Optional[str] = Field(..., description="The service name of the transaction")
    origin: Optional[str] = Field(..., description="The origin of the transaction")
    destination: Optional[str] = Field(..., description="The destination of the transaction")
    payment_method: Optional[str] = Field(..., description="The payment method of the transaction")
    total_paid: Optional[str] = Field(..., description="The total paid of the product")

class InvoiceSchema(BaseModel):
    """Schema for extracting key information from PL"""

    username: Optional[str] = Field(..., description="The name information mentioned in the document")
    periode_transaction: Optional[str] = Field(..., description="The periode of transaction")
    total_transaction: Optional[str] = Field(..., description="The total transaction")
    items: Optional[List[InvoiceItem]] = Field(..., description="List of items in the packing list document")

# Fungsi untuk memproses file yang diunggah
def preview_file(uploaded_file):
    file_type = uploaded_file.type

    # Menangani file PDF
    if file_type == "application/pdf":
        pdf_data = uploaded_file.read()
        pdf_document = fitz.open(stream=pdf_data, filetype="pdf")
        preview_text = ""

        for page_num in range(min(2, pdf_document.page_count)):
            page = pdf_document.load_page(page_num)
            preview_text += page.get_text("text")
        
        st.text_area("👁️ PDF Preview", preview_text[:2000], height=400)
        return preview_text

    return None

# Fungsi utama aplikasi
def main():

    st.set_page_config(
        page_title="Doc Extraction - Document to JSON",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    
    st.title("📄 Doc Extraction: PDF to JSON")
    st.write("This application is used to extract key information from documents and convert it into JSON format.")

    # Input API Key (Opsional)
    with st.sidebar:
        st.header("🔑 API Key Setup")
        api_key = st.text_input(
            "Enter your OpenAI API Key:",
            type="password",
        )
        st.warning("Enter your key to continue")

        # Informasi tentang pembuat aplikasi
        st.markdown("---")
        st.markdown("**👨‍💻 About the Developer**")
        st.markdown("Created by: **Ananda Anugrah Ramadhan**")
        st.markdown("LinkedIn: [anandanug](https://linkedin.com/in/anandanug)")
        st.markdown("---")

    # Layout utama aplikasi
    col1, col2 = st.columns([1, 1])

    # Kolom pertama untuk upload file
    with col1:
        st.write("**🧾 Invoice :**")
        uploaded_file = st.file_uploader("📤 Upload File", type=["pdf"])
        file_text = None
        if uploaded_file is not None:
            file_text = preview_file(uploaded_file)

    # Kolom kedua untuk pengolahan prompt
    with col2:
        st.write("**🔍 JSON Extraction :**")
        if file_text:
            if api_key:
                try:
                    prompt = ChatPromptTemplate.from_messages(
                        [
                            (
                                "system",
                                "You are an expert extraction algorithm. Extract key information from the text. "
                                "If any information is missing or unknown, return null for that field."
                            ),
                            ("human", "{text}")
                        ]
                    )
                    llm = ChatOpenAI(model="gpt-4", temperature=0, api_key=api_key)

                    # Menjalankan prompt dengan teks dari file
                    runnable = prompt | llm.with_structured_output(schema=InvoiceSchema)
                    output = runnable.invoke({"text": file_text})
                    st.json(output.dict())  # Menampilkan output sebagai JSON
                except Exception as e:
                    st.error(f"Terjadi kesalahan saat memproses dengan LLM: {str(e)}")
            else:
                st.warning("LLM extraction requires an API key. Please provide one in the sidebar.")
                st.write("However, you can preview the uploaded text in the PDF preview area.")

if __name__ == "__main__":
    main()
