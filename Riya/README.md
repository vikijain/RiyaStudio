# For Riya — Birthday Website

A birthday celebration for your wife **Riya**: music, balloons, confetti, cake, and a love letter.

The **10-door mystery journey is optional** — only if she taps that button.

## How she experiences it

1. Opens the link → landing screen  
2. **Open your birthday gift** (default) → Happy Birthday song, balloons, confetti, cake, letter  
3. **Or** “Take the mystery journey instead” → 10 sequential doors, then the same party  

There’s also a **Mystery journey** shortcut on the party page if she wants it later.

### Optional: the 10 doors

| # | Stage | Surprise |
|---|--------|----------|
| 1 | Sealed envelope | Opens to a personal invitation |
| 2 | A whisper | Romantic note from you |
| 3 | Memory | Photo `images/1.jpg` + caption |
| 4 | Little quiz | Sweet multiple-choice (all answers win) |
| 5 | Memory | Photo `images/2.jpg` |
| 6 | Catch hearts | Tap 5 floating hearts |
| 7 | Memory | Photo `images/3.jpg` |
| 8 | Reasons I love you | Flip 4 cards |
| 9 | The key | Spell **I LOVE YOU** with letters |
| 10 | Last veil | → birthday party reveal |

## Open locally

```bash
cd bday
npx --yes serve .
# or
python -m http.server 8080
```

### Helper URLs

| URL | Effect |
|-----|--------|
| `?party=1` or `?finale=1` | Skip gate → birthday party |
| `?mystery=1` | Skip gate → mystery journey |
| `?reset=1` | Clear saved mystery progress |

## Personalize

Edit the top of **`app.js`** (`CONFIG`) for memory captions & photos.  
Edit the **letter** in **`index.html`**.

### Photos

- `1.jpg` → Door 3  
- `2.jpg` → Door 5  
- `3.jpg` → Door 7  
- More numbers → finale gallery  
