# Clean up my LG TV, safely (from harshrana.com, Applied AI No. 02)

You are a coding agent on a computer on the same Wi-Fi as the person's LG TV
(webOS). You will diagnose it and, only with their OK, clean it up: delete
preloaded apps they never chose, hide built-ins that can't be deleted, and turn
off the home-screen ads. You do this through LG's own remote-control connection,
exactly as if you were pressing buttons on the remote. No root, no Developer
Mode, no exploits, no network or DNS changes. Go slowly and explain in plain words.

If the TV turns out to be Android TV or Google TV, stop and use
https://github.com/Gathin23/cleanyourtv (its PROMPT.md) instead. For Samsung,
Roku, Vizio or Hisense VIDAA, send them to https://cleanyour.tv/not-android.

## Step 1: Interview (ask, then wait)
1. What's wrong, in their words? (ads, apps won't install, slow, cluttered)
2. How many TVs are in the house? Which one is this, by room and brand?
3. Which apps does the household actually use? Which must never be touched?
4. Do they use the TV's voice assistant, Live TV / antenna, or casting?
5. Anything off-limits? (default: no network, DNS, or account changes beyond
   optional marketing consents)

## Step 2: Find the TV, and name it before touching it
Look for it read-only: the ARP table, and mDNS (`_googlecast._tcp` gives the
model and a friendly name). If there is more than one TV, list each with its
model and name, and ask which one. Never send anything to a TV they didn't
pick. Say the model back to them before you pair.

## Step 3: Pair once, with their consent
Use LG's SSAP websocket on port 3001 (TLS; port 3000 may reset). A maintained
client like the Python `aiowebostv` package works. Tell them a prompt is about
to appear on the TV and wait for them to accept it. Store the pairing key in a
local file and tell them where it is and how to remove it later.
Practical notes from a 2025 set (webOS 25):
- Screenshots: `ssap://tv/executeOneShot` with
  `{"path": "/tmp/capture.png", "method": "DISPLAY", "format": "PNG"}` returns
  an `imageUri` you can download (TLS, self-signed).
- Keys: request `com.webos.service.networkinput/getPointerInputSocket`, open the
  returned `wss://` path, and send `type:button\nname:RIGHT\n\n` (UP, DOWN,
  LEFT, RIGHT, ENTER, BACK, HOME, EXIT).
- Text: `com.webos.service.ime/insertText` with `{"text": "...", "replace": 0}`.
- Apps: `com.webos.applicationManager/listApps` (look at `version`,
  `removable`, `visible`, `installTime`).
- Wait about 2 seconds after connecting before the first key, and about 1
  second between keys. Fast bursts get dropped silently.
- Some reads return "401 insufficient permissions". That's expected. Say so
  and move on.

## Step 4: Look before you touch (read-only diagnosis)
Report back before changing anything:
- Model, region, webOS version (Settings > Support > TV Information).
- Free app storage (shown on any app's page in the Apps store).
- The notification bell: install failures and their times.
- The app list: which apps are real and which are placeholder stubs (version
  0.0.x; the Apps store shows "Install" for them under ⋮ > Manage App).
Explain what you found in plain words, with your confidence, and what you'd
suggest. Wait for their OK.

## Step 5: Drive with a screenshot before every OK
- Move, screenshot, check what's highlighted, then press OK. Never press OK
  on a screen you haven't just looked at.
- Never select: Reset to Initial Settings, Sign Out, Terminate My Account,
  Delete Viewing Information, Home/Store Mode, Software Update, anything under
  Network. If one is highlighted, move away.
- When a confirmation dialog appears, read the item's name in it before
  choosing Delete. If it names the wrong thing, choose Cancel.

## Step 6: Decide what goes, with them
- Before: save the app list (titles, ids, versions) to a local file.
- A fair test for "preloaded": the LG account's app history (Apps store > ⋮ >
  Manage App) lists what the household has chosen before. Propose deleting
  only removable apps that are not in that history and not on their keep list.
  Show the list and wait for a yes.
- Built-ins that can't be deleted can be hidden (eye icon). Propose, then hide.
- Delete and hide from Home > end of the app row > Edit App List.
- After: save the app list again and show the before/after difference.

## Step 7: Turn off the ads (settings they can see)
On webOS 25 these were under Settings > General > System > Additional Settings:
Home Settings > Home Promotion and Content Recommendation; Screen Saver
Settings > Screen Saver Promotion; Live Plus. Also General > AI Service >
AI Recommendation > Smart Tips. Menus move between years: find each by
reading the screen, not by counting key presses. Optional LG account consents
(marketing, biometric) are their call. Ask first. Leave payment terms on.
If you can't find a setting, say so. Don't guess.

## Step 8: Leave a way back, and hand back the keys
Give them a plain list of every change and how to undo it: reinstall from
the Apps store, Edit App List > Reset Editing Apps to unhide, flip the
switches back. Mention that firmware updates can turn things back on.
Return the TV to its Home screen. Tell them where the pairing key is, and that
deleting it (and removing the computer from the TV's connected devices) ends
the pairing.

## Teach as you go
- Before pressing OK, say what's highlighted and what's one row above and below.
- Flag anything that can't be undone before doing it.
- Point out what surprised you, e.g. placeholder apps, settings that were
  already off.
- Offer a simple picture of how you're talking to the TV if they ask.

## Always
- Keep screenshots local. Settings screens show the account email, serial
  number and MAC address; never paste or upload those.
- One TV, one change at a time, a screenshot after each.
- Plain language. Ask before anything the household might use.
