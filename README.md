# Spotify Artist & Collaboration Explorer

This data dashboard was created for COMP435 course at Macalester College by Hanna Chang and Joshua Segebre.

## Spotify Token Retrieval

In order to retreive all necessary data for the dashboard, you will need a Token for the Spotify API.  

You may either:  
create your own token (recommended)   
OR contact either of the dashboard authors

### To create your own token
1. Visit [Spotify for Developers](https://developer.spotify.com/)
2. Log in or create an account
3. Go to [Dashboard](https://developer.spotify.com/dashboard) and create a new app
4. You will be required to type in the *App Name*, *App Description*, and *Redirect URIs*
    - Place any name and description you would like
    - `http://[::1]:PORT` is recommended for the *Redirect URI*
5. Select *Web API*
6. Save the new app
7. You will now be able to view a `Client ID` and `Client Secret`
8. In any terminal (your default computer terminal, or the terminal from any of your preferred code text editors like VS Code) paste the following and replace [YOUR CLIENT ID HERE] and [YOUR CLIENT SECRET HERE] in the third line with your own

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=[YOUR CLIENT ID HERE]&client_secret=[YOUR CLIENT SECRET HERE]"
```

9. This will return something like

```bash
{"access_token":"BQDYFnJmCOV1bREQ2WdMnGkN1iZHNTKfe3q20Ndceytr_8YGH9zDLwK7PDCL6-iKId1ANNjRNV4XCRGi2bt1OHFqg-xN2HS110mOUOl-HG79UdGTbaOtsHYXCIrhLivRS_TxKo","token_type":"Bearer","expires_in":3600}%
```

Congratulations! Now you have successfully generated a short-lived (1 hour) token of `BQDYFnJmCOV1bREQ2WdMnGkN1iZHNTKfe3q20Ndceytr_8YGH9zDLwK7PDCL6-iKId1ANNjRNV4XCRGi2bt1OHFqg-xN2HS110mOUOl-HG79UdGTbaOtsHYXCIrhLivRS_TxKo`

> [!NOTE]
> This is an example and the token displayed here is invalid


## To Run the Dashboard

1. In your preferred code editor, open the terminal
2. Make sure you are in `apps/web`
    - If not, paste this line of code to get into the right location

```bash
cd apps/web
```

3. Once you are in `apps/web`, run the following command

```bash
npm run dev
```

This will return something like:

```bash
> dev
> react-router dev

  ➜  Local:   http://localhost:4000/
  ➜  Network: http://141.140.227.62:4000/
  ➜  press h + enter to show help
```

> [!NOTE]
> The exact links will vary

4. Command + click on the Local link

> [!IMPORTANT]
> Make sure to paste your Spotify token in the text box located at the top of the dashboard once it is loaded!
