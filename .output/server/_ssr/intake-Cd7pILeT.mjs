import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as object, s as string } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const IntakeSchema = object({
  name: string().min(1),
  business: string().min(1),
  serviceType: string().min(1),
  budget: string().min(1),
  message: string().min(1),
  email: string().email()
});
const submitIntake_createServerFn_handler = createServerRpc({
  id: "dbc5c64a72e5c37ef7dda6c1e8151a7452ac6a6525097c03d85e5c944a253eac",
  name: "submitIntake",
  filename: "src/server/intake.ts"
}, (opts) => submitIntake.__executeServer(opts));
const submitIntake = createServerFn({
  method: "POST"
}).inputValidator(IntakeSchema).handler(submitIntake_createServerFn_handler, async ({
  data
}) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured.");
  }
  const html = `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business:</strong> ${data.business}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Brief:</strong></p>
      <p>${data.message.replace(/\n/g, "<br />")}</p>
    `;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Flow Studio Intake <onboarding@resend.dev>",
      to: "hello@flowstudio.design",
      reply_to: data.email,
      subject: `New project brief — ${data.serviceType}`,
      html
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to send intake email: ${errText}`);
  }
  return {
    success: true
  };
});
export {
  submitIntake_createServerFn_handler
};
