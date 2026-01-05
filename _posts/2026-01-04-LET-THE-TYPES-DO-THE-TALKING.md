---
layout: post
title: "Let the types do the talking"
subtitle: "Your documentation should explain the why, while the types explain the what"
date: 2025-01-04 09:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

# Introduction

Code comments, descriptive method/variable names, readme's and wikis are all amazing tools that are misappropriated to explain the what versus's the why. Code will evolve at a quicker pace than your documentation, resulting in: incomplete, missing or completely incorrect documentation. Instead let your types explain the what and focus your documentation on the why.

## Object dumping grounds

Let's examine a common occurrence in the design of object types.

```typescript
interface Notification {
	payload: string,
	to: string, // raw email if an email notification otherwise the users slack handle
	cc?: string[] | undefined, // optional, only utilized if an email notification
	slackChannel?: string, // only required if a slack notification
	threadTs?: string | undefined // optional, only utilized if slack notification
}
```

Without reading the comments its difficult to understand what combination of fields can or cannot be used and what their values are expected to be. Can the `to` field be a persons first/last name? company alias? employee id?

Instead we can utilize a [tagged union](https://en.wikipedia.org/wiki/Tagged_union) ([Smithy example](https://smithy.io/2.0/spec/aggregate-types.html#union)) and descriptive subtypes.

```typescript
enum NotificationTypes {
	EMAIL = "EMAIL",
	SLACK = "SLACK"
}

type Email = `${string}@${string}`;

// AWS Simple Email Service only allows a max of 50 recipients (across to, cc, bcc) https://docs.aws.amazon.com/ses/latest/dg/quotas.html
const MAX_EMAIL_RECIPIENTS

// BCC is not available as it messes with our analytics
interface EmailNotificationParams {
	type: NotificationTypes.EMAIL,
	to: Email,
	// FixedLengthArray taken from https://stackoverflow.com/a/60762482
	cc?: FixedLengthArray<Email, MAX_EMAIL_RECIPIENTS - 1> | undefined
}

type SlackHandle = `${string}@`
type SlackChannels = 'general-chat' | 'chat-1' | 'chat-2'

interface SlackNotificationParams {
	type: NotificationTypes.SLACK,
	to: SlackHandle,
	// Our slack bot is only configured in these channels for security purposes
	slackChannel: SlackChannels,
	threadTs?: string | undefined
}

interface Notification {
	payload: string,
	// There is no text/phone support as this service only provides sending notifications through corporate channels
	notificationParams: EmailNotificationParams | SlackNotificationParams
}
```

Now comments appropriately handle the why. Why do we only support Email/Slack, or the limitations of the fields.

## Mysterious methods

Let's examine another common occurrence in the specification of methods.

```typescript
function sendNotifications(notifications: Notification[]): string[] {
	...
}
```

How are failures handled? If a singular notification fails to send is an exception thrown? Is it thrown immediately? How many retries are there?

While a method comment can explain all those questions theres no guarantee the comment will not drift, or be correct. The number of retries may increase without the comment being updated.

Instead we can be more explicit of the return type (and input)

```typescript
interface NotificationSuccess {
	type: NotificationResultTypes.SUCCESS
}

const MAX_NOTIFICATION_DELIVERY_ATTEMPTS = 3;

interface NotificationFailure {
	type: NotificationResultTypes.FAILURE
	reason: NotificationFailureReason,
	// IntRange taken from https://stackoverflow.com/a/39495173
	// stop delivery attempt early if there is a wide spread outage of the downstream delivery service or malformed payload
	attempts: IntRange<1, MAX_NOTIFICATION_DELIVERY_ATTEMPTS>;
}

type NotificationResult = Notification & {
	result: NotificationSuccess | NotificationFailure
}

function sendNotifications<N extends number>(notifications: FixedLengthArray<Notification, N>): FixedLengthArray<NotificationResult, N> {
	for(const notification of notifications){
		for(let attempt = 0; attempt < MAX_NOTIFICATION_DELIVERY_ATTEMPTS; attempt++){
			...
		}
	}
}
```

Now we instantly can understand how the system is supposed to behave for failed messages and can safely reason about retries.


# Conclusion

Familiarize yourself with your programming languages type system. Theres much more to it than just basic interfaces. It will build confidence in your own code (if it compiles it should work) and help individuals understand your code in the future.
