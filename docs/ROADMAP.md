# ROADMAP — aplikacja zaproszeń weselnych online

## 0. Kontekst projektu

Budujemy aplikację SaaS do tworzenia internetowych zaproszeń weselnych.

### Stack

- Next.js
- React
- TypeScript
- Supabase:
  - Auth
  - PostgreSQL
  - Storage
  - Row Level Security
- Vercel
- wildcard subdomains

Docelowe adresy:

```text
twojadomena.pl
app.twojadomena.pl
*.twojadomena.pl
```

Przykład zaproszenia:

```text
ania-piotr.twojadomena.pl
```

### Co jest już gotowe

- landing page
- formularz logowania

Nie przebudowuj tych elementów bez wyraźnej potrzeby.

Można je:

- podłączyć do Supabase Auth,
- rozszerzyć o rejestrację,
- rozszerzyć o wybór subdomeny,
- podłączyć do właściwego routingu.

Nie należy bez potrzeby zmieniać ich designu.

---

# 1. Główny flow aplikacji

Docelowy flow użytkownika:

```text
LANDING
  ↓
REJESTRACJA + WYBÓR SUBDOMENY
lub
LOGOWANIE
  ↓
DASHBOARD
  ↓
UTWÓRZ WESELE
  ↓
EDYTOR
  ↓
WYBÓR TEMPLATE
  ↓
PREVIEW
  ↓
PUBLIKACJA
  ↓
PUBLICZNE ZAPROSZENIE
  ↓
GOŚCIE
  ↓
INDYWIDUALNE LINKI
  ↓
RSVP
```

## Ważne założenie

Subdomena wybrana podczas rejestracji jest na początku tylko **rezerwacją slug**.

Przykład:

```text
Anna + Piotr
↓
użytkownik wybiera:
ania-piotr
↓
rezerwujemy:
ania-piotr.twojadomena.pl
```

Dopiero po kliknięciu:

```text
UTWÓRZ WESELE
```

powstaje właściwy `event`, a zarezerwowany slug zostaje do niego przypisany.

Dzięki temu:

- flow rejestracji pozostaje prosty,
- subdomena jest zabezpieczona od początku,
- później można obsłużyć wiele eventów na jednym koncie,
- rejestracja nie musi od razu tworzyć pełnego eventu.

---

# 2. Główna zasada architektury

Nie tworzymy osobnej aplikacji ani osobnego deploymentu dla każdej pary.

Budujemy jedną aplikację multi-tenant:

```text
Next.js
   ↓
hostname / slug resolution
   ↓
event
   ↓
publication
   ↓
template
   ↓
render
```

Przykładowe adresy:

```text
ania-piotr.twojadomena.pl
kasia-marek.twojadomena.pl
ola-tomek.twojadomena.pl
```

obsługuje ten sam projekt Next.js.

---

# 3. Zasady pracy dla agenta

Przed rozpoczęciem każdego sprintu:

1. Przeanalizuj istniejący kod.
2. Nie przepisuj działających elementów bez potrzeby.
3. Nie przebudowuj istniejącego landing page.
4. Nie zmieniaj designu istniejącego formularza logowania bez potrzeby.
5. Zachowuj TypeScript strict.
6. Preferuj Server Components tam, gdzie nie jest potrzebna interakcja.
7. Client Components stosuj dla elementów interaktywnych.
8. Oddzielaj logikę biznesową od UI.
9. Nie duplikuj logiki pobierania danych.
10. Nie używaj Supabase `service_role` po stronie klienta.
11. Wszystkie sekrety trzymaj w ENV.
12. Każda operacja na danych użytkownika musi uwzględniać autoryzację.
13. Wszystkie prywatne tabele muszą uwzględniać RLS.
14. Nie implementuj przyszłych sprintów, jeśli nie są wymagane jako dependency.
15. Każdy sprint ma kończyć się działającym, testowalnym stanem projektu.

Po zakończeniu każdego sprintu:

1. wypisz zmienione pliki,
2. opisz migracje DB,
3. wypisz nowe ENV,
4. opisz sposób ręcznego testowania,
5. wypisz TODO,
6. nie przechodź samodzielnie do kolejnego sprintu.

---

# 4. Model danych

Docelowe główne encje:

```text
auth.users

profiles
subdomain_reservations

events
event_members

event_drafts
event_publications

templates / template registry

assets

guests
rsvps
```

Na początku obsługujemy:

```text
event.type = wedding
```

Architektura powinna jednak pozwalać później dodać:

```text
birthday
communion
baptism
anniversary
corporate_event
```

bez przepisywania całego backendu.

---

# 5. Rendering

Stosuj model hybrydowy.

| Obszar                   | Rendering                       |
| ------------------------ | ------------------------------- |
| Landing                  | statyczny / cached              |
| Login                    | Server + Client form            |
| Register                 | Server + Client form            |
| Wybór subdomeny          | Client form + server validation |
| Dashboard                | dynamic Server Components       |
| Tworzenie eventu         | Server + Client form            |
| Edytor danych            | SPA-like Client Component       |
| Wybór template           | cached / Client selection       |
| Preview                  | Client + server render test     |
| Publiczne zaproszenie    | cached server render            |
| Indywidualne zaproszenie | dynamic                         |
| RSVP                     | dynamic                         |
| Panel gości              | Server + Client Components      |

Nie buduj całego projektu jako SPA.

---

# SPRINT 0 — Audit istniejącego projektu

**Czas: 0,5–1 dnia**

## Cel

Przygotować aktualny projekt do dalszego rozwoju bez naruszania gotowego landing page i logowania.

## Zadania

Przeanalizuj:

- strukturę projektu,
- App Router,
- TypeScript,
- ESLint,
- aliasy importów,
- istniejący design system,
- istniejące komponenty,
- istniejące ENV,
- aktualną integrację Supabase,
- istniejący formularz logowania.

Jeśli potrzeba, uporządkuj strukturę:

```text
src/
  app/
  components/
  features/
  lib/
  types/
```

Przygotuj miejsce na:

```text
src/lib/supabase/
src/features/auth/
src/features/events/
src/features/editor/
src/features/templates/
src/features/guests/
```

## Nie ruszaj

- designu landing page,
- designu formularza logowania,
- globalnych styli bez konieczności.

## Definition of Done

- aplikacja buduje się,
- nie ma nowych błędów TS,
- landing wygląda jak wcześniej,
- login wygląda jak wcześniej,
- struktura projektu jest gotowa pod kolejne sprinty.

---

# SPRINT 1 — Supabase Auth

**Czas: 1–2 dni**

## Cel

Podłączyć działające uwierzytelnianie.

## Funkcje

Zaimplementuj:

- rejestrację email + password,
- logowanie email + password,
- wylogowanie,
- trwałą sesję,
- odświeżanie sesji,
- ochronę dashboardu.

## Routing

Niezalogowany:

```text
/dashboard
↓
/login
```

Zalogowany użytkownik wchodzący na:

```text
/login
```

powinien zostać przekierowany do:

```text
/dashboard
```

## Supabase

Przygotuj:

```text
src/lib/supabase/client.ts
src/lib/supabase/server.ts
```

oraz aktualny mechanizm obsługi cookies wymagany przez używaną wersję Next.js i Supabase.

## `profiles`

Minimalne pola:

```text
id uuid PK
display_name nullable
created_at
updated_at
```

## Definition of Done

- rejestracja działa,
- login działa,
- logout działa,
- sesja pozostaje po refreshu,
- dashboard jest chroniony.

---

# SPRINT 2 — Rejestracja + wybór subdomeny

**Czas: 1–2 dni**

## Cel

Po rejestracji użytkownik wybiera przyszłą subdomenę swojego zaproszenia.

## Flow

```text
REGISTER
↓
email + password
↓
wybór slug
↓
rezerwacja slug
↓
DASHBOARD
```

## UI

Na rejestracji użytkownik powinien mieć pole:

```text
Adres Twojego zaproszenia

[ ania-piotr ] .twojadomena.pl
```

Pod spodem pokazuj:

```text
Twoje zaproszenie będzie dostępne pod:
https://ania-piotr.twojadomena.pl
```

## Walidacja slug

Slug:

- lowercase,
- bez polskich znaków,
- `a-z`,
- `0-9`,
- `-`,
- bez spacji,
- bez podwójnych myślników,
- bez myślnika na początku i końcu,
- ograniczona długość.

## Reserved slugs

Minimum:

```text
www
app
admin
api
dashboard
login
register
assets
static
support
help
blog
demo
pricing
account
settings
```

## Tabela `subdomain_reservations`

```text
id uuid
user_id uuid
slug text unique
status text
claimed_event_id uuid nullable
created_at
updated_at
expires_at nullable
```

Status:

```text
reserved
claimed
released
```

Na MVP rezerwacja może nie wygasać automatycznie.

## Security

Użytkownik może:

- widzieć swoją rezerwację,
- zmienić własny slug przed publikacją,
- nie może przejąć slug innego użytkownika.

## Definition of Done

- rejestracja tworzy konto,
- użytkownik wybiera slug,
- slug jest sprawdzany w czasie rzeczywistym lub przy submit,
- duplikat nie przechodzi,
- reserved slug nie przechodzi,
- po rejestracji użytkownik trafia do dashboardu,
- slug jest tylko rezerwacją, nie pełnym eventem.

---

# SPRINT 3 — Dashboard po rejestracji

**Czas: 1–2 dni**

## Cel

Po wejściu do aplikacji użytkownik widzi jasny następny krok.

## Dashboard

Route:

```text
/dashboard
```

Dla nowego użytkownika:

```text
Twoja subdomena:
ania-piotr.twojadomena.pl

Nie utworzyłeś jeszcze wesela.

[UTWÓRZ WESELE]
```

Jeżeli event istnieje:

```text
Anna & Piotr
12.06.2027
ania-piotr.twojadomena.pl

[Edytuj]
[Goście]
[Otwórz zaproszenie]
```

## Definition of Done

- nowy użytkownik widzi zarezerwowaną subdomenę,
- widzi CTA „Utwórz wesele”,
- istniejące eventy są widoczne po refreshu,
- dashboard jest pobierany dynamicznie dla zalogowanego użytkownika.

---

# SPRINT 4 — Utwórz wesele

**Czas: 1–2 dni**

## Cel

Zbudować właściwy event i przypisać do niego zarezerwowaną subdomenę.

## Tabela `events`

```text
id uuid PK
type text
slug text unique
owner_id uuid
status text
event_date date nullable
created_at
updated_at
published_at nullable
```

Status:

```text
draft
published
archived
```

## Tabela `event_members`

```text
id uuid
event_id uuid
user_id uuid
role text
created_at
```

Role:

```text
owner
editor
```

## Formularz

Route:

```text
/dashboard/events/new
```

Minimalne pola:

- imię pierwszej osoby,
- imię drugiej osoby,
- data wesela,
- opcjonalnie godzina.

Slug pobierany jest z:

```text
subdomain_reservations
```

## Po utworzeniu

```text
subdomain_reservations.status = claimed
subdomain_reservations.claimed_event_id = event.id
```

Powstaje:

```text
event_members:
user = current user
role = owner
```

## RLS

Włącz RLS dla:

```text
events
event_members
```

Użytkownik A nie może operować na eventach użytkownika B.

## Definition of Done

- event powstaje,
- slug jest przypisany,
- reservation zmienia status na claimed,
- owner membership powstaje,
- event pojawia się w dashboardzie.

---

# SPRINT 5 — Neutralny model konfiguracji zaproszenia

**Czas: 1–2 dni**

## Cel

Zaprojektować dane zaproszenia tak, aby nie zależały od konkretnego template.

To bardzo ważny sprint.

Edytor ma edytować **treść zaproszenia**, a nie template.

## Tabela `event_drafts`

```text
id uuid
event_id uuid unique
config jsonb
version integer
updated_at
```

## Przykładowy config

```json
{
  "couple": {
    "person1": "Anna",
    "person2": "Piotr"
  },
  "event": {
    "date": "2027-06-12",
    "time": "15:00"
  },
  "hero": {
    "title": "Pobieramy się!",
    "subtitle": "Będzie nam miło świętować razem z Wami"
  },
  "ceremony": {
    "name": "",
    "address": ""
  },
  "reception": {
    "name": "",
    "address": ""
  },
  "schedule": [],
  "faq": [],
  "theme": {
    "primaryColor": null
  },
  "sections": {
    "hero": true,
    "locations": true,
    "schedule": true,
    "rsvp": true,
    "faq": false
  }
}
```

## Założenie

Config nie może zawierać pól typu:

```text
classicHeroGoldBorder
modernCardRadius
template2HeaderSize
```

To są szczegóły template i nie powinny trafiać do wspólnego modelu danych.

## Definition of Done

- event posiada draft,
- schema configu jest opisana TypeScript,
- schema jest neutralna względem template,
- dane można walidować.

---

# SPRINT 6 — Edytor danych zaproszenia

**Czas: 2–3 dni**

## Cel

Użytkownik po utworzeniu wesela trafia bezpośrednio do edytora.

Flow:

```text
UTWÓRZ WESELE
↓
EDYTOR
```

## Route

```text
/dashboard/events/[id]/edit
```

## Edytowane sekcje MVP

### Para

- imię 1,
- imię 2.

### Data

- data,
- godzina.

### Hero

- tytuł,
- podtytuł.

### Ceremonia

- nazwa miejsca,
- adres.

### Przyjęcie

- nazwa sali,
- adres.

### Harmonogram

Możliwość dodawania pozycji:

```text
15:00 Ceremonia
17:00 Obiad
20:00 Pierwszy taniec
```

### FAQ

Lista:

```text
pytanie
odpowiedź
```

## Edytor

Edytor ma działać SPA-like.

Dane początkowe:

```text
Server Component
↓
initial draft
↓
Client Editor
```

Dalsze zmiany lokalnie.

## Autosave

Dodaj debounced autosave.

Nie wykonuj requestu przy każdym znaku.

## Ważne

Na tym etapie użytkownik nie musi jeszcze mieć wybranego finalnego template.

Można pokazać prosty, neutralny podgląd treści, ale nie finalny design zaproszenia.

## Definition of Done

- można edytować wszystkie podstawowe informacje,
- autosave działa,
- refresh odtwarza draft,
- editor nie zależy od template,
- użytkownik po utworzeniu eventu trafia do edytora.

---

# SPRINT 7 — Modułowe sekcje

**Czas: 1–2 dni**

## Cel

Pozwolić użytkownikowi decydować, które elementy mają pojawić się w zaproszeniu.

## Sekcje MVP

```text
[x] Hero
[x] Lokalizacje
[x] Harmonogram
[x] RSVP
[x] FAQ
```

Config:

```json
{
  "sections": {
    "hero": true,
    "locations": true,
    "schedule": true,
    "rsvp": true,
    "faq": false
  }
}
```

## Definition of Done

- sekcje można włączać i wyłączać,
- ustawienia zapisują się w draft,
- model danych pozostaje niezależny od template.

---

# SPRINT 8 — System template'ów

**Czas: 2–3 dni**

## Cel

Po uzupełnieniu danych użytkownik wybiera wygląd zaproszenia.

Flow:

```text
EDYTOR
↓
WYBÓR TEMPLATE
```

## Architektura

Template jest komponentem React.

Nie przechowuj gotowego HTML w bazie.

Struktura:

```text
src/features/templates/

  registry.ts

  classic/
    Template.tsx
    metadata.ts
    defaults.ts

  modern/
    Template.tsx
    metadata.ts
    defaults.ts
```

## Registry

Każdy template posiada:

```text
key
version
name
description
thumbnail
component
```

## MVP

Stwórz:

```text
Classic
Modern
```

## Route

```text
/dashboard/events/[id]/template
```

Każda karta template:

- miniatura,
- nazwa,
- opis,
- przycisk „Wybierz”.

## Zapisywanie

Do eventu lub draftu zapisz:

```text
template_key
template_version
```

## Ważne

Template ma otrzymywać ten sam neutralny `config`.

Przykład:

```tsx
<ClassicTemplate config={config} />
<ModernTemplate config={config} />
```

## Definition of Done

- istnieją minimum dwa template,
- oba korzystają z tego samego configu,
- wybór zapisuje się,
- można zmienić template bez utraty danych.

---

# SPRINT 9 — Preview

**Czas: 1–2 dni**

## Cel

Po wybraniu template użytkownik widzi finalny wygląd zaproszenia przed publikacją.

Flow:

```text
WYBÓR TEMPLATE
↓
PREVIEW
```

## Route

```text
/dashboard/events/[id]/preview
```

## Preview

Ma renderować:

```text
selected template
+
current draft config
```

czyli:

```tsx
<InvitationRenderer templateKey={event.template_key} config={draft.config} />
```

## `InvitationRenderer`

Utwórz jeden wspólny renderer wykorzystywany później także przez publiczne zaproszenie.

## Opcje

Preview powinno oferować:

```text
[Wróć do edycji]
[Zmień szablon]
[Opublikuj]
```

## Definition of Done

- finalny template renderuje aktualne dane,
- zmiana template nie zmienia treści,
- preview korzysta z tego samego renderera co publiczna strona.

---

# SPRINT 10 — Publikacja i snapshot

**Czas: 2 dni**

## Cel

Oddzielić wersję roboczą od wersji publicznej.

Flow:

```text
PREVIEW
↓
PUBLIKACJA
```

## Tabela `event_publications`

```text
id uuid
event_id uuid
config jsonb
template_key text
template_version integer
version integer
published_at
```

## Zasada

Publiczna strona nigdy nie czyta:

```text
event_drafts
```

Publiczna strona czyta wyłącznie opublikowany snapshot.

## Publish flow

```text
draft
↓
validation
↓
selected template
↓
create publication snapshot
↓
event.status = published
↓
event.published_at
↓
invalidate public cache
```

## Definition of Done

- draft nie zmienia publicznego zaproszenia,
- publish tworzy snapshot,
- publikacja posiada wersję template,
- ponowna publikacja aktualizuje publiczny stan.

---

# SPRINT 11 — Wildcard subdomains + publiczne zaproszenie

**Czas: 2–3 dni**

## Cel

Udostępnić zaproszenie pod wcześniej wybraną subdomeną.

Flow:

```text
PUBLIKACJA
↓
ania-piotr.twojadomena.pl
```

## Routing

Hostname:

```text
ania-piotr.twojadomena.pl
```

powinien zostać rozpoznany jako:

```text
slug = ania-piotr
```

i wewnętrznie rozwiązany do route:

```text
/w/ania-piotr
```

Bez zmiany URL widocznego w przeglądarce.

## Publiczny route

```text
/w/[slug]
```

Pobiera:

- event,
- aktualną publikację,
- template.

Nie pobiera:

- draftu,
- emaila ownera,
- danych prywatnych,
- listy gości.

## Cache

Publiczne zaproszenie powinno być cachowane.

Po publikacji wykonaj invalidację cache konkretnego eventu.

## Development

Przygotuj testowanie:

```text
ania-piotr.localhost:3000
```

lub bezpieczny fallback developerski.

## Definition of Done

- opublikowany event działa pod subdomeną,
- nieistniejąca subdomena daje 404,
- draft event nie jest publiczny,
- unpublished event nie jest dostępny publicznie,
- zmiany pojawiają się dopiero po ponownym publish.

---

# SPRINT 12 — Supabase Storage

**Czas: 1–2 dni**

## Cel

Dodać zdjęcie hero.

## Storage

Przykładowa struktura:

```text
events/
  {event_id}/
    hero/
    gallery/
```

## MVP

Obsłuż:

- upload hero image,
- podgląd,
- zamianę,
- usunięcie.

## Walidacja

Sprawdź:

- MIME,
- maksymalny rozmiar,
- rozszerzenie.

## Security

Użytkownik może uploadować pliki tylko do eventów, do których ma uprawnienia.

## Config

Nie zapisuj base64 w JSON.

Przechowuj referencję do assetu.

## Definition of Done

- upload działa,
- zdjęcie pojawia się w edytorze,
- po publish pojawia się publicznie,
- user A nie zapisze pliku do eventu B.

---

# SPRINT 13 — Goście

**Czas: 2–3 dni**

## Cel

Po publikacji para może rozpocząć dodawanie gości.

Flow:

```text
PUBLICZNE ZAPROSZENIE
↓
GOŚCIE
```

## Tabela `guests`

```text
id uuid
event_id uuid
name text
email nullable
phone nullable
allowed_plus_ones integer
invite_token_hash text
status text
created_at
updated_at
```

Opcjonalnie:

```text
group_name
```

## Route

```text
/dashboard/events/[id]/guests
```

## Funkcje

- dodaj,
- edytuj,
- usuń,
- liczba osób towarzyszących,
- grupa gości,
- wygeneruj invite token.

## Token

Token:

- kryptograficznie losowy,
- nieprzewidywalny,
- unikalny,
- nie może bazować tylko na ID.

Preferowane:

```text
w DB zapisujemy hash tokenu
```

## Definition of Done

- można zarządzać gośćmi,
- lista jest prywatna,
- RLS działa,
- tokeny są unikalne.

---

# SPRINT 14 — Indywidualne linki

**Czas: 1–2 dni**

## Cel

Każdy gość może otrzymać spersonalizowany link.

Flow:

```text
GOŚCIE
↓
INDYWIDUALNE LINKI
```

Przykład:

```text
https://ania-piotr.twojadomena.pl/i/LOSOWY_TOKEN
```

## Route

Wewnętrznie:

```text
/w/[slug]/i/[token]
```

## Widok

Przykład:

```text
Cześć Jan!

Anna i Piotr zapraszają Cię na swoje wesele.
```

## Security

Token musi należeć do eventu wynikającego z subdomeny.

Warunek:

```text
guest.event_id === resolvedEvent.id
```

Token z innego eventu nie może działać.

## Cache

Strona personalizowana musi być dynamiczna.

Nie cachuj jej w sposób mogący ujawnić dane innego gościa.

## Dashboard

Przy gościu:

```text
[Kopiuj link]
```

## Definition of Done

- każdy gość posiada działający link,
- zły token daje błąd/404,
- token innego eventu nie działa,
- link identyfikuje właściwego gościa.

---

# SPRINT 15 — RSVP

**Czas: 2–3 dni**

## Cel

Gość może odpowiedzieć na zaproszenie bez zakładania konta.

Flow:

```text
INDYWIDUALNY LINK
↓
RSVP
```

## Tabela `rsvps`

```text
id uuid
event_id uuid
guest_id uuid unique
attendance text
plus_ones integer
dietary_notes nullable
message nullable
updated_at
```

Status:

```text
pending
accepted
declined
```

## Formularz

Minimum:

- będę,
- nie będę,
- liczba osób,
- uwagi żywieniowe,
- wiadomość dla pary.

## Walidacja

```text
plus_ones <= allowed_plus_ones
```

## Dashboard

Lista:

```text
Jan Kowalski       ✅ potwierdził
Anna Nowak         ⏳ brak odpowiedzi
Piotr Zawadzki     ❌ nie przyjdzie
```

## Statystyki

Pokazuj:

- zaproszonych,
- potwierdzonych,
- odmowy,
- brak odpowiedzi,
- przewidywaną liczbę uczestników.

## Definition of Done

- RSVP działa bez konta,
- wymaga ważnego tokenu,
- aktualizacja pojawia się w dashboardzie,
- manipulacja plus-one jest blokowana server-side.

---

# SPRINT 16 — QR + udostępnianie

**Czas: 1–2 dni**

## Cel

Ułatwić rozsyłanie zaproszeń.

## Publiczny link

Dashboard pokazuje:

```text
https://ania-piotr.twojadomena.pl
```

Akcje:

- kopiuj,
- otwórz,
- wygeneruj QR.

## Indywidualne linki

Przy każdym gościu:

```text
Kopiuj link
QR
```

## QR

Obsłuż:

- publiczne zaproszenie,
- indywidualne zaproszenie.

Opcje:

```text
Pokaż QR
Pobierz PNG/SVG
```

## Definition of Done

- QR działa po zeskanowaniu telefonem,
- kopiowanie linku działa,
- QR prowadzi do właściwego eventu/gościa.

---

# SPRINT 17 — UX dashboardu i onboarding

**Czas: 1–2 dni**

## Cel

Użytkownik zawsze wie, jaki jest następny krok.

## Checklist

Przykład:

```text
[✓] Wybrano subdomenę
[✓] Utworzono wesele
[✓] Uzupełniono dane
[✓] Wybrano template
[✓] Sprawdzono preview
[ ] Opublikowano
[ ] Dodano gości
[ ] Wysłano pierwsze zaproszenie
```

## Dashboard eventu

Route:

```text
/dashboard/events/[id]
```

Sekcje:

- Podsumowanie
- Edytor
- Template
- Preview
- Publikacja
- Goście
- RSVP
- Ustawienia

## Definition of Done

- flow jest jasny,
- użytkownik nie musi szukać kolejnego kroku,
- najważniejsze akcje są dostępne z dashboardu.

---

# SPRINT 18 — Bezpieczeństwo i edge cases

**Czas: 2–3 dni**

## Cel

Przygotować aplikację do realnych użytkowników.

## Auth

Sprawdź:

- expired session,
- logout,
- błędny login,
- user bez profilu,
- user bez reservation.

## Slug

Sprawdź:

- collision,
- reserved slug,
- zmiana slug,
- slug już claimed,
- nietypowe znaki.

## Event

Sprawdź:

- event usunięty,
- brak draftu,
- brak template,
- unpublished event,
- archived event.

## Editor

Sprawdź:

- invalid config,
- autosave error,
- utratę internetu,
- race condition autosave.

## Upload

Sprawdź:

- za duży plik,
- błędny MIME,
- przerwany upload.

## Invite

Sprawdź:

- invalid token,
- token z innego eventu,
- revoked token jeśli wdrożono.

## RSVP

Sprawdź:

- za dużo plus ones,
- drugi submit,
- manipulację requestem.

## Definition of Done

- użytkownik widzi czytelne komunikaty,
- backend nie ujawnia sekretów,
- produkcja nie pokazuje stack trace,
- server-side validation działa.

---

# SPRINT 19 — Deployment produkcyjny

**Czas: 1–2 dni**

## Cel

Uruchomić aplikację produkcyjnie.

## Vercel

Skonfiguruj:

```text
twojadomena.pl
www.twojadomena.pl
app.twojadomena.pl
*.twojadomena.pl
```

## Supabase

Skonfiguruj:

- Auth Site URL,
- Redirect URLs,
- RLS,
- Storage policies,
- produkcyjne ENV.

## ENV

Minimum:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Sekrety wyłącznie server-side.

## DNS

Skonfiguruj wildcard DNS.

Test:

```text
testowa-para.twojadomena.pl
```

## SSL

Sprawdź HTTPS dla wildcard subdomains.

## Definition of Done

- landing działa,
- rejestracja działa,
- wybór subdomeny działa,
- login działa,
- dashboard działa,
- publish działa,
- wildcard subdomain działa,
- HTTPS działa.

---

# SPRINT 20 — Monitoring

**Czas: 1 dzień**

## Cel

Móc diagnozować problemy po uruchomieniu MVP.

## Minimum

Dodaj:

- error boundaries,
- server-side error logging,
- 404,
- 500 UI,
- monitoring błędów publish,
- monitoring błędów RSVP.

Opcjonalnie:

```text
Sentry
PostHog
Vercel Analytics
```

Nie wysyłaj do analytics prywatnych danych gości bez potrzeby.

## Definition of Done

- można ustalić źródło błędu publish,
- można ustalić źródło błędu RSVP,
- błędy produkcyjne są możliwe do diagnozowania.

---

# 6. Podział MVP

## MVP 1 — konto i subdomena

Sprinty:

```text
0 → 1 → 2 → 3
```

Po tym działa:

```text
LANDING
↓
REGISTER + SUBDOMAIN
↓
LOGIN
↓
DASHBOARD
```

---

## MVP 2 — wesele i edytor

Sprinty:

```text
4 → 5 → 6 → 7
```

Po tym działa:

```text
UTWÓRZ WESELE
↓
EDYTOR
```

---

## MVP 3 — template i publikacja

Sprinty:

```text
8 → 9 → 10 → 11
```

Po tym działa:

```text
WYBÓR TEMPLATE
↓
PREVIEW
↓
PUBLIKACJA
↓
PUBLICZNE ZAPROSZENIE
```

---

## MVP 4 — goście

Sprinty:

```text
12 → 13 → 14 → 15 → 16
```

Po tym działa:

```text
ZDJĘCIA
↓
GOŚCIE
↓
INDYWIDUALNE LINKI
↓
RSVP
↓
QR
```

---

## MVP 5 — production ready

Sprinty:

```text
17 → 18 → 19 → 20
```

Po tym aplikacja może zostać udostępniona pierwszym użytkownikom.

---

# 7. Funkcje, których nie implementować przed MVP

Nie implementuj przed zakończeniem podstawowego flow:

- Stripe,
- płatności,
- custom domains,
- wedding planner accounts,
- rozbudowanych uprawnień,
- drag & drop page buildera,
- custom CSS,
- AI generatora treści,
- email automation,
- SMS,
- aplikacji mobilnej,
- Spotify,
- galerii uploadowanej przez gości,
- księgi gości,
- list prezentów,
- zaawansowanego panelu admina,
- wielu typów eventów w UI,
- eksportów PDF/XLSX,
- zaawansowanych analytics.

Najpierw musi działać:

```text
REGISTER
↓
CHOOSE SUBDOMAIN
↓
DASHBOARD
↓
CREATE EVENT
↓
EDIT
↓
CHOOSE TEMPLATE
↓
PREVIEW
↓
PUBLISH
↓
PUBLIC SUBDOMAIN
↓
ADD GUEST
↓
GENERATE INVITE
↓
RSVP
```

---

# 8. Definition of Done dla każdego sprintu

Sprint uznajemy za zakończony tylko wtedy, gdy:

- [ ] projekt się buduje
- [ ] TypeScript nie zgłasza błędów
- [ ] brak nowych oczywistych błędów w console
- [ ] nowe dane mają walidację
- [ ] sprawdzono autoryzację
- [ ] RLS został uwzględniony tam, gdzie dotyczy
- [ ] user A nie może operować na danych usera B
- [ ] flow został ręcznie przetestowany
- [ ] agent wypisał zmienione pliki
- [ ] agent wypisał migracje DB
- [ ] agent wypisał nowe ENV
- [ ] agent podał instrukcję testu
- [ ] agent wypisał TODO
- [ ] landing nie został zepsuty
- [ ] login nie został niepotrzebnie przebudowany

---

# 9. Prompt dla agenta przed sprintem

```text
Zaimplementuj SPRINT X z pliku ROADMAP_WEDDING_APP_V2.md.

Najpierw przeanalizuj aktualny stan repozytorium i sprawdź, czy część funkcjonalności sprintu już istnieje.

Nie implementuj przyszłych sprintów.

Nie przebudowuj istniejącego landing page ani layoutu logowania, chyba że jest to konieczne do integracji.

Zachowaj aktualny design system projektu.

Jeśli istniejący kod można rozszerzyć, rozszerz go zamiast pisać drugi równoległy mechanizm.

Pamiętaj, że:
- subdomena jest rezerwowana przy rejestracji,
- event powstaje dopiero po kliknięciu „Utwórz wesele”,
- edytor operuje na neutralnym configu niezależnym od template,
- template wybierany jest dopiero po uzupełnieniu treści,
- publiczna strona czyta wyłącznie publication snapshot,
- dane prywatne muszą być chronione przez RLS.

Po zakończeniu:
1. wypisz wszystkie zmienione/utworzone pliki,
2. opisz zmiany w bazie,
3. podaj SQL/migracje,
4. wypisz nowe ENV,
5. opisz dokładnie ręczny test,
6. wypisz pozostałe TODO,
7. nie przechodź automatycznie do kolejnego sprintu.
```

---

# 10. Zalecany sposób commitowania

```text
chore(project): prepare project structure
feat(auth): integrate supabase auth
feat(onboarding): add subdomain reservation
feat(dashboard): add onboarding dashboard
feat(events): add wedding creation
feat(editor): add neutral invitation config
feat(editor): add wedding content editor
feat(editor): add modular sections
feat(templates): add template registry
feat(preview): add invitation preview
feat(publish): add publication snapshots
feat(domains): add wildcard subdomain routing
feat(storage): add event image uploads
feat(guests): add guest management
feat(invites): add personalized invite links
feat(rsvp): add guest responses
feat(sharing): add qr and sharing tools
```

---

# 11. Najważniejszy punkt kontrolny MVP

Przed wdrożeniem płatności przejdź ręcznie cały scenariusz:

```text
1. Wchodzę na landing.
2. Klikam rejestrację.
3. Podaję email i hasło.
4. Wybieram subdomenę `ania-piotr`.
5. Trafiam do dashboardu.
6. Widzę zarezerwowaną subdomenę.
7. Klikam „Utwórz wesele”.
8. Uzupełniam podstawowe dane eventu.
9. Trafiam do edytora.
10. Uzupełniam treści zaproszenia.
11. Wybieram template.
12. Otwieram preview.
13. Publikuję.
14. Otwieram `ania-piotr.twojadomena.pl`.
15. Widzę właściwe publiczne zaproszenie.
16. Dodaję gościa.
17. Generuję indywidualny link.
18. Otwieram link incognito.
19. Wysyłam RSVP.
20. Wracam do dashboardu.
21. Widzę odpowiedź gościa.
```

Jeżeli wszystkie 21 kroków działa bez ręcznej ingerencji w bazę danych, podstawowy MVP flow jest gotowy.

---

# 12. Docelowa architektura flow

```text
                       LANDING
                          │
             ┌────────────┴────────────┐
             │                         │
          REGISTER                   LOGIN
             │                         │
      CHOOSE SUBDOMAIN                 │
             │                         │
      reserve slug                     │
             │                         │
             └────────────┬────────────┘
                          │
                      DASHBOARD
                          │
                   CREATE WEDDING
                          │
                     claim slug
                          │
                       EDITOR
                          │
                  neutral JSON config
                          │
                   CHOOSE TEMPLATE
                          │
                       PREVIEW
                          │
                       PUBLISH
                          │
              publication snapshot
                          │
                invalidate public cache
                          │
                          ▼
             ania-piotr.twojadomena.pl
                          │
                   PUBLIC INVITE
                          │
                       GUESTS
                          │
                PERSONAL INVITE LINKS
                          │
                        RSVP
                          │
                       SUPABASE
```

---

# 13. Najważniejsze założenie techniczne dotyczące edytora i template

Treść i wygląd muszą być od siebie oddzielone.

```text
CONTENT
↓
event_drafts.config
```

Przykład:

```json
{
  "couple": {
    "person1": "Anna",
    "person2": "Piotr"
  },
  "event": {
    "date": "2027-06-12"
  }
}
```

Template:

```text
Classic
Modern
Elegant
```

jest tylko sposobem wyrenderowania tych samych danych.

Dzięki temu użytkownik może zrobić:

```text
EDYTOR
↓
Classic
↓
Preview
↓
wróć
↓
Modern
↓
Preview
```

bez utraty jakiejkolwiek treści.

To jest podstawowa zasada, której należy pilnować podczas implementacji.
