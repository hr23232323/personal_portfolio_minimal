---
title: Software Engineering in the Age of Agents
date: February 22, 2026
description: Some thoughts on what software engineering looks like in the age of agents
slug: software-engineering-age-of-agents
---


This is probably the most famous line of code in the world:

```python
print("Hello, World!")
```

It has **syntax**, **meaning**, and a **job**. 

The syntax is simple and is similar to grammar in English.

*This is a proper sentence.* 
*This isn't proper sentence.*

Not much room for creativity or style, just a set of finite rules. Well defined. Clear right and wrong. Deterministic.

Next up is meaning. This is where things start getting fun.

*Tom is walking.*
*Tom is walking down the street.* 
*Tom is slowly walking down the street.*
*Tom is slowly walking down the street towards a pub.* 
*Tom is slowly walking down the busy street towards a pub.* 
*Tom is slowly walking down the busy street towards an Irish pub.* 

You get the point. All these sentences are syntactically correct, but each conveys slightly different meaning. There's no right or wrong, unless the pub is English or the street is not busy, they're just different.

In coding, that can be the difference between these:

```python
print("Error")
print("Error, please try again.")
print("Fatal Error, please contact the admin.")
print(f"Error: {e}")
print(f"Error of type {type(e).__name__}: {e}")
```

There's no real right or wrong. All the above will compile and run just fine, but different engineers might have different preferences. Even within the same company, different codebases might have different standards.

So far so good? Now let's talk about the final layer, job to be done. These two sentences are doing very different jobs:

1. *Tom is walking.* 
2. *Tom is slowly walking down the busy street towards an Irish pub.* 

The former tell us what Tom is doing. The latter also tells us what Tom is doing, but it adds where he is and where he's going. If the "job" is to tell you only what Tom is doing, then the first sentence is perfectly acceptable. If the "job" is to tell you where Tom is, what he's doing, and where he's going, then the first sentence is no longer acceptable. 

Aha! Finally, a right and a wrong sentence choice. So what does this mean when it comes to coding?

```python
print("Error")
```

It means that the above code is correct syntax and meaning, but it is not acceptable if the "job" is to say what happened (error) and describe it (`KeyValidationError`). This might feel like a trivial example, but what I'm seeing in AI generated code in the wild is something similar. 

And I can't unsee it.

--- 

I've been writing code for 12 years. The first 6 were purely by hand. No autocomplete, no tools, not even much copy and pasting. I liked writing code, I was good at it and I enjoyed the process of building software. Then, I started writing harder and harder code. Stack overflow was my bible. Code snippets shared across the internet by anonymous software engineers was a godsend. I discovered a modern IDE called VS Code, and suddenly the autocomplete was much more helpful in my daily workflow. I was still writing most of the logic by hand, but the syntax was taken care of for me. 

Then ChatGPT dropped in 2022, and coding changed overnight. Suddenly, it wasn't just syntax that could be ignored, it was also meaning. If you wanted to code the equivalent of "*Tom is slowly walking down the busy street towards an Irish pub*", you could just ask ChatGPT and it would be done for you. So what exactly was the job of a software engineer then? Well from 2023 to 2025 it was to just describe the job to be done, and your favorite LLM provider would write code that captured the job, meaning, and syntax for you. They all had slight variations in the meaning they captured (*Tom is walking down the busy street towards an Irish pub* VS *Tom is **slowly** walking down the street towards an Irish pub* VS *Tom is slowly walking down the **busy** street towards an Irish pub*) but the job to be done, was getting done. 

Then, Claude Code dropped in 2025. Again, everything changed overnight. 

Now, an agentic coding tool like Claude Code could read and understand your codebase/product specs/bug description and create it's own job to be done to meet the need. Engineers could describe strategy and CC would create jobs to be done and do them. Non-technical people started doing the same. Describe the job to be done, and have CC do it for you. 

So are we going to have any software engineers in 2030? I believe so and here's my two main reasons why:

1. The "jobs to be done" in a product is subjective
2. The "right" humans can multiply LLM output

I'm going to use a simple authentication (sign up, sign in etc.) flow to help make my case. 

### The "jobs to be done" in a product is subjective

Believe it or not, there's a lot of different jobs to be done when you think about something as universal as authentication. To keep things simple, let's just look at a sign up flow. 

First the basics, how can a user sign up? Just email and password was the classic, but that's not going to work in 2026 when Social Sign-On (SSO) is the new expectation. But which SSOs providers to enable? If you created a product that allowed everyone to sign up with any platform of their choosing, then you would have 100 logos on your sign up screen. Most products have 2-3 (Google, Facebook, Apple, sometimes Github) and this is a subjective decision. 

Now, what about additional fields and metadata during signup? Do you ask users about their name? If so, when? If you do it during the initial sign up you might have users who drop off (classic conversion problem). If you do it later, you application needs to work with or without names. It also needs to ask users to add their name if they haven't already. Lastly, do you ask for first name only, last name, middle names? What about usernames? Again, do you have them pick a username when signing up or after? Regardless, how do you make sure there's no username clashes? Also can a user change their username? Some apps let you and some don't, but that's another subjective decision. Very different jobs to be done, and no necessary right or wrong. 

Going a step deeper, how and where is all this stored? If someone signs up with Google SSO, do you still ask for their name on your application? What if they change their name on their google account but not on your application, is that okay? What happens when/if they delete their Google account? Will they lose access to your product as well? If not, how will your product detect and create a graceful path for that scenario?

Not saying that LLMs can't handle this, oh they very well can. But each decision is subjective and creates side effects that are entirely different jobs to be done. Not every application can or should be doing all these jobs because then applications get bogged down by ridiculous layers of logic, each has a noticeable impact on the performance of your application. Sign up should be smooth and fast, not complicated and slow. Yet how many applications can say that they have a smooth sign up experience? Go sign up for JIRA if you haven't in a while.

### The "right" humans can multiply LLM output

LLMs are easily the most revolutionary technology of my young career, but, they're still just a tool. And tools don't have the same effect on work output across people. For example, imagine that you could do 2x the work you can per hour now. Then, every individual has a decision:
1. Do 2x as much, working at the same intensity and hours as before
2. Do the same amount of work, but in half as much time as before

Neither is right or wrong and I'm not here to judge. But most people, organizations, and compensation structures I've seen would quickly feel some tension. Organizations would prefer that everyone would fall into the former bucket, but a lot of people will go towards the latter way of working. More time for family, hobbies, health - I don't blame them.

I'm seeing the same thing across teams and people now. Some people are using LLMs, specifically agentic coding tools, to do much more than before. They're entering new codebases, they're expanding their circle of influence, and increasing their value. They're learning more about their company and organization and solving problems outside their roadmap. Others are doing about the same as before, but with a different tool kit. Sure, Claude Code is writing a bigger % of the code, but there's no statistically significant difference in their productivity. I believe this trend will continue for quite some time. Play out over time, and some engineers (think the former type) will be worth 5x, 10x, 100x as the others. There'll still be a market for those engineers. 

---

Look, I could be wrong. I’m just an engineer writing 20,000+ lines of code a week through a terminal, trying to make sense of a career that looks nothing like it did when I started 12 years ago. The tools are here, and they aren't going away. The real question for 2030 isn't whether AI will be writing the code—it’s whether you’ll be the person defining the 'job' it needs to do.

I’m exploring that transition in real-time. If you’re also trying to navigate the shift from builder to architect in the age of agents, drop your email below. I send out my thoughts on a super irregular (but hopefully useful) cadence.
