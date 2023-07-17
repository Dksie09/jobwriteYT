from appwrite.client import Client
import requests
import base64
import re
from appwrite.services.account import Account

def main(req, res):
  client = Client()
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

    try:
        access_token = req.payload

        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/vnd.github.v3+json'
        }

        # Retrieve user information
        user_url = 'https://api.github.com/user'
        user_response = requests.get(user_url, headers=headers)
        user_data = user_response.json()

        # Extract name and avatar_url
        name = user_data["name"]
        avatar_url = user_data["avatar_url"]
        username = user_data["login"]

        # Retrieve repository information
        repo_url = f'https://api.github.com/user/repos'
        repo_response = requests.get(repo_url, headers=headers)
        repo_data = repo_response.json()

        # Extract list of languages
        languages = set()
        for repo in repo_data:
            if repo["language"]:
                languages.add(repo["language"])

        # Retrieve README content for the repository with the same name as the username
        readme_url = f'https://api.github.com/repos/{user_data["login"]}/{user_data["login"]}/readme'
        readme_response = requests.get(readme_url, headers=headers)
        if readme_response.status_code == 200:
            readme_data = readme_response.json()
            readme_content = readme_data["content"]
            readme_text = base64.b64decode(readme_content).decode("utf-8")

            # Clean text
            cleaned_text = re.sub(r'<[^>]+>|(\([^)]+\))', '', readme_text)
            cleaned_text = re.sub(r'^\s*#.*$', '', cleaned_text, flags=re.MULTILINE)
            cleaned_text = re.sub(r'[!@#$%^&*(),.;:\]\-[]', '', cleaned_text)
            cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
            readme_text = cleaned_text
        else:
            readme_text = "README not found."

        return res.json({
            "Status": True,
            "payload": access_token,
            "username": username,
            "name": name,
            "avatar_url": avatar_url,
            "languages": list(languages),
            "readme_text": readme_text
        })

    except Exception as e:
        return res.json({
            "Status": False,
            "payload": access_token,
            "error": str(e)
        })