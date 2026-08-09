---
layout: post
title: "Ruby Blocks"
subtitle: "Why Ruby Blocks?"
date: 2026-08-08 13:44:00
author: "Krystian Wojcicki"
header-img: "img/posts/jekyll-bg.jpg"
comments: true
tags: []
---

Ruby blocks look like lambdas. But a block does not get its own `return`, when Ruby encounters `return` inside a block, it returns from the method that supplied the block. Any code waiting for the block to finish is skipped along the way. This is called non-local returns and can be unintuitive when you're new to Ruby

```ruby
def function_with_block(&block)
    puts "hello world"
    block.call()
    puts "goodbye world"
end

# prints 
#  - hello world
#  - hello!!
#  - goodbye world
function_with_block { puts "hello!!" } 

# prints 
#  - hello world
# does not print goodbye world
function_with_block { return }
```

When might you want to do this?

Optimizing and elaborate control flows are the primary benefits of non-local returns.

Let's work with a `with_lock` primitive.

```ruby
def with_lock(lock)
  lock.acquire
  begin
    yield
  ensure
    lock.release
  end
end
```

Without non-local returns the caller would need to interpret and propagate the block's return value

```ruby
def update_account(account, lock)
  result = with_lock(lock) do
    if account.closed?
      :closed
    else
      account.balance += 100
      account.save
      :updated
    end
  end

  return :closed if result == :closed

  send_notification(account)
  update_metrics(account)

  :updated
end
```

With non-local returns the code simplifies itself greatly

```ruby
def update_account(account, lock)
  with_lock(lock) do
    return :closed if account.closed?

    account.balance += 100
    account.save
  end

  send_notification(account)
  update_metrics(account)

  :updated
end
```

As another example imagine you own a service SDK, it's common to build that out using [middlewares](https://aws.amazon.com/blogs/developer/middleware-stack-modular-aws-sdk-js/#:~:text=a%20JavaScript%20object.-,Middleware%20Stack,-Writing%20your%20first) where each modular component is responsible for one portion of the request.

If a new lifecycle state was introduced, being able to cancel the request, each middleware would need to add code that handles this new state, 

```ruby
def profile_middleware(req)
    start = timer.now()
    response = next_middleware.call(req)
    if !response.cancelled? # new control logic
        emit_metric("time taken", timer.now() - start)
    end
    return response
end
```

Alternatively callers can pass a block with a non-local return and can skip certain middlewares

```ruby
def request_middleware(req, &block)
    request_body = serialize(req)
    block.call()
    response = client.perform_request(request_body)
    return deserialize(response)
end

def profile_middleware(req)
    start = timer.now()
    response = next_middleware.call(req)
    emit_metric("time taken", timer.now() - start)
    return response
end

middleware_stack.call(req) do
    if cache.cache_hit?
      return
    end
    # no cache hit proceed with expensive backend call
end
```

Non-local returns enable advanced control flows, however they come with a cost. Unwinding the stack using non-local returns is slower than typical unwinding. The cognitive overhead placed on developers is higher when they need to reason about what code can/cannot be executing.
