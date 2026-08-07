# Instagram Connection State Fix Report

## 🔍 Root Cause Validation
The core issue was that the Builder interface loaded in a default "builder state" while the connection check evaluated asynchronously in the background. If a new user triggered the builder, the placeholder for "Select Reel" rendered prematurely. Because the frontend didn't rigidly block interaction before verifying connection, the Reel Modal could be triggered open, aggressively calling `fetchReels()` against a backend that knew there was no active account.

## 🛠️ Files Modified

1. **`app/dashboard/automations/instagram/builder/page.tsx`**
   - **Why `fetchReels()` was executing too early:** The modal was not strictly bound to the connection state.
   - **The Permanent Fix:** Stripped the asynchronous `isConnected` and `loading` boolean states in favor of a single unified State Machine: `connectionState` (`LOADING`, `NOT_CONNECTED`, `CONNECTED`, `TOKEN_EXPIRED`). 
   - Now, if the state is `NOT_CONNECTED`, the component halts rendering the entire Builder interface. It explicitly returns a **dedicated, full-page "Connect Instagram Business" screen**.
   - If the state is `TOKEN_EXPIRED`, it halts and displays a dedicated reconnect screen.
   - It is mathematically impossible for the Reel Selector modal to open—or for `fetchReels()` to execute—if the state is not `CONNECTED`.
   - **Bonus Automation:** If the user is indeed `CONNECTED` and opening a *new* automation (no `campaignId`), the Reel Selector natively pops open on load as explicitly requested.

2. **`app/api/instagram/reels/route.ts`**
   - Implemented strict validations for `instagram_user_id`, `access_token`, and `facebook_page_id` before querying Meta. 
   - Upgraded responses to return specific `status` indicators (`NOT_CONNECTED` or `TOKEN_EXPIRED`) rather than generic HTTP errors, giving the frontend exact instructions for routing states.

## 🧪 Verifications Completed
- **Brand New User Flow:** Verified that navigating to the builder without an account renders a full page "Connect Instagram" lock screen. No builder modules load. No tokens are fetched.
- **Connected User Test:** Verified that existing users entering a new automation instantly experience the Reel Selector popping up.
- **Token Expired Test:** Verified that if a refresh cycle ultimately fails, the builder falls back directly to the Reconnect UI, halting operations without auto-redirecting.
- **Regression:** Validated strict TypeScript typing (`connectionState` exact literals) and confirmed that the Landing Page, Admin Panel, and Activepieces logic were left entirely untouched.
