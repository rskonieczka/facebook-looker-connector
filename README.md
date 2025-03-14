# Free Connector for Looker Studio and Facebook Page Stat

A free Community Connector for Looker Studio that allows you to retrieve and analyze post statistics from selected Facebook pages.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Creating a Facebook App](#creating-a-facebook-app)
  - [Apps Script Configuration](#apps-script-configuration)
  - [Deploying the Connector](#deploying-the-connector)
- [Configuration in Looker Studio](#configuration-in-looker-studio)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)
- [API Functions](#api-functions)
- [License](#license)

## Introduction

Facebook Page Stats Connector allows Looker Studio users to retrieve and visualize statistical data about posts from selected Facebook pages. With this tool, you can analyze:
- User engagement statistics
- Reaction data
- Post reach and impressions
- And other metrics available through Facebook Graph API

## Features

- OAuth 2.0 authentication with Facebook API
- Selection of Facebook pages for analysis
- Date range specification for data
- Selection of statistics types for analysis
- Retrieval of metrics such as likes, comments, shares, reach, etc.
- Full integration with Looker Studio interface

## Prerequisites

- Google Account (for creating Apps Script)
- Facebook account with access to Facebook Developers
- Admin permissions for at least one Facebook page
- Access to Looker Studio (formerly Google Data Studio)

## Installation

### Creating a Facebook App

1. **Register as a developer:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Log in to your Facebook account
   - If you don't have a developer account yet, sign up

2. **Create a new application:**
   - Click "My Apps" in the top right corner
   - Select "Create App"
   - Choose app type (recommended: "Website" or "Business")
   - Enter app name (e.g., "My Looker Studio Connector")
   - Provide your email address for contact
   - Click "Create App"

3. **Configure Facebook Login:**
   - In the app panel, go to "Add Products" section
   - Find and click "Facebook Login" and select "Set Up"
   - In Facebook Login settings:
     - In the "Valid OAuth Redirect URIs" field, add:
       - OAuth redirect URL: `https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercallback`
       (Note: Deployment ID will be available after deploying Apps Script - temporarily you can add `https://script.google.com`)
     - Save changes

4. **Configure permissions:**
   - In the left menu, click "App Review" 
   - Go to "Permissions and features" section
   - Add the following permissions:
     - `pages_read_engagement`
     - `pages_show_list`
     - `pages_read_user_content`
   - Provide justification for each permission (e.g., "To retrieve statistical data about posts on Facebook pages for analysis in Looker Studio")

5. **Get CLIENT_ID and CLIENT_SECRET:**
   - In the left menu, click "Settings" and select "Basic"
   - Save:
     - App ID - this will be your CLIENT_ID
     - App Secret - this will be your CLIENT_SECRET

### Apps Script Configuration

1. **Create a new Apps Script project:**
   - Go to [Google Apps Script](https://script.google.com/)
   - Click "New Project"
   - Give the project a name (e.g., "Facebook Page Stats Connector")

2. **Add files to the project:**
   - Copy and paste all files from this repository to your Apps Script project:
     - `appsscript.json`
     - `main.js`
     - `auth.js`
     - `data.js`
     - `util.js`
     - `callback.html`

3. **Update authentication data:**
   - Open the `auth.js` file
   - Replace placeholder values with actual data from your Facebook app:
   ```javascript
   var CLIENT_ID = 'YOUR_APP_ID';
   var CLIENT_SECRET = 'YOUR_APP_SECRET';
   ```

4. **Add OAuth2 library:**
   - In the Apps Script environment, click "+" next to "Libraries" in the sidebar
   - Enter library ID: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF`
   - Click "Look up"
   - Choose the latest version
   - Click "Add"

### Deploying the Connector

1. **Prepare for deployment:**
   - In the Apps Script environment, click "Deploy" > "New deployment"
   - Select type: "Community Connector"
   - Add a deployment description (e.g., "First version")
   - Click "Deploy"

2. **Get deployment ID:**
   - After deployment, you will see a deployment ID in the format `AKfycbXXXXXXXXXXXXXXXXXXX`
   - Save this ID

3. **Update the redirect URL in your Facebook app:**
   - Return to Facebook Login settings in your Facebook app
   - Update the redirect URL to:
     `https://script.google.com/macros/d/{YOUR_DEPLOYMENT_ID}/usercallback`
   - Replace `{YOUR_DEPLOYMENT_ID}` with the ID you just received

4. **Publish the connector (optional):**
   - To share the connector with other users, you need to submit your Facebook app for review
   - In the Facebook app panel, go to "App Review"
   - Click the "Submit for Review" button
   - Fill in the required information and submit the form

## Configuration in Looker Studio

1. **Add the connector to Looker Studio:**
   - Go to [Looker Studio](https://lookerstudio.google.com/)
   - Create a new report
   - Click "Add data"
   - In the "Community Connectors" tab, find your connector
     (Note: If you haven't published the connector, it will only be visible to you)

2. **Authentication with Facebook:**
   - Click on your connector
   - You will be asked to log in to Facebook and grant permissions
   - Authorize the application

3. **Connector configuration:**
   - After authorization, enter:
     - Facebook page ID (you can find it in the page URL)
     - Select the type of statistics (basic, engagement, reactions)
     - Specify the date range
   - Click "Connect"

4. **Creating a report:**
   - After connecting to the data, you can start creating visualizations
   - Available metrics:
     - Post ID
     - Publication Date
     - Post Type
     - Post Content
     - Likes
     - Comments
     - Shares
     - Reach
     - Impressions
     - Engagement

## Troubleshooting

### Authentication Problems
- Check if the redirect URL in the Facebook app is correct
- Make sure the Facebook app has correctly configured permissions
- Check if the CLIENT_ID and CLIENT_SECRET are correctly entered in the `auth.js` file

### No Data
- Make sure you have admin permissions for the specified Facebook page
- Check if the page ID is correct
- Verify if the selected page has posts in the specified date range

### API Limits
- Facebook API has request frequency limits
- If you have a large number of posts, you may encounter limits
- Consider implementing caching or pagination

## Project Structure

- **appsscript.json** - Project manifest file
- **main.js** - Main file containing basic functions required by Looker Studio
- **auth.js** - Code handling OAuth 2.0 authentication with Facebook API
- **data.js** - Logic for retrieving data from Facebook API
- **util.js** - Helper functions
- **callback.html** - HTML template displayed after OAuth authorization

## API Functions

### Facebook Graph API

This connector uses the following Facebook Graph API endpoints:

1. **Page posts**
   - Endpoint: `GET /{page-id}/posts`
   - Documentation: [Facebook Graph API - Posts](https://developers.facebook.com/docs/graph-api/reference/page/posts/)

2. **Post insights**
   - Endpoint: `GET /{post-id}/insights`
   - Documentation: [Facebook Graph API - Post Insights](https://developers.facebook.com/docs/graph-api/reference/post/insights/)

3. **User pages**
   - Endpoint: `GET /me/accounts`
   - Documentation: [Facebook Graph API - User Accounts](https://developers.facebook.com/docs/graph-api/reference/user/accounts/)

## License

This project is distributed under the MIT License. See the LICENSE file for more information.

---

Created with ❤️ for the Looker Studio community
