"use client";

import { useState } from "react"
import emailjs from "@emailjs/browser"

const TEAM_EMAIL = "mason.pinkerton28@paceacademy.org";//"paceroboknights15290@gmail.com";

export default function SponsorForm() {
    const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  setStatus("sending");

  try {
    await emailjs.sendForm(
      "service_jwdpldn",
      "template_pmebgy6",
      form,
      {
        publicKey: "8I553JWYPPCxLSk7V",
      }
    );

    setStatus("success");
    form.reset();
  } catch (error) {
    console.error("Failed to send sponsorship inquiry:", error);
    setStatus("error");
  }
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
      <button
  className="button button-dark"
  type="submit"
  disabled={status === "sending"}
>
  {status === "sending" ? (
    "Sending..."
  ) : (
    <>
      Start the conversation <span aria-hidden="true">↗</span>
    </>
  )}
</button>

<p className="form-note" aria-live="polite">
  {status === "success"
    ? "Thank you! Your sponsorship inquiry has been sent."
    : status === "error"
      ? "The message could not be sent. Please try again."
      : "Your inquiry will be sent directly to the RoboKnights."}
</p>
    </form>
  );
}
