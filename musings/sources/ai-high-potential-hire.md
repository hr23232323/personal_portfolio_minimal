![Collage: a giant clockwork automaton at a tiny school desk is handed a single card by a mentor standing on a stack of books, while a tower with nine windows rises behind them and only the top-right window is lit](images/cover.webp)

**Musing No. 08 · November 2026 · 8 min read**

# Your AI Is a High-Potential *Hire.*

*An old talent-management framework offers a useful way to think about getting better work out of AI.*

I think we're giving AI some pretty terrible assignments.

"Automate my entire workflow."

"Build this application."

"Make me a great presentation."

Then we get something mediocre, spend hours fixing it, and wonder why a model that can seemingly do anything can't do this one thing particularly well.

It's a strange place to be. We've seen what these models are capable of. They can write software, reason through complicated problems, and produce genuinely impressive work.

But capability doesn't always translate into good outcomes.

I've been thinking about this through a framework I came across in management: the **9-box talent matrix**.

It's a surprisingly useful way to think about the gap between what AI *could* do and what it actually does. More importantly, it gives us a way to think about closing that gap.

## 01 / Potential is not performance

The [9-box](https://www.aihr.com/blog/9-box-grid/) is a fairly simple talent-management framework. It plots people on two axes: their potential and their current performance.

What's interesting isn't really the boxes themselves. It's how differently you might approach two people who are performing at the same level but have very different potential.

Someone with limited potential who isn't performing might need a different role. Someone with extraordinary potential who isn't performing might need clearer expectations, more support, or a different kind of assignment.

And someone who is already performing exceptionally well? You probably want to give them more room to run.

![The 9-box, potential against performance, with the high-potential row highlighted. AI sits in the high-potential, low-performance box, with an arrow toward high performance.](images/diagram-9-box.png)

AI, at least for a remarkable amount of knowledge work, seems to sit somewhere in that high-potential row.

Its current performance is another story.

The same model can produce an excellent technical document, struggle with a presentation, and completely lose the plot halfway through a complicated workflow.

I don't think the useful response is to immediately decide that AI isn't good enough.

If the potential is there, the more interesting question is what we're doing to realize it.

And that starts with the work we're giving it.

## 02 / Stop throwing it into the deep end

One thing I've learned working with talented people is that being capable of doing something eventually doesn't mean you're ready to do all of it independently today.

Sometimes the best thing you can do is make the assignment smaller.

Not less ambitious. Just smaller.

I see the opposite happen in AI projects constantly.

Someone wants to automate an entire process. They describe the desired end state, give the model some tools, and expect it to figure out everything in between.

I lead AI work at Clasp, and I don't approach automation by deciding on a Tuesday afternoon that we're going to automate someone's entire job.

First, I want to understand how the job actually works.

Where are the repeatable steps? Which parts have written procedures? Where does someone stop to make a decision? What are the common mistakes? Which decisions are easy to explain, and which ones have years of experience hiding behind them?

You don't need a six-month discovery project to answer these questions. But you do need some understanding of what you're asking AI to take over.

Take something as ordinary as making a presentation.

"Make me a deck" sounds like one task.

It isn't.

A slide delivering bad news has a very different job from one explaining a complicated idea. A weekly update isn't a narrative. A slide designed to be read isn't necessarily a slide designed to be presented.

Each has its own expectations, patterns, and ways of going wrong.

Instead of starting with the entire presentation, I might start with weekly update slides. They have a familiar structure, repeatable inputs, and a reasonably clear definition of success.

Get those working. Then try a different kind of slide.

!["Make me a deck" splits into four kinds of slides: Updates, Storytelling, Big ideas and Bad news. Updates is marked as the place to start; the rest come later.](images/diagram-deck.png)

The ambition hasn't changed. I still want AI to make excellent presentations.

I've just given it a path to get there.

There's a difference between moving carefully and moving deliberately. I'm much more interested in the latter.

## 03 / Teach it what good looks like

This past summer, I worked with a fantastic intern.

The kind of person you recognize pretty quickly has a lot of potential. By the end of the summer, we knew we wanted them back next year.

But that didn't mean I could hand them a complicated project on day one and disappear.

Sometimes I needed to review their work closely, show examples, explain what I would have done differently, or help them think through a decision. Other times, the best thing I could do was get out of their way and let them figure things out.

I genuinely enjoyed that part of the summer.

And the return on the time I invested was remarkable. An hour spent coaching could feel like three, four, or five hours of value returned, especially as they became more independent.

I think about AI similarly.

If I'm asking it to produce a presentation, why wouldn't I show it presentations I love? Why wouldn't I explain that I prefer a single bold idea on some slides, charts on others, and very little text when the slide is meant to accompany someone speaking?

These might be obvious preferences to me.

They're not obvious to the model.

The interesting part is that I might not even know how to articulate all of them.

So I can give Claude five slides I love, three I dislike, and ask it to figure out why. Let it identify patterns, ask me questions, challenge inconsistencies, and help me write down the standards I didn't realize I was applying.

Suddenly, something that previously existed only in my head becomes a set of examples, preferences, and instructions that can be reused.

**One of the hidden benefits of working with AI is discovering just how much of your own expertise you've never had to explain.**

That knowledge is worth capturing.

## 04 / Don't keep teaching the same lesson

There's an important difference between my intern and an AI agent.

My intern could learn something on Monday and bring that understanding into Tuesday.

An AI model doesn't necessarily do that.

If I explain why a slide is too busy, get a better result, and then start a fresh conversation tomorrow, I may be right back where I started.

So teaching isn't quite enough. The lesson needs somewhere to live.

Maybe that's a preference document. Maybe it's a few examples of good and bad work. Maybe it's a checklist or a test that catches a recurring mistake.

For our presentation example:

- If the model keeps producing text-heavy slides, preserve the preference and examples rather than repeating the correction.
- If it consistently chooses the wrong chart, articulate the rules behind chart selection.
- If it forgets who the presentation is for, make the audience and intended outcome part of the workflow.
- If the same failure keeps appearing, create a check that makes it visible before the work reaches you.

![A loop of Work, Review, Capture the lesson, Verify and Better work. Beside it, the same loop repeats at a growing scope: update slides, then the updates section, then the whole deck.](images/diagram-feedback-loop.png)

I've written about this before in [Your AI Agent Should Never Make the Same Mistake Twice](https://harshrana.com/musings/ai-agent-never-same-mistake-twice.html).

The idea came from building Carl, my AI golf concierge, and watching real user mistakes turn into permanent tests.

The model wasn't necessarily getting smarter.

But the product was learning.

That distinction matters. We can improve the performance of an AI system without changing the underlying model at all.

And those improvements compound when we preserve them.

## 05 / Let it earn more responsibility

Eventually, the weekly update slides are consistently good.

Maybe AI can now produce the entire updates section. Then parts of a larger presentation. Eventually, perhaps the whole deck.

The progression isn't just about giving it bigger assignments. It's about needing less intervention to get an outcome you're happy with.

I don't want to inspect every little decision forever.

I want to understand where the system is reliable, where it still needs help, and when I can comfortably give it more responsibility.

That's the movement toward the top-right of the 9-box.

There's also a human element here that I find interesting.

Earlier in my career, I've felt that little bit of discomfort when someone else became really good at work I previously owned. Molly Graham's [Give Away Your Legos](https://review.firstround.com/give-away-your-legos-and-other-commandments-for-scaling-startups/) captures the lesson well.

Making room for someone else to excel doesn't make your own contribution less valuable.

Ideally, it creates room for you to do something more valuable.

I think there's a version of that with AI.

I'd rather become exceptionally good at working with something capable than spend my time protecting every task I've historically been responsible for.

The goal isn't for AI to do exactly what I do.

It's for the combination of us to be capable of substantially more.

## 06 / Give your AI a performance review

Here's an experiment worth trying.

Pick one recurring task where AI has disappointed you, but where you've seen enough to believe the capability is there.

Don't start by rewriting the entire prompt or looking for a more sophisticated agent framework.

Start with the assignment.

1. **Make it smaller.** What's the narrowest useful piece of work you could delegate?
2. **Show what good looks like.** Give it examples, preferences, and the context behind your decisions.
3. **Make one lesson stick.** Take a correction and turn it into something the next session can use.
4. **See what changes.** Try the task a few more times. If it's becoming reliable, expand the assignment.

You might discover that a surprisingly small change makes a big difference.

You might also discover that the assignment needs to be structured differently, or that a particular part still requires your judgment.

Both are useful things to learn.

That's what I like about the 9-box. It's not a prompting technique or another agent architecture. It's an old framework that helps me ask a better question about something new.

We've spent a lot of time marveling at AI's potential.

I think there's just as much opportunity in learning how to turn that potential into performance.

And that's something we can work on today.

---

### Keep exploring

If you're interested in the original management framework, [AIHR has a thorough guide to the 9-box and its development strategies](https://www.aihr.com/blog/9-box-grid/).

For the more technical side of making improvements stick, I've written about [turning agent failures into permanent tests](https://harshrana.com/musings/ai-agent-never-same-mistake-twice.html) and [why asking an agent to try harder actually made my product worse](https://harshrana.com/musings/try-harder-agent-evals.html).

And if you're applying similar ideas to your own work, I'd love to compare notes.

[Start a conversation →](mailto:harsh@harshrana.com)

Until next time,

Harsh