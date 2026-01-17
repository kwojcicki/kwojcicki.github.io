---
layout: post
title: "Don't fix, prevent"
subtitle: "Don't just fix bugs, prevent them from occurring again"
date: 2026-01-17 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

[Stripe found that developers spend 17 hours a week on maintenance (i.e. dealing with bad code / errors, debugging, refactoring, modifying)](https://stripe.com/files/reports/the-developer-coefficient.pdf). 

Why? Because we treat symptoms instead of causes. Every time we fix a bug without preventing similar ones, we guarantee we'll be back here again. If we prevented recurrence with each fix, we'd gradually shift from maintenance to creation.

That's aspirational, not realistic. But we can get closer. Here are some examples. 

# Unique Bucket Names

S3 bucket names must be globally unique. Developers often forget this and push infrastructure updates that fail due to duplicate names. For example, this will break when another developer deploys to their own AWS account:

```typescript
this.accessLogsBucket = new Bucket(this, bucketId, {
	bucketName: `${productName}-access-logs-bucket`,
	...
});
```

The quick fix? Add a user suffix:

```typescript
bucketName: `${productName}-access-logs-bucket-${user}`
```

Done. Your teammates are unblocked.

But this will happen again. Can we do better? Yes:

1. Add a code review checklist item to verify bucket names are globally unique
2. Use an LLM code review bot to flag potentially non-compliant buckets
3. Create a custom S3 Bucket construct that automatically adds the user suffix, then add an eslint rule to prevent using the raw S3 Bucket construct
4. Work at Amazon and modify S3 to support non-unique bucket names

Each option costs more developer time but provides more leverage. A custom `UserSuffixedS3Bucket` construct with shared eslint config can save dozens of hours across your entire company.

# Translation files

Frontend translations are often served as static JSON files [wrapped in a lookup function](https://www.i18next.com/overview/getting-started#typescript):

```typescript
const getTranslation = (key: string, locale?: string): string => {
	const translationFile = getResource(locale || DEFAULT_LOCALE);
	return translationFile[key] ?? getResource(DEFAULT_LOCALE)[key] ?? key;
}
```

Developers often forget to commit translation file updates for new features. The build doesn't break, so it's easy to miss.

The quick fix? Submit another code review with the forgotten file.

Better approaches:

1. Add a code review checklist item to verify all translations are committed
2. Use an LLM code review bot to flag new translation keys without corresponding file updates
3. Create a strongly typed translation function that fails the build if a key is missing
4. Extend TypeScript's type system to understand translation resource files

```typescript
// auto generated at build time using the en-US resource file
const enum TranslationKeys {
  "product-title-text",
  "product-subtitle-text"
  ...
}

const getTranslation = (key: TranslationKeys, locale?: string): string => {
	const translationFile = getResource(locale || DEFAULT_LOCALE);
	return translationFile[key] ?? getResource(DEFAULT_LOCALE)[key] ?? key;
}

// will fail compilation
getTranslation('missing-key');
// no error
getTranslation('product-title-text');
```

# Flaky E2E tests

Your team's E2E tests fail once a week because a downstream dependency errors out.

The quick fix? Increase retries and move on. But if that service starts erroring more frequently, your tests get flakier.

Instead, find and fix the root cause:

1. Are your E2E tests creating unexpected load that causes the downstream service to brown out?
2. Is their beta environment misconfigured?
3. Is there a race condition that occasionally triggers?
4. If partial brownouts are expected, should you move to an async workflow?

# Conclusion

Every bug can fixed in a junior, intermediate and senior mindset. The key is identifying these options and weighing the upside against time investment. Not every bug deserves prevention, but thinking this way gradually frees up your time as recurring issues disappear.
