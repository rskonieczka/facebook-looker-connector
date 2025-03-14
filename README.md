# Facebook Page Stats Connector dla Looker Studio

Community Connector dla Looker Studio umożliwiający pobieranie i analizowanie statystyk postów z wybranych stron na Facebooku.

## Spis treści

- [Wprowadzenie](#wprowadzenie)
- [Funkcjonalności](#funkcjonalności)
- [Wymagania wstępne](#wymagania-wstępne)
- [Instalacja](#instalacja)
  - [Utworzenie aplikacji Facebook](#utworzenie-aplikacji-facebook)
  - [Konfiguracja Apps Script](#konfiguracja-apps-script)
  - [Wdrożenie connectora](#wdrożenie-connectora)
- [Konfiguracja w Looker Studio](#konfiguracja-w-looker-studio)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)
- [Struktura projektu](#struktura-projektu)
- [Funkcje API](#funkcje-api)
- [Licencja](#licencja)

## Wprowadzenie

Facebook Page Stats Connector pozwala użytkownikom Looker Studio na pobieranie i wizualizację danych statystycznych dotyczących postów z wybranych stron na Facebooku. Za pomocą tego narzędzia można analizować:
- Statystyki zaangażowania użytkowników
- Dane o reakcjach
- Zasięg i wyświetlenia postów
- Oraz inne metryki dostępne przez Facebook Graph API

## Funkcjonalności

- Uwierzytelnianie przez OAuth 2.0 z Facebook API
- Wybór strony Facebook do analizy
- Określenie zakresu dat dla danych
- Wybór rodzaju statystyk do analizy
- Pobieranie metryk takich jak polubienia, komentarze, udostępnienia, zasięg itp.
- Pełna integracja z interfejsem Looker Studio

## Wymagania wstępne

- Konto Google (do utworzenia Apps Script)
- Konto na Facebooku z dostępem do Facebook Developers
- Uprawnienia administratora do co najmniej jednej strony na Facebooku
- Dostęp do Looker Studio (dawniej Google Data Studio)

## Instalacja

### Utworzenie aplikacji Facebook

1. **Zarejestruj się jako deweloper:**
   - Przejdź do [Facebook Developers](https://developers.facebook.com/)
   - Zaloguj się na swoje konto Facebook
   - Jeśli nie masz jeszcze konta deweloperskiego, zarejestruj się

2. **Utwórz nową aplikację:**
   - Kliknij "Moje aplikacje" w prawym górnym rogu
   - Wybierz "Utwórz aplikację"
   - Wybierz typ aplikacji (zalecany: "Witryna" lub "Firma")
   - Wprowadź nazwę aplikacji (np. "Mój Looker Studio Connector")
   - Podaj swój adres e-mail dla kontaktu
   - Kliknij "Utwórz aplikację"

3. **Skonfiguruj Facebook Login:**
   - W panelu aplikacji przejdź do sekcji "Dodaj produkty"
   - Znajdź i kliknij "Facebook Login" i wybierz "Skonfiguruj"
   - W ustawieniach Facebook Login:
     - W polu "Ważne adresy URL" dodaj:
       - Adres URL przekierowania OAuth: `https://script.google.com/macros/d/{TWÓJ_ID_DEPLOYMENTU}/usercallback`
       (Uwaga: ID deploymentu będzie dostępny po wdrożeniu Apps Script - tymczasowo możesz dodać `https://script.google.com`)
     - Zapisz zmiany

4. **Skonfiguruj uprawnienia:**
   - W menu po lewej stronie kliknij "Przegląd aplikacji" 
   - Przejdź do sekcji "Uprawnienia i funkcje aplikacji"
   - Dodaj następujące uprawnienia:
     - `pages_read_engagement`
     - `pages_show_list`
     - `pages_read_user_content`
   - Dla każdego uprawnienia podaj uzasadnienie (np. "Do pobierania danych statystycznych o postach na stronach Facebook do analizy w Looker Studio")

5. **Pobierz CLIENT_ID i CLIENT_SECRET:**
   - W menu po lewej stronie kliknij "Ustawienia" i wybierz "Podstawowe"
   - Zapisz:
     - Identyfikator aplikacji (App ID) - to będzie Twój CLIENT_ID
     - Klucz tajny aplikacji (App Secret) - to będzie Twój CLIENT_SECRET

### Konfiguracja Apps Script

1. **Utwórz nowy projekt Apps Script:**
   - Przejdź do [Google Apps Script](https://script.google.com/)
   - Kliknij "Nowy projekt"
   - Nadaj projektowi nazwę (np. "Facebook Page Stats Connector")

2. **Dodaj pliki do projektu:**
   - Skopiuj i wklej wszystkie pliki z tego repozytorium do swojego projektu Apps Script:
     - `appsscript.json`
     - `main.js`
     - `auth.js`
     - `data.js`
     - `util.js`
     - `callback.html`

3. **Zaktualizuj dane uwierzytelniania:**
   - Otwórz plik `auth.js`
   - Zastąp wartości placeholderów rzeczywistymi danymi z Twojej aplikacji Facebook:
   ```javascript
   var CLIENT_ID = 'TWÓJ_IDENTYFIKATOR_APLIKACJI';
   var CLIENT_SECRET = 'TWÓJ_KLUCZ_TAJNY_APLIKACJI';
   ```

4. **Dodaj bibliotekę OAuth2:**
   - W środowisku Apps Script kliknij na "+" obok "Biblioteki" w panelu bocznym
   - Wprowadź ID biblioteki: `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF`
   - Kliknij "Wyszukaj"
   - Wybierz najnowszą wersję
   - Kliknij "Dodaj"

### Wdrożenie connectora

1. **Przygotuj do wdrożenia:**
   - W środowisku Apps Script kliknij "Wdróż" > "Nowe wdrożenie"
   - Wybierz typ: "Community Connector"
   - Dodaj opis wdrożenia (np. "Pierwsza wersja")
   - Kliknij "Wdróż"

2. **Pobierz ID deploymentu:**
   - Po wdrożeniu zobaczysz ID deploymentu w formacie `AKfycbXXXXXXXXXXXXXXXXXXX`
   - Zapisz ten ID

3. **Zaktualizuj adres URL przekierowania w aplikacji Facebook:**
   - Wróć do ustawień Facebook Login w swojej aplikacji Facebook
   - Zaktualizuj adres URL przekierowania na:
     `https://script.google.com/macros/d/{TWÓJ_ID_DEPLOYMENTU}/usercallback`
   - Zastąp `{TWÓJ_ID_DEPLOYMENTU}` ID, który właśnie otrzymałeś

4. **Opublikuj connector (opcjonalnie):**
   - Aby udostępnić connector innym użytkownikom, musisz przesłać aplikację Facebook do weryfikacji
   - W panelu aplikacji Facebook przejdź do "Przegląd aplikacji"
   - Kliknij przycisk "Prześlij do weryfikacji"
   - Wypełnij wymagane informacje i prześlij formularz

## Konfiguracja w Looker Studio

1. **Dodaj connector do Looker Studio:**
   - Przejdź do [Looker Studio](https://lookerstudio.google.com/)
   - Utwórz nowy raport
   - Kliknij "Dodaj dane"
   - W zakładce "Społecznościowe oprogramowanie sprzęgające" znajdź swój connector
     (Uwaga: Jeśli nie opublikowałeś connectora, będzie on widoczny tylko dla Ciebie)

2. **Autoryzacja z Facebookiem:**
   - Kliknij swój connector
   - Zostaniesz poproszony o zalogowanie się do Facebooka i udzielenie zgód
   - Autoryzuj aplikację

3. **Konfiguracja connectora:**
   - Po autoryzacji wprowadź:
     - Identyfikator strony na Facebooku (możesz go znaleźć w adresie URL strony)
     - Wybierz typ statystyk (podstawowe, zaangażowanie, reakcje)
     - Określ zakres dat
   - Kliknij "Połącz"

4. **Tworzenie raportu:**
   - Po połączeniu z danymi możesz rozpocząć tworzenie wizualizacji
   - Dostępne metryki:
     - ID Posta
     - Data Publikacji
     - Typ Posta
     - Treść Posta
     - Polubienia
     - Komentarze
     - Udostępnienia
     - Zasięg
     - Wyświetlenia
     - Zaangażowanie

## Rozwiązywanie problemów

### Problem z uwierzytelnianiem
- Sprawdź, czy URL przekierowania w aplikacji Facebook jest poprawny
- Upewnij się, że aplikacja Facebook ma poprawnie skonfigurowane uprawnienia
- Sprawdź, czy CLIENT_ID i CLIENT_SECRET są poprawnie wprowadzone w pliku `auth.js`

### Brak danych
- Upewnij się, że masz uprawnienia administratora do podanej strony Facebook
- Sprawdź, czy identyfikator strony jest poprawny
- Weryfikuj, czy wybrana strona ma posty w określonym zakresie dat

### Limity API
- Facebook API ma limity częstotliwości zapytań
- Jeśli masz dużą liczbę postów, możesz napotkać limity
- Rozważ implementację buforowania lub paginacji

## Struktura projektu

- **appsscript.json** - Plik manifestu projektu
- **main.js** - Główny plik zawierający podstawowe funkcje wymagane przez Looker Studio
- **auth.js** - Kod obsługujący uwierzytelnianie OAuth 2.0 z Facebook API
- **data.js** - Logika pobierania danych z Facebook API
- **util.js** - Funkcje pomocnicze
- **callback.html** - Szablon HTML wyświetlany po autoryzacji OAuth

## Funkcje API

### Facebook Graph API

Ten connector korzysta z następujących endpointów Facebook Graph API:

1. **Posty strony**
   - Endpoint: `GET /{page-id}/posts`
   - Dokumentacja: [Facebook Graph API - Posts](https://developers.facebook.com/docs/graph-api/reference/page/posts/)

2. **Statystyki postów**
   - Endpoint: `GET /{post-id}/insights`
   - Dokumentacja: [Facebook Graph API - Post Insights](https://developers.facebook.com/docs/graph-api/reference/post/insights/)

3. **Strony użytkownika**
   - Endpoint: `GET /me/accounts`
   - Dokumentacja: [Facebook Graph API - User Accounts](https://developers.facebook.com/docs/graph-api/reference/user/accounts/)

## Licencja

Ten projekt jest udostępniany na licencji MIT. Zobacz plik LICENSE, aby uzyskać więcej informacji.

---

Stworzony z ❤️ dla społeczności Looker Studio
