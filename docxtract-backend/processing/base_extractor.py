from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

class BaseExtractor:
    def __init__(self, llm_model="gpt-4o", temperature=0, api_key=None):
        self.llm = ChatOpenAI(model=llm_model, temperature=temperature, api_key=api_key)
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are an expert extraction algorithm. "
             "Extract relevant information from the document. "
             "If uncertain, return null."),
            ("human", "{text}")
        ])
    
    def extract(self, text: str, schema):
        """Run LLM extraction with a given schema."""
        runnable = self.prompt | self.llm.with_structured_output(schema=schema)
        return runnable.invoke({"text": text})
