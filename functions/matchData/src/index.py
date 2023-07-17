from appwrite.client import Client
import math
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from appwrite.services.databases import Databases
from appwrite.query import Query

"""
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
"""

def main(req, res):
  try:
    nltk.download('stopwords')
    nltk.download('punkt')

    client = Client()
    databases = Databases(client)

    if not req.variables.get('APPWRITE_FUNCTION_ENDPOINT') or not req.variables.get('APPWRITE_FUNCTION_API_KEY'):
      print('Environment variables are not set. Function cannot use Appwrite SDK.')
    else:
      (
      client
        .set_endpoint(req.variables.get('APPWRITE_FUNCTION_ENDPOINT', None))
        .set_project(req.variables.get('APPWRITE_FUNCTION_PROJECT_ID', None))
        .set_key(req.variables.get('APPWRITE_FUNCTION_API_KEY', None))
        .set_self_signed(True)
      )

      #get the job data
      result = databases.list_documents('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', [
        Query.limit(25),
      ])

      def get_all_docs():
        all_docs = []
        queries = [
          Query.limit(25),
        ]

        resp = databases.list_documents('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', queries )
        #  return resp
        all_docs.extend(resp["documents"])
        lastId = resp["documents"][-1]["$id"]
        queries.append(Query.cursor_after(lastId))
        try:
          while len(resp["documents"]) == 25:
              resp = databases.list_documents('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', queries )
              all_docs.extend(resp["documents"])
              lastId = resp["documents"][-1]["$id"]
              queries = [Query.limit(25), Query.cursor_after(lastId)]
              
        except:
            pass
        
        return all_docs
      
      docs = get_all_docs()

      #  dictionary with id and tags
      tag_docs = {}
      for i in range(len(docs)):
        tag_docs[docs[i]["$id"]] = docs[i]["tags"]


      # get the user data
      mail = req.payload
      userResp = databases.list_documents('64abb564c2097d744ba1', '64abb57133827f365cbd', [
              Query.equal("email", mail)
            ]
      )

      # Extract the values you're interested in
      user_id = userResp["documents"][0]["$id"]
      user_lang = userResp["documents"][0]["languages"]
      user_readme = userResp["documents"][0]["readme"]

      #--------------------------------------------------
      #matching algorithm
      def calculate_similarity(user_lang, user_readme, tag_docs):
        # Convert user_lang to lowercase
        user_lang = [lang.strip().lower() for lang in user_lang.split(",")]

        # Combine user language and readme into a single string
        user_text = " ".join(user_lang + [user_readme])

        # Remove stop words from user_text
        stop_words = set(stopwords.words('english'))
        tokens = word_tokenize(user_text)
        filtered_tokens = [word for word in tokens if word.casefold() not in stop_words]
        filtered_user_text = " ".join(filtered_tokens)

        # Calculate TF-IDF vectors for user and tag documents
        user_vector = calculate_tf_idf_vector(filtered_user_text)
        tag_vectors = {doc_id: calculate_tf_idf_vector(doc_text) for doc_id, doc_text in tag_docs.items()}

        # Calculate cosine similarity between user and tag documents
        similarity_scores = {}
        for doc_id, doc_vector in tag_vectors.items():
            similarity_scores[doc_id] = calculate_cosine_similarity(user_vector, doc_vector)

        top_documents = sorted(similarity_scores.items(), key=lambda x: x[1], reverse=True)  
        return top_documents  
      
      def calculate_tf_idf_vector(text):
        # Calculate term frequencies
        term_frequencies = {}
        tokens = word_tokenize(text)
        for token in tokens:
            term_frequencies[token] = term_frequencies.get(token, 0) + 1

        # Calculate TF-IDF vector
        tf_idf_vector = {}
        total_tokens = len(tokens)
        for token, freq in term_frequencies.items():
            tf = freq / total_tokens
            idf = calculate_idf(token, tag_docs)
            tf_idf_vector[token] = tf * idf
        return tf_idf_vector
      
      def calculate_idf(token, tag_docs):
        num_documents_with_token = sum(1 for doc_text in tag_docs.values() if token in doc_text)
        num_documents = len(tag_docs)
        idf = math.log(num_documents / (1 + num_documents_with_token))
        return idf
      
      def calculate_cosine_similarity(vector1, vector2):
        dot_product = sum(vector1.get(token, 0) * vector2.get(token, 0) for token in set(vector1) & set(vector2))
        norm1 = math.sqrt(sum(freq ** 2 for freq in vector1.values()))
        norm2 = math.sqrt(sum(freq ** 2 for freq in vector2.values()))
        if norm1 == 0 or norm2 == 0:
            return 0
        cosine_similarity = dot_product / (norm1 * norm2)
        return cosine_similarity
      
      top_documents = calculate_similarity(user_lang, user_readme.lower(), tag_docs)

    return res.json({
        "success" : True,
        "matched_docs" : top_documents
      })
  
  except Exception as e:
      return res.json({
        "success": False,
        "error": str(e)
      })