/**
 * Plik zawierający funkcje do pobierania i przetwarzania danych z Facebook API.
 */

/**
 * Pobiera dane o postach z określonej strony na Facebooku.
 * @param {string} pageId Identyfikator strony na Facebooku.
 * @param {string} accessToken Token dostępu do Facebook API.
 * @param {string} startDate Data początkowa zakresu w formacie YYYY-MM-DD.
 * @param {string} endDate Data końcowa zakresu w formacie YYYY-MM-DD.
 * @param {string} metricType Typ żądanych statystyk (basic, engagement, reactions).
 * @return {object} Dane o postach.
 */
function getPagePosts(pageId, accessToken, startDate, endDate, metricType) {
  // Przygotowanie filtra czasowego
  var since = new Date(startDate).getTime() / 1000;
  var until = new Date(endDate).getTime() / 1000;
  
  // Określenie pól do pobrania w zależności od wybranego typu statystyk
  var fields = getFieldsForMetricType(metricType);
  
  // Przygotowanie URL do API Facebooka
  var url = 'https://graph.facebook.com/v18.0/' +
    pageId + '/posts' +
    '?fields=' + fields +
    '&since=' + since +
    '&until=' + until +
    '&limit=100' +
    '&access_token=' + accessToken;
  
  // Pobranie danych z API
  var response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true
  });
  
  var result = JSON.parse(response.getContentText());
  
  // Sprawdzenie, czy wystąpił błąd
  if (result.error) {
    throw new Error('Błąd Facebook API: ' + result.error.message);
  }
  
  // Pobieranie wszystkich stron wyników (jeśli jest paginacja)
  var allPosts = [];
  if (result.data) {
    allPosts = result.data;
    
    // Obsługa paginacji
    while (result.paging && result.paging.next) {
      response = UrlFetchApp.fetch(result.paging.next, {
        muteHttpExceptions: true
      });
      
      result = JSON.parse(response.getContentText());
      
      if (result.error) {
        throw new Error('Błąd Facebook API: ' + result.error.message);
      }
      
      if (result.data) {
        allPosts = allPosts.concat(result.data);
      }
    }
  }
  
  // Pobranie dodatkowych metryk dla każdego posta
  allPosts = getAdditionalMetrics(allPosts, accessToken, metricType);
  
  return { posts: allPosts };
}

/**
 * Określa, jakie pola mają być pobrane z API w zależności od typu metryk.
 * @param {string} metricType Typ żądanych statystyk.
 * @return {string} Lista pól do pobrania.
 */
function getFieldsForMetricType(metricType) {
  var basicFields = 'id,created_time,type,message,permalink_url';
  
  switch (metricType) {
    case 'engagement':
      return basicFields + ',shares,comments.summary(true),reactions.summary(true)';
    case 'reactions':
      return basicFields + ',reactions.type(LIKE).summary(total_count).as(likes)' +
        ',reactions.type(LOVE).summary(total_count).as(love)' +
        ',reactions.type(WOW).summary(total_count).as(wow)' +
        ',reactions.type(HAHA).summary(total_count).as(haha)' +
        ',reactions.type(SAD).summary(total_count).as(sad)' +
        ',reactions.type(ANGRY).summary(total_count).as(angry)';
    case 'basic':
    default:
      return basicFields + ',shares,comments.summary(true),reactions.summary(true)';
  }
}

/**
 * Pobiera dodatkowe metryki dla postów.
 * @param {Array} posts Lista postów.
 * @param {string} accessToken Token dostępu do Facebook API.
 * @param {string} metricType Typ żądanych statystyk.
 * @return {Array} Lista postów z dodatkowymi metrykami.
 */
function getAdditionalMetrics(posts, accessToken, metricType) {
  return posts.map(function(post) {
    // Dodanie podstawowych metryk
    post.likes = (post.reactions && post.reactions.summary) ? post.reactions.summary.total_count : 0;
    post.comments = (post.comments && post.comments.summary) ? post.comments.summary.total_count : 0;
    post.shares = (post.shares) ? post.shares.count : 0;
    
    // Dodanie dodatkowych metryk
    if (metricType === 'engagement' || metricType === 'basic') {
      try {
        // Pobieranie statystyk zaangażowania
        var insightsUrl = 'https://graph.facebook.com/v18.0/' +
          post.id + '/insights' +
          '?metric=post_impressions,post_impressions_unique,post_engaged_users' +
          '&access_token=' + accessToken;
        
        var insightsResponse = UrlFetchApp.fetch(insightsUrl, {
          muteHttpExceptions: true
        });
        
        var insightsResult = JSON.parse(insightsResponse.getContentText());
        
        if (!insightsResult.error && insightsResult.data) {
          insightsResult.data.forEach(function(insight) {
            if (insight.name === 'post_impressions') {
              post.impressions = insight.values[0].value;
            } else if (insight.name === 'post_impressions_unique') {
              post.reach = insight.values[0].value;
            } else if (insight.name === 'post_engaged_users') {
              post.engagement = insight.values[0].value;
            }
          });
        }
      } catch (e) {
        console.log('Błąd podczas pobierania dodatkowych metryk: ' + e);
        // W przypadku błędu, ustawienie wartości domyślnych
        post.impressions = post.impressions || 0;
        post.reach = post.reach || 0;
        post.engagement = post.engagement || 0;
      }
    }
    
    // Przypisanie domyślnych wartości, jeśli brakuje danych
    post.impressions = post.impressions || 0;
    post.reach = post.reach || 0;
    post.engagement = post.engagement || 0;
    
    return post;
  });
}

/**
 * Pobiera listę stron, do których użytkownik ma dostęp.
 * @param {string} accessToken Token dostępu do Facebook API.
 * @return {Array} Lista stron.
 */
function getUserPages(accessToken) {
  var url = 'https://graph.facebook.com/v18.0/me/accounts?access_token=' + accessToken;
  
  var response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true
  });
  
  var result = JSON.parse(response.getContentText());
  
  if (result.error) {
    throw new Error('Błąd Facebook API: ' + result.error.message);
  }
  
  return result.data || [];
}
