"use strict";
const replacementMode = new URLSearchParams(location.search).get("replacement")==="1";
const assessmentUrl = "https://qejimegoysblonawsoza.supabase.co/functions/v1/" + (replacementMode?"year8-replacement":"year8-assessment");
const assessmentPublishableKey = "sb_publishable_bWHlzeJJdgepYefUsc16zQ_93_TEYes";

async function assessmentRequest(payload) {
  const start = Date.now();
  const response = await fetch(assessmentUrl, {
    method: "POST",
    cache: "no-store",
    credentials: "omit",
    headers: { "Content-Type": "application/json", apikey: assessmentPublishableKey },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  });
  const data = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error(data.error || "Could not connect to the assessment."), data, {
      status: response.status,
    });
  }
  if (data.serverTime) data.serverTime += Math.round((Date.now() - start) / 2);
  return data;
}
