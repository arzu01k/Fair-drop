import { Router } from "express";

export const authRouter: Router = Router();

// OAuth is intentionally stubbed — the demo uses GitHub's public REST API
// with the username the user types in. These routes exist so the frontend
// can probe availability and return a sensible 501 when hit directly.

authRouter.post("/github", (_req, res) => {
  res.status(501).json({
    error: "oauth_disabled",
    hint: "Use POST /verify/analyze with a GitHub username.",
  });
});

authRouter.get("/github/callback", (_req, res) => {
  res.status(501).json({ error: "oauth_disabled" });
});
