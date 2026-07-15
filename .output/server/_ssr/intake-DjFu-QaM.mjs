import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
function getAdminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
async function sendEmail(params) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured.");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Flow Studio <onboarding@resend.dev>",
      to: params.to,
      reply_to: params.replyTo,
      subject: params.subject,
      html: params.html
    })
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to send email: ${errText}`);
  }
}
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
  const briefHtml = `
      <h2>New project brief</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Business:</strong> ${data.business}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget:</strong> ${data.budget}</p>
      <p><strong>Brief:</strong></p>
      <p>${data.message.replace(/\n/g, "<br />")}</p>
    `;
  await sendEmail({
    to: "hello@flowstudio.design",
    replyTo: data.email,
    subject: `New project brief — ${data.serviceType}`,
    html: briefHtml
  });
  const supabase = getAdminClient();
  const {
    data: existing
  } = await supabase.from("clients").select("id").eq("email", data.email).maybeSingle();
  if (!existing) {
    const {
      data: created,
      error: createError
    } = await supabase.auth.admin.createUser({
      email: data.email,
      email_confirm: true
    });
    if (createError) {
      console.error("Failed to create portal account:", createError.message);
    } else {
      await supabase.from("clients").insert({
        auth_user_id: created.user.id,
        email: data.email,
        business_name: data.business,
        client_type: "project",
        tier: null
      });
      await sendEmail({
        to: data.email,
        subject: "Your Flow Studio client portal is ready",
        html: `
            <h2>Thanks, ${data.name}!</h2>
            <p>We received your project brief and will be in touch shortly.</p>
            <p>You also now have access to your client portal, where you'll be able to track this project and any files we send your way.</p>
            <p><a href="https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login">Log in here</a> using this email address (${data.email}) — you'll receive a one-time code, no password needed.</p>
          `
      });
    }
  }
  return {
    success: true
  };
});
export {
  submitIntake_createServerFn_handler
};
