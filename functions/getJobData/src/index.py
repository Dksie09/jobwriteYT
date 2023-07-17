from appwrite.client import Client
import requests
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
import re
import nltk
from appwrite.services.account import Account
from appwrite.services.databases import Databases
from appwrite.query import Query
from appwrite.id import ID

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
  client = Client()
  databases = Databases(client)
  account = Account(client)

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
    
    company_name_list=[]
    logo_list = []
    job_title_list=[]
    l = []
    location_list=[]
    stipend_list = []
    skills_reqd_list=[]
    about_company_list=[]
    job_responsibilities_list=[]
    job_requirements_list=[]
    l2=[]
    l1=[]
    tag_list=[]
    url_list=[]

    try:
      for n in range(1, 10):
        html = requests.get('https://internshala.com/internships/engineering-internship/page-{}/'.format(n)).text
        soup = BeautifulSoup(html, 'html.parser')

        #get the job title
        for i in soup.find_all('h3', class_='heading_4_5 profile'):
                job_title_list.append(i.text.strip())

        #get company name
        for i in soup.find_all('a', class_='link_display_like_text view_detail_button'):
                company_name_list.append(i.text.strip())

        #get location
        for p in soup.find_all('div', id="location_names"):
              for i in p.find('a', class_="location_link view_detail_button"):
                  l = i.text.strip()
              location_list.append(l)

        #get stipend
        for i in soup.find_all('div', class_="internship_other_details_container"):
                stipend_divs = i.find_all('div', class_="other_detail_item stipend_container")
                for div in stipend_divs:
                    stipend_span = div.find('span', class_="stipend")
                    if stipend_span is not None:
                        stipend_amount = stipend_span.text.strip()
                        stipend_list.append(stipend_amount)

        #get logo
        for i in soup.find_all('div', class_='internship_logo'):
                try:
                    logo_list.append("https://internshala.com"+i.img['src'])
                except:
                    logo_list.append("https://images1-fabric.practo.com/dermafollix-hair-transplant-and-skin-clinic-surat-1449058531-565ee0e388f5a.png")

        #get info page url and get further info from there
        for div in soup.find_all('div', class_="cta_container"):
                url = "https://internshala.com/"+div.find('a')['href']
                url_list.append(url)
                web2 = requests.get(url).text

                soup2 = BeautifulSoup(web2, 'html.parser')
                if(soup2.find('div', class_='section_heading heading_5_5 skills_heading')):
                    for i in soup2.find_all('div', class_='round_tabs_container'):
                            skills_reqd_list.append(i.text.strip().replace('\n', ', ').replace('\r', '')+" ")
                            break
                else:
                    skills_reqd_list.append(" ")

                for i in soup2.find_all('div', class_='text-container about_company_text_container'):
                    about_company_list.append(i.text.strip())
                
                for div2 in soup2.find_all('div', class_='internship_details'):
                        # count+=1
                    for i in div2.select("div[class='text-container']"):
                        txt = i.text.strip()
                        # print(txt)
                        if("Key responsibilities:" in txt):
                            # print("yay")
                            responsibilities = txt.split("Key responsibilities:")[1].split("Requirements:")[0].strip()
                            
                            #remove index numbers from responsibilities
                            responsibilities = re.sub(r'\d+\.', '', responsibilities)
                            responsibilities = responsibilities.replace("\n", ',')
                            
                            l1.append(responsibilities)


                        if ("Requirements:" in txt):
                            requirements = txt.split("Requirements:")[1].strip()
                            requirements = re.sub(r'\d+\.', '', requirements)
                            requirements = requirements.replace("\n", ',')
                            
                            l2.append(requirements)
                            # print(l2)
                    
                    job_responsibilities_list.append(l1)
                    job_requirements_list.append(l2)

    #================================================================================================================================================================
        nltk.download('stopwords')  # Download stopwords corpus
        stop_words = set(stopwords.words('english'))  # Set of English stopwords

        def preprocess_text(text):
            if not isinstance(text, str):                     
              text = str(text)
            # Remove special characters and convert to lowercase
            text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
            # Remove stopwords
            text = ' '.join([word for word in text.split() if word not in stop_words])
            return text
        
        for i in range(len(job_title_list)):
              preprocessed_job_title = preprocess_text(job_title_list[i])
              preprocessed_skills_reqd = preprocess_text(skills_reqd_list[i])
              preprocessed_job_requirements = preprocess_text(job_requirements_list[i])
              preprocessed_about_company = preprocess_text(about_company_list[i])

              tag = preprocessed_job_title +' '+ preprocessed_skills_reqd +' '+ preprocessed_job_requirements +' '+ preprocessed_about_company
              tag_list.append(tag)

    #================================================================================================================================================================
        
        for i in range(len(company_name_list)):
          if (job_title_list[i]==''):
            continue
          
          #check if document already exists in database
          result = databases.list_documents('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', [
                Query.equal('url', url_list[i]),
            ])
          
          data = {
                          'company_name': company_name_list[i],
                          'logo': logo_list[i],
                          'job_title': job_title_list[i],
                          'skills_reqd': skills_reqd_list[i],
                          'url': url_list[i],
                          'about_company': about_company_list[i],
                          'stipend': str(stipend_list[i]),
                          'location': location_list[i],
                          'tags' : tag_list[i][:5000]
                      }

          try:

              id = result['documents'][0]['$id']
              result = databases.update_document('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', id, data = data,)

          except:

              id = ID.unique()
              result = databases.create_document('64b016de0d3e5f5e9d47', '64b2646d1949f7a502b5', id, data = data,)
      
      return res.json({"success": True, "message": "Data added successfully"})
    
    except Exception as e:
      return res.json({"success": False, "message": str(e)})

