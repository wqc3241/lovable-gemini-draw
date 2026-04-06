

## Plan: Restrict Unauthenticated Users to Example Prompts Only

### What Changes

**`src/pages/Index.tsx`** — Two modifications:

1. **Gate `handleGenerate` for unauthenticated users**: At the top of `handleGenerate`, check if there's no active session. If unauthenticated, check whether the current prompt matches one of the `ALL_EXAMPLE_PROMPTS`. If it doesn't match, show a toast or dialog prompting the user to create an account, and return early (don't generate).

2. **Visual indicator**: When no user is logged in, add a small note near the prompt input or generate button (e.g., "Sign up to use custom prompts") so unauthenticated users understand the restriction before hitting generate. Example prompts will continue to work by setting the prompt text and generating normally.

### Technical Details

- The auth check already exists in `handleGenerate` (line 163). We'll add a block **before** the existing credit check: if `!session` and `prompt.trim()` is not in `ALL_EXAMPLE_PROMPTS`, navigate to `/auth` or show a toast with a link to sign up.
- Example prompt clicks (`setPrompt(example)`) remain unchanged — they just set text. The gate only fires at generation time.
- No database or edge function changes needed.

