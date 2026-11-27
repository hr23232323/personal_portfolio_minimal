# Building a Shirt Shop for AI Agents

*A golf tee, a group chat, and a bet on how people will find their next purchase.*

“Put me down for five” is a pretty good golf shirt. If you’ve ever watched somebody fish two balls out of a pond and announce a bogey, you already know who should get one.

Now imagine asking the AI agent that helped plan your golf weekend to make the shirt. It already knows the joke. How much of a print shop should you have to learn to get from there to “I’ll take a medium”?

I started building **MadeIRL**, a print-on-demand merch prototype for AI agents, to work through that question.

## Building for the other side of the reservation

[A while back](/musings/software-is-multiplying-users-arent.html), I wrote about asking Emma, my chief-of-staff agent, to book a restaurant. Emma could call on a whole stack of services while I stayed in one conversation.

I wanted to build something on the restaurant’s side of that interaction. A shirt seemed like a good test because there’s a moment when I absolutely do want to look at a screen. The difference between a joke I’d wear and a bachelor-party shirt I’d leave in the hotel can be about two inches of lettering.

I spent a surprising amount of time on the MadeIRL homepage getting that lettering right. Then it occurred to me that the first visitor I was designing for could skip the homepage entirely.

## One shirt, two interfaces

In the working prototype, an agent can specify a line of text, a color, and a print style. MadeIRL returns a preview URL and a matching purchase-page URL. The person opens the preview and sees the words on the actual color they picked. Change “cream” to “ink” and the shirt and lettering change together.

That little handoff is where I think a business can live. I’m happy to delegate finding a printer, working out its options, and setting the type. I’d still like a look at the shirt before anybody charges my card. A shop that makes both parts easy has a shot at an order from someone who never thought to search for a shop.

## The part that has to show up in the mail

Today I can take you as far as choosing a size. Checkout is disabled. The next test is one paid shirt. I want to get an available size and a print proof from Printful, take payment through Stripe after approval, and see what comes out of the package. I’m particularly curious whether that small type still looks good on cotton.

That’s the part of the agent economy I want to build for. A person will still want something very particular. Increasingly, I think the first business to hear about it will hear from their agent. For MadeIRL, I’ll know the idea has some legs when somebody shows up to the next golf weekend wearing the joke.
