# from langchain.chains import ConversationChain
# from langchain.chains.conversation.memory import ConversationBufferWindowMemory
# from langchain_groq import ChatGroq
# import ast  # To safely convert string to list

# # Function to initialize the chatbot
# def initialize_chatbot():
#     model = "mixtral-8x7b-32768"  # Fixed model
#     conversational_memory_length = 10  # Fixed memory length

#     # Initialize chat memory
#     memory = ConversationBufferWindowMemory(k=conversational_memory_length)

#     # Initialize Groq Langchain chat object
#     groq_chat = ChatGroq(
#         groq_api_key="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",  # Replace with actual API key
#         model_name=model
#     )

#     # Create conversation chain
#     conversation = ConversationChain(
#         llm=groq_chat,
#         memory=memory,
#         output_key="response"
#     )

#     return conversation  # Return chatbot instance

# # Function to get chatbot response



# def get_chatbot_response(conversation, job_post):
#     prompt = f"""Extract the following details from the given job post and return them in an array in the exact order:
# 1. Job Title
# 2. Job Location
# 3. Department
# 4. Range of Salary
# 5. Profile
# 6. Job Description
# 7. Requirements
# 8. Job Benefits
# 9. Telecommunication (0 or 1)
# 10. Company Logo (0 or 1)
# 11. Type of Employment
# 12. Experience
# 13. Qualification
# 14. Type of Industry
# 15. Operations

# Job Post:
# {job_post}

# Return only the array of extracted values, with empty strings for missing values. The output must be formatted exactly as follows:

# ["Job Title", "Job Location", "Department", "Range of Salary", "Profile", "Job Description", "Requirements", "Job Benefits", "Telecommunication", "Company Logo", "Type of Employment", "Experience", "Qualification", "Type of Industry", "Operations"]
# """
#     try:
#         response = conversation.run(prompt)  # Get response
#         return response
#     except ValueError as e:
#         return f"Error: {e}"

















# <----Ye phaaltu hai------------------------------------------------>



# import os
# from dotenv import load_dotenv
# from langchain_core.runnables.history import RunnableWithMessageHistory
# from langchain_core.memory import ChatMessageHistory
# from langchain_groq import ChatGroq

# # Load environment variables from .env file
# load_dotenv()

# # Function to initialize the chatbot
# def initialize_chatbot():
#     model = "mixtral-8x7b-32768"  # Groq model
#     groq_api_key = os.getenv("GROQ_API_KEY")  # Load API key from environment

#     if not groq_api_key:
#         raise ValueError("Groq API key is missing. Set the GROQ_API_KEY in your .env file.")

#     # Initialize chat memory
#     message_history = ChatMessageHistory()

#     # Initialize Groq Langchain chat object
#     groq_chat = ChatGroq(
#         groq_api_key=groq_api_key,
#         model_name=model
#     )

#     # Create conversation chain
#     conversation = RunnableWithMessageHistory(
#         runnable=groq_chat,
#         get_session_history=lambda _: message_history,  # Required for memory
#     )

#     return conversation  # Return chatbot instance

# # Function to get chatbot response
# def get_chatbot_response(conversation, job_post):
#     prompt = f"""Extract the following details from the given job post and return them in an array in the exact order:
# 1. Job Title
# 2. Job Location
# 3. Department
# 4. Range of Salary
# 5. Profile
# 6. Job Description
# 7. Requirements
# 8. Job Benefits
# 9. Telecommunication (0 or 1)
# 10. Company Logo (0 or 1)
# 11. Type of Employment
# 12. Experience
# 13. Qualification
# 14. Type of Industry
# 15. Operations

# Job Post:
# {job_post}

# Return only the array of extracted values, with empty strings for missing values. The output must be formatted exactly as follows:

# ["Job Title", "Job Location", "Department", "Range of Salary", "Profile", "Job Description", "Requirements", "Job Benefits", "Telecommunication", "Company Logo", "Type of Employment", "Experience", "Qualification", "Type of Industry", "Operations"]
# """
#     try:
#         response = conversation.invoke(prompt)  # Updated method to get response
#         return response
#     except Exception as e:
#         return f"Error: {e}"

















from openai import OpenAI
import os
from dotenv import load_dotenv
import ast

# Load environment variables
load_dotenv()

def initialize_chatbot():
    """Initialize the OpenAI client"""
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENROUTER_API_KEY"),
    )
    return client

def get_chatbot_response(client, job_post):
    """Get response from OpenAI model using the existing prompt structure"""
    prompt = f"""Extract the following details from the given job post and return them in an array in the exact order:
1. Job Title
2. Job Location
3. Department
4. Range of Salary
5. Profile
6. Job Description
7. Requirements
8. Job Benefits
9. Telecommunication (0 or 1)
10. Company Logo (0 or 1)
11. Type of Employment
12. Experience
13. Qualification
14. Type of Industry
15. Operations

Job Post:
{job_post}

Return only the array of extracted values, with empty strings for missing values. The output must be formatted exactly as follows:

["Job Title", "Job Location", "Department", "Range of Salary", "Profile", "Job Description", "Requirements", "Job Benefits", "Telecommunication", "Company Logo", "Type of Employment", "Experience", "Qualification", "Type of Industry", "Operations"]
"""
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "http://localhost:5000",
                "X-Title": "Job Post Analyzer",
            },
            model="openai/gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        
        if not completion.choices or len(completion.choices) == 0:
            return "Error: Empty response from API"
            
        return completion.choices[0].message.content
        
    except Exception as e:
        print(f"API Error: {str(e)}")
        if hasattr(e, 'response'):
            print(f"API Response: {e.response.text}")
        return f"Error: {str(e)}"