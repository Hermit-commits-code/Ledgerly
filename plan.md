# Financial Tracking Mobile Application Plan

## 1. Framework Suggestions

- **Framework:** React Native + Expo
  - Expo simplifies React Native app development.
  - Handles Android/iOS builds, permissions, APIs.
  - Eject later if native modules are needed.
- **Alternative:** Next.js + PWA (not recommended for native features).

**Summary:**

- **Use Expo (React Native).**

## 2. CSS / UI Choices

React Native uses a CSS-like styling system.

- **TailwindCSS:** Not direct, use Tailwind-RN or NativeWind.
- **Chakra UI:** Has a React Native version (young, promising).
- **Custom Styles:** Tedious for large apps.

**Best Practical Recommendation:**

- **Use NativeWind (Tailwind syntax for React Native)**.

**Summary:**

- **NativeWind** for fast dev + custom tweaks when needed.

## 3. Deployment to Google Play Store

Expo manages this easily:

1. **Build** with `eas build -p android`.
2. **Submit** with `eas submit -p android` or upload `.aab` manually.
3. Requirements:
   - **Google Play Developer Account** ($25 one-time fee).
   - App **assets** (icon, splash screen, screenshots).
   - **Privacy policy** URL if handling financial data.
   - Correct **package name** (e.g., `com.username.appname`).
4. Must complete Google's **Data Safety Form**, **Privacy Policy**, **Security practices**.

## 4. Realistic Timeline & Systematic Versioning (Solo Developer)

### MVP Timeline

| Stage                                       | Estimated Time |
| :------------------------------------------ | :------------- |
| Wireframing UX                              | 1 week         |
| Core Feature Development                    | 6–8 weeks      |
| User Authentication + Secure Storage        | 2 weeks        |
| Polish (Animations, Accessibility, Theming) | 2–3 weeks      |
| Testing (Devices + Emulators)               | 2 weeks        |
| Google Play Submission + Fixes              | 1–2 weeks      |

**TOTAL:** ~3-4 months (part-time work).

### Versioning Suggestion

Follow **Semantic Versioning (SemVer)**:

- `0.1.0` → Initial MVP
- `0.2.0` → Add authentication
- `0.3.0` → Add budgeting categories
- `0.4.0` → Add transaction import/export
- `1.0.0` → Full launch (after beta testing)

### Commit Strategy (Conventional Commits)

Commit prefixes:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `chore:` Build system, dependency updates
- `style:` Formatting changes
- `refactor:` Code change without behavior change
- `perf:` Performance improvements
- `test:` Adding tests

Example commits:

```bash
feat: add transaction categorization screen
fix: correct calculation error in monthly budget
chore: upgrade Expo SDK to latest version
```

## 5. Tech Stack Summary

| Category           | Tech Choice                      |
| :----------------- | :------------------------------- |
| Framework          | React Native + Expo              |
| Styling            | NativeWind (TailwindCSS for RN)  |
| State Management   | Zustand or Redux Toolkit         |
| Storage            | SecureStore, SQLite, or Supabase |
| Backend (Optional) | Supabase                         |
| Deployment         | EAS Build + Google Play Console  |
| Project Management | GitHub Projects or Notion        |

## 6. Extra Advice

- **Security:** Use SecureStore for sensitive data.
- **Analytics:** Add Amplitude or Firebase Analytics post-launch.
- **Privacy Policy:** Create a basic version first, update properly when scaling.
- **User Feedback:** Expect rapid iterations after release.

## TL;DR

- ✅ Expo (React Native) + NativeWind
- ✅ SecureStorage or Supabase backend (if needed)
- ✅ EAS Build for Play Store
- ✅ Conventional Commits + SemVer
- ✅ 3–4 months realistic MVP timeline
