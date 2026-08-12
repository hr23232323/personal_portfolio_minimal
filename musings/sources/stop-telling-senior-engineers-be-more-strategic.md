---
title: Stop Telling Every Senior Engineer to Be More Strategic.
date: June 2026
description: Every organization needs strategy. That does not mean every employee needs "be more strategic" as their development plan.
slug: stop-telling-senior-engineers-be-more-strategic
---

Eventually, almost every successful senior IC receives the same feedback:

> You're doing great. Now you need to be more strategic.

It sounds important.

It also means almost nothing.

Should I think further into the future? Work on larger projects? Write more documents? Attend planning meetings? Disagree with leadership more often? Become a product manager and an architect while continuing to do my existing job?

"Be more strategic" has become the corporate equivalent of telling someone to demonstrate more leadership: prestigious enough to sound meaningful, blurry enough to avoid saying what actually needs to change.

If every senior engineer receives the same feedback, I'm not convinced we have an engineer problem.

We may have a feedback problem.

## 01. If you mean something specific, say it.

There are legitimate criticisms hiding inside "be more strategic."

Maybe someone repeatedly starts building before understanding the problem.

Say that.

Show them a decision where more research, collaboration, or consideration would have produced a better outcome.

Maybe they optimize for the current quarter while creating long-term maintenance costs.

Say that.

Explain which horizon they should consider, which tradeoff they missed, and what responsibility you expect them to own.

Maybe their work is excellent but difficult for other teams to understand or use.

Say that.

Ask them to make their reasoning legible and turn what they learned into a decision others can act on.

Those are useful conversations.

"Be more strategic" compresses all of them into an adjective and makes the IC responsible for decoding it.

| Instead of... | Say... |
|---|---|
| Be more strategic | Own this decision |
| Think bigger | Challenge this problem boundary |
| Increase influence | Help these teams act differently |
| Take a longer-term view | Show how this changes next year's options |
| Improve visibility | Make your reasoning legible |

## 02. Most technical decisions have handles on both sides.

Strategy matters most when a decision is expensive, consequential, and difficult to reverse.

We should think carefully before walking through a one-way door.

But far more technical decisions than our planning rituals suggest are two-way doors. We can ship something small, observe what happens, change our minds, and try again.

Nothing I have built has been correct the first time.

The useful skill was rarely predicting the perfect implementation in advance. It was building the smallest loop I could put in front of someone, gathering signal, and improving it quickly.

Every extra week spent trying to produce certainty delays the information that could replace our assumptions.

This tradeoff is becoming even more pronounced with AI.

Pieces of execution that once required weeks can now take days or hours. If five approaches are cheap, reversible, isolated, and measurable, the strategic move may not be selecting the winner in a conference room.

It may be testing all five.

> When the cost of trying falls, the value of predicting perfectly falls with it.

That does not eliminate strategy. It changes its job.

Strategy becomes less about confidently predicting which idea will work and more about creating a system that discovers the answer quickly.

I learned this the hard way while building [Carl](https://carl.golf/?utm_source=harshrana.com&utm_medium=referral&utm_campaign=be-more-strategic). A prompt change fixed every search-coverage scenario I was targeting and still [made the full product worse](/musings/try-harder-agent-evals.html). The lesson came from the loop, not the prediction.

## 03. Adaptability does not look strategic.

We tend to associate strategy with stillness:

The long-range roadmap.

The architecture document.

The annual plan.

The person in the meeting asking everyone to take a step back.

Adaptability looks like the opposite.

It looks reactive. Plans change. New tools appear. Teams abandon approaches they were excited about three months ago.

But consider the environment we are operating in.

I watched Claude go from barely present inside an organization to nearly ubiquitous within a few months. Products, models, protocols, and vendors now change faster than many companies complete a planning cycle. Six months can turn an unfamiliar technical pattern into basic infrastructure.

A detailed twelve-month prediction may look more strategic than changing direction every month.

It may also be substantially less useful.

In a rapidly changing environment, the ability to absorb new information and reorient an organization is not the absence of strategy.

It may be the most important strategy available.

## 04. We're turning engineers into imaginary executives.

There is another consequence to giving every senior IC the same feedback.

They begin performing "strategy."

An engineer assumes they should also become a product manager, project manager, architect, and organizational politician. They expand into every neighboring discipline because visible cross-functional activity is what strategic work appears to look like.

Eventually, everyone is trying to operate one abstraction above their actual responsibility.

The result is not necessarily better leadership. Sometimes it is duplicated work, unclear ownership, more meetings, and subject-matter experts stepping on one another instead of being allowed to cook.

Strong engineers should understand the customer, business, and wider system. Seniority should bring broader judgment and responsibility.

But that does not mean every valuable engineer must become a miniature executive.

Some people create enormous leverage by deeply understanding a difficult system. Some unblock urgent problems no one else can solve. Some make execution faster across an entire organization. Some produce unusually good decisions within a narrower domain.

Those are not incomplete versions of strategy work.

They are valuable forms of work.

## 05. Look at the job you actually gave them.

Organizations routinely place Staff+ engineers on the most urgent, visible, technically difficult problems.

A production incident appears. A launch becomes blocked. A major customer needs something. A system begins failing at scale.

The senior engineer gets pulled in because they can create clarity and move the work forward.

Then review season arrives, and the same person is told they need to spend more time developing a long-term strategy.

When?

If you allocate someone's time to organizational emergencies, you cannot also criticize them for insufficient long-range thinking without changing the job around them.

A request for more strategy should come with strategic space:

- A decision they clearly own.
- A problem horizon beyond the current delivery cycle.
- Access to the context leadership is using.
- Permission to challenge an existing priority.
- Time not already consumed by urgent execution.

Otherwise, "be more strategic" means "perform your current job while invisibly doing another one."

## 06. Be more specific.

The next time you want to tell someone to be more strategic, finish the sentence.

"Be more strategic by..."

If the rest does not come easily, the feedback is not ready.

Perhaps you want them to identify work the organization should stop doing. Connect a technical investment to a business decision. Create an experiment instead of debating assumptions. Consider how today's architecture changes next year's options. Turn a lesson from one team into a capability that benefits five.

Say that.

Give them a decision, a boundary, and an outcome, not a prestige adjective.

Every organization needs strategy.

It needs people who understand where the company is going, make difficult commitments, and decide what not to do.

But not everybody needs to perform strategy at all times. Sometimes the most valuable thing an engineer can do is execute exceptionally well, respond to new information, and help the organization learn faster than its plans become obsolete.

That is not a failure to be strategic.

Sometimes, that is the strategy.
