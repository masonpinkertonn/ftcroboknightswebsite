"use client";

import type { FormEvent } from "react";

const TEAM_EMAIL = "paceroboknights15290@gmail.com";

export default function SponsorForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const organization = String(data.get("organization") || "");
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const interest = String(data.get("interest") || "");
    const message = String(data.get("message") || "");
    const subject = `RoboKnights sponsorship inquiry — ${organization}`;
    const body = [
      `Organization: ${organization}`,
      `Contact: ${name}`,
      `Email: ${email}`,
      `Partnership interest: ${interest}`,
      "",
      message,
    ].join("\n");

    window.location.href = `mailto:${TEAM_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="sponsor-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          <span>Organization</span>
          <input name="organization" autoComplete="organization" required />
        </label>
        <label>
          <span>Your name</span>
          <input name="name" autoComplete="name" required />
        </label>
      </div>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>How would you like to help?</span>
        <select name="interest" defaultValue="Financial sponsorship" required>
          <option>Financial sponsorship</option>
          <option>Materials or equipment</option>
          <option>Technical mentorship</option>
          <option>Recruiting or career connection</option>
          <option>Another partnership</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your organization and how you would like to work with the RoboKnights."
          required
        />
      </label>
      <button className="button button-dark" type="submit">
        Start the conversation <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">
        Submitting opens a pre-addressed email. This site does not store your information.
      </p>
    </form>
  );
}
