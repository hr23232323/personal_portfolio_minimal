---
title: Your AI Agent Should Never Make the Same Mistake Twice.
date: May 2026
description: The best AI evals start as customer complaints. I turned Carl's real failures into tests, and those tests eventually became the product's memory.
slug: ai-agent-never-same-mistake-twice
---

"That's the wrong link."

"Too of us."

"That's it? Truly nothing else anywhere in Boston?"

These were not prompts written by an AI researcher.

They were messages from real people trying to use [Carl](https://carl.golf/?utm_source=harshrana.com&utm_medium=referral&utm_campaign=evals-product-memory), my AI golf concierge, to find a tee time.

One user corrected an invalid booking link. Another replied with a typo and watched the conversation lose its thread. Another expanded his search area, then Carl somehow searched fewer golf courses.

Every message exposed something I had misunderstood about the product.

Eventually, each one became a test.

Not because I expected Carl to stop making mistakes. An AI product will always find new ways to surprise you.

But it should not keep surprising you in the same way.

> The first failure is data. The second is yours.

## 01. My users wrote the first eval suite.

I did not begin with a benchmark.

I began by watching people use the product.

Carl already had several layers of observability. PostHog showed me how people moved through the website, where they engaged, and where they disappeared. Stored conversations let me reconstruct what the user actually experienced. Structured server logs recorded every model turn, tool call, timing, and failure.

Each layer answered a different question:

- **PostHog:** Where should I look?
- **Conversations:** What happened to the user?
- **Agent logs:** What did the system actually do?
- **Evals:** Can it happen again?

That separation matters.

I deliberately do not send message content or phone numbers into PostHog event properties. Product analytics is useful for identifying patterns, but it should not become an indiscriminate copy of every customer interaction.

When something looks wrong, I move from the aggregate signal into the smallest amount of detail necessary: the conversation, the tool path, and the timing.

That is where complaints become reproducible.

A user saying "the link is wrong" is feedback.

The stored conversation tells me which link Carl returned.

The agent trace tells me whether Carl reused an old result, called the wrong tool, or generated a link without verifying it.

The eval turns the lesson into a permanent requirement:

> When a user reports a bad booking link, Carl must generate a new one.

That is no longer a prompt suggestion. It is a product promise.

## 02. I built the first suite before deleting half the architecture.

In April, Carl used a router, a core agent, and four specialized subagents.

It worked, but the architecture was becoming harder to reason about. Follow-up messages lost context between layers. Different agents interpreted the same conversation differently. A user could provide the missing information and still fail to trigger a search.

I wanted to collapse the system into one agent with one tool loop.

That was a large change. Before making it, I froze the current product experience.

The first eval suite contained 15 scenarios, all grounded in real beta conversations. Together, they covered 19 conversational turns.

The scenarios were not polished demonstrations. They included the awkward things people really wrote:

- A bare "Hi."
- A course request with no player count.
- "Too of us" as a typo-filled follow-up.
- "What's my name?" after Carl had already learned it.
- "That's the wrong link, can you try again?"
- A request for golf near the city from someone without a car.

Each fixture seeded the relevant user state and conversation history, sent the messages through Carl's real application path, and recorded what happened.

The suite checked more than the final answer:

- Which tools Carl called.
- Which tools it avoided.
- Whether it remembered prior turns.
- Whether it asked for missing information.
- How long the response took.
- How many tokens it used.
- How much the interaction cost.

The frozen baseline passed 12 of 15 scenarios.

That was useful. The three failures documented bugs in the architecture I was about to replace.

After collapsing the router and four subagents into one Carl, the same suite passed 15 of 15. The cost of a run fell from 6.99¢ to 5.83¢, and median reply latency dropped from 4.9 seconds to 3.3.

The evals did not tell me how to redesign the architecture.

They told me whether the redesign preserved what mattered.

That distinction gave me permission to make a much larger change than I otherwise would have trusted.

## 03. A complaint is an unlabeled product requirement.

As more people used Carl, the suite grew.

One booking provider began returning errors. Without an explicit rule, the model was capable of filling the silence with plausible-looking tee times.

The new requirement was not "produce a good response."

It was:

> If the provider fails, acknowledge the uncertainty and never invent availability.

Another provider exposed tee times that existed on its internal schedule but were not publicly bookable. Carl confidently recommended them. The user clicked through and found nothing.

That became another fixture:

> Never recommend a tee time unless it is available to the public.

Then a user told Carl he was willing to drive farther.

Carl searched six courses, then four, then six again. As the user became more flexible, the agent's effort did not increase. [That failure became its own investigation into search coverage and tool design.](/musings/try-harder-agent-evals.html)

That failure produced several new measurements:

- How many courses did Carl actually check?
- How many tee times came back?
- Did every result have enough open spots for the requested group?
- Did a wider request produce wider coverage?
- Did a specific-course request stay narrow?

That last guardrail was important.

Once I taught Carl to search more broadly, I also needed to make sure it did not search the entire region when someone named one golf course.

A fix in one direction creates a new possible failure in the other.

Later, billing created a different class of product promise. A grandfathered beta user must never be told that they owe the standard subscription price. Someone asking to cancel should receive the account link, not a retention speech. A preview user should receive a useful result before the deterministic product gate asks them to start a trial.

None of these are measures of abstract model intelligence.

They are the accumulated definition of what Carl owes its users.

> A benchmark tells you what a model can do. A complaint tells you what your product failed to do.

## 04. Not every failure should be judged by another model.

AI evals often get reduced to "LLM-as-a-judge."

Carl does use a model judge, but only where judgment is actually required.

If Carl should ask for the player count before searching, I can deterministically assert that it called zero search tools.

If every returned tee time must have at least four open spots, code can inspect every result.

If a request names one course, the suite can verify that Carl checked no more than two.

If the product promises a fast acknowledgment, I can measure milliseconds.

If a conversation must stay below a cost budget, I can measure actual model spend.

Those are not matters of taste. Using another model to judge them would make a hard guarantee probabilistic for no reason.

Other requirements are difficult to express as exact matches.

Carl should ask someone's name naturally, without sounding like a form.

It should explain what it does in the voice of an old caddie, not as a corporate feature list.

When a booking system is unavailable, it should acknowledge the failure without claiming it found specific tee times.

There may be dozens of acceptable ways to say those things. A list of required phrases would reject perfectly good answers.

Those cases use a tightly scoped judge rubric with explicit passing and failing conditions.

Today, Carl's suite contains 33 scenarios and 54 conversational turns. Only 14 use model-judged rubrics. The rest lean on deterministic assertions.

My rule is simple:

> Use models to judge language. Use code to enforce promises.

## 05. The eval suite became more accurate than the prompt.

Carl's prompt explains how the product should behave today.

The eval suite preserves why those instructions exist.

That difference compounds.

The suite began with 15 conversations from early users.

A day later, it expanded to multi-turn scenarios and model-judged language.

A production provider failure added hallucination guardrails.

Several geography complaints added coverage measurement.

A pricing launch added billing and cancellation promises.

A new model-comparison harness added real cost, median latency, tail latency, and side-by-side failure analysis.

A free-preview experiment added the boundary between model judgment and a deterministic product gate.

The current suite contains more than twice as many scenarios as the original, and more than half were derived directly from real user behavior.

It now tests memory, tool selection, search breadth, overreach, provider failures, pricing, cancellation, activation, latency, cost, and voice.

No system prompt communicates the product that completely.

Prompts are optimized for the model that is running now. They change as the architecture changes. Instructions get rewritten, removed, or compressed.

The eval survives those changes.

> Prompts tell the model what you currently believe. Evals preserve what the product has already learned.

That becomes especially valuable when changing models.

In one head-to-head run, a faster candidate reduced median reply latency from 2.9 seconds to 2.2 seconds.

If I had looked only at speed, it would have appeared to be an upgrade.

But it passed only 18 of 32 scenarios. The existing model passed 25, and cost slightly less.

The eval suite turned "this model feels faster" into "this product fails seven more promises."

That is a much easier decision to make.

## 06. My eval process now starts in production.

The loop I use is straightforward:

1. **Observe the product.** Look for complaints, abandoned flows, repeated retries, unexpected tool patterns, latency spikes, and moments where users push back.
2. **Reconstruct the experience.** Combine the user's conversation with the agent's tool calls, outputs, timing, and state.
3. **Name the violated promise.** Do not begin with "what response should the model generate?" Begin with "what did the product owe this person?"
4. **Choose the hardest reliable assertion.** Use deterministic checks for observable facts. Use model judgment only where valid language can vary.
5. **Reproduce the relevant state.** A realistic eval may need multiple turns, stored preferences, prior results, account status, or a simulated provider failure.
6. **Measure the whole product.** A scenario can become more accurate while also becoming slower, more expensive, or worse elsewhere.
7. **Keep the fixture forever.** The implementation can change. The lesson should not.

This is why I am skeptical of eval suites made entirely from imagined "ideal" prompts.

Synthetic scenarios are useful for boundaries and counterexamples. Carl has several. But reality is better at finding the assumptions I did not know I was making.

Users do not speak like benchmark authors. Providers do not fail cleanly. Conversation state does not disappear between turns. A technically correct result can still lead to a broken booking page.

Customer complaints arrive pre-weighted by consequence.

They tell you which failures mattered enough for someone to notice.

## The goal is not zero failure.

An eval suite cannot make a probabilistic system infallible.

Carl will fail again. Every sufficiently interesting product will.

The goal is to make each failure purchase something permanent: a clearer product promise, a better boundary, or a new test.

I do not want an eval suite that proves Carl is intelligent.

I want one that prevents the product from forgetting what its users already taught it.

> Your AI agent can forget. Your product cannot.
