/**
 * Plik zawierający funkcje pomocnicze dla Facebook Page Stats Connectora.
 */

/**
 * Zapisuje informacje debugowania do dziennika.
 * @param {string} message Wiadomość do zapisania.
 */
function logDebug(message) {
  console.log('[Facebook Page Stats Connector] ' + message);
}

/**
 * Konwertuje datę z formatu YYYY-MM-DD na format akceptowany przez Facebook API.
 * @param {string} dateString Data w formacie YYYY-MM-DD.
 * @return {string} Data w formacie YYYY-MM-DDT00:00:00+0000.
 */
function formatDateForFacebook(dateString) {
  return dateString + 'T00:00:00+0000';
}

/**
 * Formatuje datę do formatu YYYYMMDD wymaganego przez Looker Studio.
 * @param {string|Date} date Data lub ciąg znaków reprezentujący datę.
 * @return {string} Data w formacie YYYYMMDD.
 */
function formatDateForLookerStudio(date) {
  var dateObj = (typeof date === 'string') ? new Date(date) : date;
  
  var year = dateObj.getFullYear();
  var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  var day = ('0' + dateObj.getDate()).slice(-2);
  
  return year + month + day;
}

/**
 * Sprawdza, czy obiekt jest pusty.
 * @param {object} obj Obiekt do sprawdzenia.
 * @return {boolean} Czy obiekt jest pusty.
 */
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Bezpieczne parsowanie JSON.
 * @param {string} str Ciąg znaków JSON do parsowania.
 * @param {object} defaultValue Wartość domyślna, jeśli parsowanie się nie powiedzie.
 * @return {object} Sparsowany obiekt JSON lub wartość domyślna.
 */
function safeJsonParse(str, defaultValue) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue || {};
  }
}

/**
 * Sprawdza, czy tablica zawiera wartość.
 * @param {Array} array Tablica do przeszukania.
 * @param {*} value Wartość do znalezienia.
 * @return {boolean} Czy tablica zawiera wartość.
 */
function arrayContains(array, value) {
  return array.indexOf(value) !== -1;
}

/**
 * Łączy obiekty w jeden obiekt.
 * @param {...object} objects Obiekty do połączenia.
 * @return {object} Połączony obiekt.
 */
function mergeObjects() {
  var result = {};
  for (var i = 0; i < arguments.length; i++) {
    var obj = arguments[i];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * Konwertuje paramerty zapytania na obiekt.
 * @param {string} queryString Ciąg znaków zapytania (bez znaku '?').
 * @return {object} Obiekt z parametrami zapytania.
 */
function parseQueryParams(queryString) {
  var params = {};
  if (!queryString) {
    return params;
  }
  
  var pairs = queryString.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    var value = pair.length > 1 ? decodeURIComponent(pair[1]) : '';
    params[key] = value;
  }
  
  return params;
}

/**
 * Usuwa puste, null lub undefined wartości z obiektu.
 * @param {object} obj Obiekt do oczyszczenia.
 * @return {object} Oczyszczony obiekt.
 */
function removeEmptyValues(obj) {
  var result = {};
  for (var key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Sprawdza, czy ciąg znaków jest poprawnym identyfikatorem strony na Facebooku.
 * @param {string} pageId Identyfikator do sprawdzenia.
 * @return {boolean} Czy identyfikator jest poprawny.
 */
function isValidPageId(pageId) {
  // Proste sprawdzenie, czy pageId zawiera tylko cyfry lub poprawny format username
  return /^[0-9]+$/.test(pageId) || /^[a-zA-Z0-9.]+$/.test(pageId);
}

/**
 * Czyści tekst z niepotrzebnych znaków specjalnych, emoji, itd.
 * @param {string} text Tekst do oczyszczenia.
 * @return {string} Oczyszczony tekst.
 */
function sanitizeText(text) {
  if (!text) {
    return '';
  }
  
  // Usunięcie emoji i znaków specjalnych, które mogą powodować problemy
  return text
    .replace(/[\u{10000}-\u{10FFFF}]/gu, '')
    .replace(/[\u0800-\u9FFF]/g, '')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim();
}
