# Localization

## Goal

Make the farmer-facing product multilingual without coupling language logic to business logic.

## Supported roles

Multilingual:

- Farmer
- Centre Staff
- Centre Manager

Prototype English-only:

- District/Admin Officer
- Super Admin

## Architecture

Use translation keys:

```ts
t("booking.confirmed")
t("queue.peopleAhead")
```

Do not write user-facing strings directly inside business functions.

## Locale data

Store:

- user preferred language;
- centre-supported languages;
- system-supported languages.

## Translation structure

Example:

```text
i18n/
  en/
  hi/
  bn/
```

Additional languages can be added later without changing domain logic.

## Number/date formatting

Use locale-aware formatting.

Quantities and currency should follow the selected locale where appropriate.

## Farmer language UX

Language selection should be easy to find.

Do not assume a farmer understands technical English terms.

## SMS

SMS mock messages should use the recipient's preferred supported language where a translation exists.

Store the template key and rendered language in notification records.
