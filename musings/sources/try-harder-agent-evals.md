---
title: I Told My AI Agent to “Try Harder.” It Got 8% Worse, 66% More Expensive, and Its Tail Latency Nearly Doubled.
date: April 2026
description: A change that fixed the exact behavior I was targeting quietly made the overall product worse.
slug: try-harder-agent-evals
---

A user asked [Carl](https://carl.golf/?utm_source=harshrana.com&utm_medium=referral&utm_campaign=agent-evals), my AI golf concierge, to find a tee time near Boston.

Carl searched a handful of nearby courses and returned some options.

The user widened the request. They were willing to drive farther. Anything in the broader Boston area would work.

Carl searched fewer courses.

The user pushed once more: was that really everything available?

Carl searched roughly the same small set again and confidently said there wasn’t much else.

Across the conversation, the user became more flexible. The agent’s search effort barely changed.

That was the bug.

The obvious fix was to tell the agent to try harder.

It worked.

It also made the overall product 8% worse, 66% more expensive, and pushed its slowest responses from roughly 19 seconds to more than 35.

## Why Carl had primitive tools

Carl lives in your text messages. You tell him when and where you want to play, and he searches fragmented golf-course booking systems for something that works.

The first version gave the model several small tools:

```text
Geocode a location
Find nearby courses
Look up one course’s tee times
Generate a booking link
Update a user’s preferences
```

This came from traditional software-design instincts.

If I were building the same system without an LLM, each function would have one responsibility. A controller or service layer would decide how to compose those functions into a complete workflow.

With an agent, the model can become that orchestration layer.

It can look at the request, inspect the tools available, and decide how to combine them. As models improve, they should theoretically become better at making those decisions without me hard-coding every possible path.

There was also a practical reason to start this way: primitive tools create room to learn.

When the product is new, I do not actually know which actions will frequently occur together. Smaller tools let me observe how the agent tries to solve the problem before I prematurely encode one workflow as the workflow.

That architecture worked surprisingly well. Until it didn’t.

### Finding the failure inside the loop

I use product analytics and structured input/output logs to understand how people interact with the systems I build.

This is not especially sophisticated infrastructure. It is simply enough visibility to inspect real conversations, identify repeated problems, and trace what the agent did.

The geography problem appeared more than once.

People would give Carl permission to search farther away, but the model still inspected only a small set of courses. In some cases, it widened the location incorrectly, changed the center of the search, or stopped after finding partial results.

The user saw a confident answer.

Behind that answer, the tool loop was mostly a black box.

I reproduced the conversations locally and added deterministic checkpoints between each model and tool call. That let me step through the loop:

```text
What did the model understand?
Which tool did it choose?
What arguments did it send?
What came back?
Which course did it inspect next?
Why did it stop?
```

The problem became clear.

The agent was responsible for too many small but consequential decisions:

- Where to anchor the search.
- How far to look.
- How many courses counted as enough.
- Which returned courses deserved inspection.
- Whether partial results were sufficient.
- When to stop searching.

The prompt encouraged exploration, but nothing actually required it.

## The simple fix: “try harder”

I am a big believer in keeping things stupid simple.

At the time, Carl had room to do more work. Model cost per answer was low. Median latency was reasonable. The agent was not making hundreds of tool calls.

It seemed unnecessary to redesign the system.

If Carl could simply loop a few more times, expand the search radius, and inspect more of the courses it found, it should produce better results.

So I made two related changes:

1. I expanded what the course-discovery primitive could return.
2. I put more pressure in the prompt to inspect every course and widen the search when users signaled flexibility.

Then I ran the evaluation suite.

The targeted behavior improved. All five search-coverage scenarios passed.

The full product got worse.

| Metric | Baseline | “Try harder” | Change |
|---|---:|---:|---:|
| Passing scenarios | 26/29 | 24/29 | 7.7% fewer |
| Total evaluation cost | 25.63¢ | 42.54¢ | 66% higher |
| Median reply latency | 5.1s | 4.5s | 11% faster |
| P95 reply latency | 18.9s | 35.4s | 87% slower |

The median becoming slightly faster is a useful reminder: one latency number rarely describes the experience. Typical responses were fine. The slowest meaningful slice became almost twice as slow.

Some of the additional cost and latency were expected. More searching means more tool results, more context, and more model turns.

The behavioral regressions were not.

Carl began searching before asking how many golfers were in the group.

In a longer booking conversation, it spent so many turns looking through courses that it exhausted the loop before returning a booking link.

The agent had become more committed to searching, even when the correct next action was to stop and ask a question.

I had improved one instruction by making it compete more aggressively with every other instruction.

## Agent accuracy is not one number

Carl’s evals do not only ask whether the final response sounds correct.

They test several layers of the product:

- Did Carl ask for missing information?
- Did it remember facts from earlier turns?
- Did it call the required tools?
- Did it avoid unnecessary tools?
- Did it inspect enough courses for the request?
- Did returned slots support the requested party size?
- Did it handle a failed booking provider without inventing availability?
- Did it respond quickly enough?
- Did the interaction stay within its cost budget?
- Did it maintain the concise experience expected in text messages?

That distinction mattered here.

The new version was more accurate according to the metric I had just optimized: search coverage.

It was worse according to the system’s broader job.

This is one reason I am skeptical of evaluating agents with a single success score. A product can improve at completing one task while becoming slower, less economical, and less capable of knowing when it should not perform the task yet.

### The problem wasn’t effort

The real issue was that “try harder” is not a useful control surface.

What does trying harder mean?

- Search a wider radius?
- Inspect every course?
- Spend more tokens reasoning?
- Call more tools?
- Retry failed providers?
- Continue until some minimum number of results appears?

Those are different behaviors with different costs.

I had expressed a product requirement as a motivational instruction.

The product requirement was:

> When a user widens the geography, Carl should inspect a measurably broader set of relevant courses before saying nothing else is available.

That requirement is bounded. It is observable. Much of it can be enforced without intelligence.

It did not belong entirely inside the model.

## Moving predictable work out of the agent

The next architecture gave Carl a composed search tool.

Instead of asking the model to independently geocode, discover courses, choose a subset, inspect them, and assemble links, the backend could own the predictable chain.

It could:

- Read precomputed coordinates for golf courses that rarely move.
- Expand the radius according to explicit rules.
- Fetch tee sheets in parallel.
- Filter slots by time and party size.
- Keep booking links attached to the correct course.
- Report exactly how many courses it inspected.

The model still had important work.

It needed to translate a messy human request into intent. It needed to understand phrases like “after work,” “somewhere near my meeting,” or “I’m willing to drive.” It needed to decide when information was missing and communicate the result naturally.

But the model no longer needed to repeatedly decide whether five courses were enough.

This did not magically make every evaluation pass. It did make search effort enforceable, observable, and independently improvable.

## Primitive tools were not the mistake

My conclusion is not that agents should always receive large, composed tools.

I still think primitive tools are often the right place to begin.

Starting with primitives lets you observe:

- Which tools repeatedly appear together.
- Where the model demonstrates useful flexibility.
- Where it makes inconsistent choices.
- Which information should be precomputed.
- Which actions need deterministic guarantees.
- Which composed workflows the real product actually requires.

If I had started with one enormous golf-search tool, I might have hidden those decisions before understanding them.

The threshold changes when the product matures.

Once a chain of actions becomes common and predictable, I ask:

> Does the model still need to own this?

Sometimes the answer is yes. The task may contain meaningful ambiguity or benefit from creative composition.

Sometimes the answer is no. The sequence has become an expensive probabilistic implementation of behavior I can now describe exactly.

That is when primitives can become composed tools, deterministic code, stored computation, or a separate bounded system.

## The lesson

The agent did what I asked.

It tried harder.

The problem was that I asked it to work harder at decisions it should no longer have owned.

The rule I use now is:

> When the model is making a judgment, give it room to reason. When the product is making a promise, make that promise enforceable.

The harder question is deciding where that boundary belongs.

That is not a primitive-tools-versus-composed-tools debate with one correct answer. It depends on the product, the maturity of the workflow, the model, and what you have learned from real usage.

That deserves its own article.

Once a chain of actions becomes common and predictable, ask whether the model still needs to own it.
