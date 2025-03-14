/**
 * Plik obsługujący uwierzytelnianie OAuth 2.0 dla Facebook API.
 */

/**
 * Tworzy i konfiguruje usługę OAuth2.
 * @return {object} Skonfigurowana usługa OAuth2.
 */
function getOAuthService() {
  // W rzeczywistym wdrożeniu należy używać własnego ID klienta i tajnego klucza
  // Te dane są przykładowe i należy je zastąpić rzeczywistymi danymi
  var CLIENT_ID = 'TWÓJ_CLIENT_ID';
  var CLIENT_SECRET = 'TWÓJ_CLIENT_SECRET';

  var propertyStore = PropertiesService.getUserProperties();
  
  return OAuth2.createService('facebook')
    .setAuthorizationBaseUrl('https://www.facebook.com/v18.0/dialog/oauth')
    .setTokenUrl('https://graph.facebook.com/v18.0/oauth/access_token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setPropertyStore(propertyStore)
    .setCallbackFunction('authCallback')
    .setScope('pages_read_engagement,pages_show_list,pages_read_user_content')
    .setParam('response_type', 'code')
    .setParam('state', ScriptApp.newStateToken().createToken())
    .setTokenHeaders({
      'Authorization': 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
}

/**
 * Callback dla OAuth.
 * @param {object} request Obiekt żądania.
 * @return {HtmlOutput} Strona HTML z potwierdzeniem lub błędem uwierzytelniania.
 */
function authCallback(request) {
  var authorized = getOAuthService().handleCallback(request);
  var template = HtmlService.createTemplateFromFile('callback');
  template.authorized = authorized;
  return template.evaluate();
}

/**
 * Resetuje OAuth dla użytkownika.
 */
function resetAuth() {
  getOAuthService().reset();
}

/**
 * Obsługuje odpowiedź OAUTH.
 * @param {object} request Obiekt żądania.
 * @return {object} Obiekt odpowiedzi OAUTH.
 */
function isAuthValid() {
  var service = getOAuthService();
  if (service.hasAccess()) {
    // Opcjonalne: weryfikacja, czy token jest nadal ważny
    try {
      var response = UrlFetchApp.fetch(
        'https://graph.facebook.com/v18.0/me',
        {
          headers: {
            Authorization: 'Bearer ' + service.getAccessToken()
          },
          muteHttpExceptions: true
        }
      );
      var result = JSON.parse(response.getContentText());
      return !result.error;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
}

/**
 * Zwraca URL do autoryzacji.
 * @return {string} URL do autoryzacji.
 */
function get3PAuthorizationUrls() {
  return getOAuthService().getAuthorizationUrl();
}

/**
 * Resetuje uwierzytelnianie.
 */
function resetAuth() {
  getOAuthService().reset();
}

/**
 * Obsługuje odpowiedź.
 * @param {object} request Żądanie od Looker Studio.
 * @return {object} Odpowiedź do przekazania do Looker Studio.
 */
function authCallback(request) {
  var service = getOAuthService();
  var isAuthorized = service.handleCallback(request);
  
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Autoryzacja zakończona pomyślnie! Możesz zamknąć to okno.');
  } else {
    return HtmlService.createHtmlOutput('Autoryzacja nie powiodła się. Spróbuj ponownie.');
  }
}
