/**
 * Facebook Page Stats Connector dla Looker Studio.
 * Ten connector pozwala na pobieranie statystyk postów z wybranej strony na Facebooku.
 */

// Tworzenie obiektu Community Connector
var cc = DataStudioApp.createCommunityConnector();
var DEFAULT_PACKAGE = 'facebook';

/**
 * Funkcja wywoływana po załadowaniu.
 * @return {object} Obiekt zawierający funkcje getAuthType i isAdminUser.
 */
function getAuthType() {
  return getOAuthService().getAuthType();
}

/**
 * Określa, czy bieżący użytkownik jest administratorem.
 * @return {boolean} Czy użytkownik jest administratorem.
 */
function isAdminUser() {
  return false;
}

/**
 * Zwraca konfigurację connectora.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {object} Zbudowany obiekt konfiguracji.
 */
function getConfig(request) {
  var config = cc.getConfig();
  
  config
    .newInfo()
    .setId('instructions')
    .setText('Wprowadź identyfikator strony na Facebooku, aby pobrać statystyki postów.');

  config
    .newTextInput()
    .setId('pageId')
    .setName('Identyfikator strony na Facebooku')
    .setHelpText('np. "123456789"')
    .setPlaceholder('Identyfikator strony')
    .setAllowOverride(true);

  config
    .newSelectSingle()
    .setId('metricType')
    .setName('Typ statystyk')
    .setHelpText('Wybierz typ statystyk do wyświetlenia')
    .addOption(config.newOptionBuilder().setLabel('Podstawowe').setValue('basic'))
    .addOption(config.newOptionBuilder().setLabel('Zaangażowanie').setValue('engagement'))
    .addOption(config.newOptionBuilder().setLabel('Reakcje').setValue('reactions'));

  config.setDateRangeRequired(true);

  return config.build();
}

/**
 * Definiuje schemat danych.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {object} Schemat danych.
 */
function getSchema(request) {
  return { schema: getFields().build() };
}

/**
 * Definiuje pola danych dostępne w connectorze.
 * @return {object} Obiekt Fields z zdefiniowanymi polami.
 */
function getFields() {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields
    .newDimension()
    .setId('postId')
    .setName('ID Posta')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('postDate')
    .setName('Data Publikacji')
    .setType(types.YEAR_MONTH_DAY);

  fields
    .newDimension()
    .setId('postType')
    .setName('Typ Posta')
    .setType(types.TEXT);

  fields
    .newDimension()
    .setId('postMessage')
    .setName('Treść Posta')
    .setType(types.TEXT);

  fields
    .newMetric()
    .setId('likes')
    .setName('Polubienia')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newMetric()
    .setId('comments')
    .setName('Komentarze')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newMetric()
    .setId('shares')
    .setName('Udostępnienia')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newMetric()
    .setId('reach')
    .setName('Zasięg')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newMetric()
    .setId('impressions')
    .setName('Wyświetlenia')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  fields
    .newMetric()
    .setId('engagement')
    .setName('Zaangażowanie')
    .setType(types.NUMBER)
    .setAggregation(aggregations.SUM);

  return fields;
}

/**
 * Pobiera dane na podstawie zapytania.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {object} Obiekt zawierający schemat i wiersze danych.
 */
function getData(request) {
  try {
    // Weryfikacja parametrów konfiguracyjnych
    request.configParams = validateConfig(request.configParams);

    // Pobierz pola żądane przez użytkownika
    var requestedFields = getFields().forIds(
      request.fields.map(function(field) {
        return field.name;
      })
    );

    // Pobranie danych z API Facebooka
    var apiResponse = fetchDataFromAPI(request);
    
    // Konwersja odpowiedzi API na format odpowiedni dla Looker Studio
    var formattedData = formatData(apiResponse, requestedFields, request);

    // Zwróć dane
    return {
      schema: requestedFields.build(),
      rows: formattedData
    };
  } catch (e) {
    cc.newUserError()
      .setDebugText('Błąd podczas pobierania danych z API: ' + e)
      .setText('Wystąpił błąd podczas pobierania danych. Spróbuj ponownie później lub zgłoś problem, jeśli błąd będzie się powtarzał.')
      .throwException();
  }
}

/**
 * Waliduje parametry konfiguracyjne.
 * @param {object} configParams Obiekt zawierający parametry konfiguracyjne.
 * @return {object} Zwalidowane parametry konfiguracyjne.
 */
function validateConfig(configParams) {
  if (!configParams) {
    configParams = {};
  }

  // Weryfikacja identyfikatora strony
  if (!configParams.pageId) {
    cc.newUserError()
      .setText('Proszę podać identyfikator strony na Facebooku.')
      .throwException();
  }

  // Weryfikacja typu statystyk
  if (!configParams.metricType) {
    configParams.metricType = 'basic';
  }

  return configParams;
}

/**
 * Pobiera dane z API Facebooka.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {object} Odpowiedź z API Facebooka.
 */
function fetchDataFromAPI(request) {
  // Tutaj dodamy później rzeczywistą implementację
  // Teraz zwracamy przykładowe dane
  return getMockData(request);
}

/**
 * Formatuje dane do formatu wymaganego przez Looker Studio.
 * @param {object} apiResponse Odpowiedź z API.
 * @param {object} requestedFields Żądane pola.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {Array} Tablica wierszy danych.
 */
function formatData(apiResponse, requestedFields, request) {
  var data = [];
  
  // Przetwarzanie danych z API na format wymagany przez Looker Studio
  // Tutaj dodamy później rzeczywistą implementację
  
  // Dla teraz zwracamy przykładowe dane
  return formatMockData(apiResponse, requestedFields);
}

/**
 * Zwraca przykładowe dane do testów.
 * @param {object} request Obiekt zawierający informacje o żądaniu.
 * @return {object} Przykładowe dane.
 */
function getMockData(request) {
  return {
    posts: [
      {
        id: '123456789_111111111',
        created_time: '2025-03-01T10:00:00+0000',
        type: 'status',
        message: 'Przykładowy post na Facebooku',
        likes: 50,
        comments: 10,
        shares: 5,
        reach: 1000,
        impressions: 1500,
        engagement: 65
      },
      {
        id: '123456789_222222222',
        created_time: '2025-03-02T14:30:00+0000',
        type: 'link',
        message: 'Ciekawy artykuł',
        likes: 120,
        comments: 25,
        shares: 30,
        reach: 2500,
        impressions: 3000,
        engagement: 175
      },
      {
        id: '123456789_333333333',
        created_time: '2025-03-05T09:15:00+0000',
        type: 'photo',
        message: 'Piękne zdjęcie z naszego wydarzenia',
        likes: 300,
        comments: 45,
        shares: 80,
        reach: 5000,
        impressions: 6200,
        engagement: 425
      }
    ]
  };
}

/**
 * Formatuje przykładowe dane.
 * @param {object} mockData Przykładowe dane.
 * @param {object} requestedFields Żądane pola.
 * @return {Array} Sformatowane dane.
 */
function formatMockData(mockData, requestedFields) {
  return mockData.posts.map(function(post) {
    var row = [];
    
    requestedFields.asArray().forEach(function(field) {
      switch (field.getId()) {
        case 'postId':
          row.push(post.id);
          break;
        case 'postDate':
          var date = new Date(post.created_time);
          row.push(formatDate(date));
          break;
        case 'postType':
          row.push(post.type);
          break;
        case 'postMessage':
          row.push(post.message);
          break;
        case 'likes':
          row.push(post.likes);
          break;
        case 'comments':
          row.push(post.comments);
          break;
        case 'shares':
          row.push(post.shares);
          break;
        case 'reach':
          row.push(post.reach);
          break;
        case 'impressions':
          row.push(post.impressions);
          break;
        case 'engagement':
          row.push(post.engagement);
          break;
        default:
          row.push('');
      }
    });
    
    return { values: row };
  });
}

/**
 * Formatuje datę do formatu YYYYMMDD.
 * @param {Date} date Obiekt daty.
 * @return {string} Sformatowana data.
 */
function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  
  return year + month + day;
}
