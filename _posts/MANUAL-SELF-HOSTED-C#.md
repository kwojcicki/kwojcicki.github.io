---
layout: post
title: "Nerdle Solver"
subtitle: "Entropy and Nerdle"
date: 2022-10-08 11:36:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: [Tutorial]
---

# Introduction

# Implementing

Now that we understand the problem space lets get started. The first thing we'll need to do is verify which `ControllerBase` a given `HttpRequestMessage` is requesting for.

## Routing

Unfortunately `AspNetCore.MVC` doesn't provide an easy way to extract the routes you've setup through your `RouteAttribute`s. For a request to match a given controller it needs to first match the controllers top level path.

```cs
private static (bool, string) MatchesController(ControllerBase controller, HttpRequestMessage request)
{
    var customAttributes = controller.GetType().GetCustomAttributes(typeof(RouteAttribute), false);
    var topLevelPath = customAttributes.Length > 0 ? ((RouteAttribute)customAttributes[0]).Template : "/";
    // turning /{id}/posts -> /([^\/]*)/posts
    topLevelPath = '/' + Regex.Replace(topLevelPath, "{[a-zA-Z0-9]*}", "([^\\/]*)").TrimEnd('/').TrimStart('/');
    var topLevelPathRegex = new Regex("^" + topLevelPath + ".*");

    if (!topLevelPathRegex.IsMatch(request.RequestUri?.PathAndQuery!))
    {
        return (false, "");
    }

    return (true, topLevelPath);
}
```

Relatively straightforward code, the only tricky portion is remembering that routes can have [route attributes](https://learn.microsoft.com/en-us/aspnet/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2#why-attribute-routing) which we can handle by creating a regex which will handle capturing anything between two `/`. [Regex101](https://regex101.com/) is a great resource for understanding how a given regex works (keep in mind our C# code has to double escape the backslashes).

Now we know if a request matches a given controller, next we need to find which exact endpoint does it match on the controller.

```cs
private static (bool, System.Text.RegularExpressions.Match) MatchesAction(HttpRequestMessage request, HttpMethodAttribute action, string topLevelPath)
{
    bool foundMethod = false;
    foreach (var httpmethod in action.HttpMethods)
    {
        foundMethod |= httpmethod.Equals(request.Method.Method);
    }

    Regex methodRegex;
    if (string.IsNullOrEmpty(action.Template))
    {
        methodRegex = new Regex("^" + topLevelPath + "$");
    }
    else
    {
        // turning /{id}/posts -> ^/([^\/]*)/posts$
        // the ^ ensures we match from the start of the string
        // while the $ ensures we match to the end of the string
        methodRegex = new Regex("^" + topLevelPath.TrimEnd('/') + "/" + Regex.Replace(action.Template?.TrimStart('/') ?? "", "{[a-zA-Z0-9]*}", "([^\\/]*)") + "$");
    }

    var match = methodRegex.Match(request.RequestUri?.AbsolutePath!);

    return ((foundMethod && match.Success), match);
}
```

Essentially the same code as matching the top level route, except now we are also verifying we have the correct HTTP Verb as well as including a `$` in our regex to ensure the request url matches the entire endpoint url (not just a portion).

## Parameter Extraction

We've got the right controller and the right endpoint, let's extract out the necessary parameters. 

We'll start with the following blueprint

```cs
private List<object?> ParseParameters(HttpRequestMessage request, MethodInfo method, System.Text.RegularExpressions.Match match)
{
  var parameters = new List<object?>();
  var urlParameterIndex = 1; // groups start at 1
  foreach (ParameterInfo parameter in method.GetParameters())
  {
      var required = parameter.IsDefined(typeof(BindRequiredAttribute), false);

      // parse the parameter and put it into the parameters list
  }

  return parameters;
}
```

There are 3 different types of parameters we need to worry about

- `FromQueryAttribute` which are appended at the end of the url in the form of `?param_name1=param_value1&param_name2=param_value2`. We can use the builtin [`HttpUtility`](https://learn.microsoft.com/en-us/dotnet/api/system.web.httputility?view=net-6.0) class to help us with that.
```cs
if (parameter.IsDefined(typeof(FromQueryAttribute), false))
{
    // attempt to find value in url
    var parameterValue = HttpUtility.ParseQueryString(request.RequestUri?.Query!).Get(parameter.Name);
    if (required && string.IsNullOrEmpty(parameterValue))
    {
        throw new Exception("missing required parameter");
    }
    else if (!string.IsNullOrEmpty(parameterValue))
    {
        parameters.Add(objectDeserializer.ConvertValue(parameterValue, parameter.ParameterType));
    }
    else
    {
        parameters.Add(parameter.RawDefaultValue);
    }
}
```
- `FromBodyAttribute` are the second type of parameters we can encounter. These are simpler. We extract the requests content and parse it as necessary
```cs
else if (parameter.IsDefined(typeof(FromBodyAttribute), false))
{
    // parameter in the body
    parameters.Add(objectDeserializer.ConvertValue(request.Content?.ReadAsStringAsync().GetAwaiter().GetResult()!, parameter.ParameterType));
}
```
- If the parameter is neither of those two, then it must be coming from the url route attributes. If you recall we previously created a regex to capture these parameters.
```cs
else
{
    // should be url parameter
    parameters.Add(objectDeserializer.ConvertValue(match.Groups[urlParameterIndex].Captures[0].Value, parameter.ParameterType));
    urlParameterIndex++;
}
```

## Object Deserializer

You may have noticed these mysterious `objectDeserializer.ConvertValue` calls. What are those? It corresponds to a simple utility handler I wrote that looks like the following:

```cs
public class ObjectDeserializer : IObjectDeserializer
{
    public object? ConvertValue(string value, Type outType)
    {
        if (value == null)
        {
            return null;
        }
        else if (outType.IsEnum && Enum.TryParse(outType, value, out object? result))
        {
            return result;
        }
        else if (outType != typeof(string) && outType.IsClass)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject(value, outType);
        }
        else if (outType == typeof(string))
        {
            return value;
        }

        TypeConverter obj = TypeDescriptor.GetConverter(outType);
        object? outValue = obj.ConvertFromString(null, CultureInfo.InvariantCulture, value);
        return outValue;
    }
}
```

## Controller Invocation

We've got the right controller, right endpoint and all the necessary parameters. All that's left for us is to actually invoke the endpoint.

```cs
private static async Task<HttpResponseMessage> InvokeController(MethodInfo method, ControllerBase controller, List<object?> parameters)
{
    if (method.Invoke(controller, parameters.ToArray()) is not Task task)
    {
        throw new Exception();
    }

    await task.ConfigureAwait(false);

    var resp = task.GetType().GetProperty("Result")?.GetValue(task);

    return new HttpResponseMessage()
    {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(resp)),
    };
} 
```

Here we are assuming that the returned content will be in json formatted. Ideally we would look at the [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header and pick a corresponding format. For the purposes of this tutorial, this will work fine.

## Putting it all together

Let's create a small convenience wrapper method which given a controller and a request, returns the results of an invocation (if there was a match).

```cs
private async Task<HttpResponseMessage?> TryController(ControllerBase controller, HttpRequestMessage request)
{
    var (matches, topLevelPath) = MatchesController(controller, request);

    if (!matches)
    {
        return null;
    }

    foreach (var method in controller.GetType().GetMethods())
    {
        var actionRoutes = method.GetCustomAttributes(typeof(RouteAttribute), false);
        var actions = method.GetCustomAttributes(typeof(HttpMethodAttribute), false);
        foreach (HttpMethodAttribute action in actions)
        {
            var (matchesAction, match) = MatchesAction(request, action, topLevelPath);
            if (!matchesAction) continue;

            var parameters = ParseParameters(request, method, match);

            return await InvokeController(method, controller, parameters);
        }
    }

    return null;
}
```

## Setup

Finally we need someway for our routing and invocation logic to be called. In order to minimize any changes necessary in your clients, we can directly call our `TryController` method as part of a mocked `HttpClient`.

```cs
public HttpClient GetHttpClient(ControllerBase[] controllers)
{
    var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
    handlerMock
        .Protected()
        // Setup the PROTECTED method to mock
        .Setup<Task<HttpResponseMessage>>(
          "SendAsync",
          ItExpr.IsAny<HttpRequestMessage>(),
          ItExpr.IsAny<CancellationToken>()
        )
        // prepare the expected response of the mocked http call
        .Returns(async (HttpRequestMessage request, CancellationToken _) =>
        {
            for (int i = 0; i < controllers.Length; i++)
            {
                var task = TryController(controllers[i], request);

                await task.ConfigureAwait(false);

                var resp = task.GetType().GetProperty("Result")?.GetValue(task);
                if (resp != null)
                {
                    return (HttpResponseMessage)resp;
                }
            }

            return new HttpResponseMessage()
            {
                StatusCode = HttpStatusCode.NotFound,
                Content = new StringContent(""),
            };
        })
        .Verifiable();

    var httpClient = new HttpClient(handlerMock.Object)
    {
        BaseAddress = new Uri("http://localhost.com/"),
    };

    return httpClient;
}
```

## Optimizations

As is this code is horribly inefficient. Every time a request comes in we iterate through all the controllers and all of the endpoints, generating quite a few regexes. Instead we can upfront create a map/dictionary of regex strings to endpoints. Then we could reuse this map every time we process a request.

# Code

You can visit TODO: to view the entire code base and see how to use it within your unit tests!

# FAQ

## Why not use `HttpSelfHostServer`/`Owin`?

[`Owin`](https://learn.microsoft.com/en-us/aspnet/web-api/overview/hosting-aspnet-web-api/use-owin-to-self-host-web-api) and [`HttpSelfHostServer`](https://learn.microsoft.com/en-us/aspnet/web-api/overview/older-versions/self-host-a-web-api) are both incredibly useful and should be used if possible. This post was primarily made for fun and my own learning.

## Isn't this the same as mocking?

Yes and no. Yes we will need to manually setup the test data, but no we do not need to explicitly define the behavior of our dependencies. That's a huge win given our dependencies can at any moment introduce a hidden change (that isn't technically a breaking change) but will break your implementation. This is the reverse of [Hyrum's Law](https://www.hyrumslaw.com/) where you want to minimize the chances of a breaking API change making it's way to production. Ideally using unit tests with self hosted webservers will only you and your coworkers to instantly know if a change will break any of your downstream dependencies and either provide them with a migration strategy or gives you the ability to rethink your current approach.

## How do we handle 3rd party dependencies

Unfortunately in the case of 3rd party dependencies you only really have two options. Either use their in memory implementation ([CosmosDB in memory configuration flag](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.UsageNotes.html) or [Embedded Redis](https://github.com/kstyrc/embedded-redis) are such examples) or continue mocking out these dependencies and ask the maintainers to provide you with an in memory option.  