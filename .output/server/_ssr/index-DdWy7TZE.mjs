import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import "../_libs/seroval.mjs";
import { A as ArrowRight, X, M as Menu, a as ArrowDownRight, C as Check } from "../_libs/lucide-react.mjs";
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
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
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
const submitIntake = createServerFn({
  method: "POST"
}).inputValidator(IntakeSchema).handler(createSsrRpc("dbc5c64a72e5c37ef7dda6c1e8151a7452ac6a6525097c03d85e5c944a253eac"));
const services = [{
  title: "Digital & print graphics",
  text: "Social sets, ads, packaging, and signage — designed for the format it ships in.",
  type: "Project-based",
  color: "dark"
}, {
  title: "Logo & brand design",
  text: "Mark, palette, type system, and guidelines that hold up across every touchpoint.",
  type: "Project-based",
  color: "mid"
}, {
  title: "Website design & dev",
  text: "Designed and built — from a single landing page to a complete multi-page site.",
  type: "Project-based",
  color: "light"
}, {
  title: "Flyer design",
  text: "Recurring flyers for promos, events, and specials — submit a request, get a design back.",
  type: "Subscription",
  color: "blend"
}];
const plans = [{
  name: "Starter",
  price: "99",
  description: "Best for small businesses that post occasionally.",
  features: ["2 digital flyers per month", "1 revision per flyer", "48–72 hour turnaround", "Instagram + Facebook sizes"],
  color: "dark",
  checkoutUrl: "https://buy.stripe.com/9B6cN40NN0CSg1Q16c9sk00"
}, {
  name: "Growth",
  note: "Best value",
  price: "175",
  description: "Content-ready, with something new to post every week.",
  features: ["4 digital flyers per month", "2 revisions per flyer", "All social media sizes", "Priority turnaround", "Basic captions included"],
  color: "mid",
  featured: true,
  checkoutUrl: "https://buy.stripe.com/9B68wObsrbhwcPE5ms9sk01"
}, {
  name: "Premium",
  price: "300",
  description: "For brands that need a consistent marketing rhythm.",
  features: ["8 digital flyers per month", "2 revisions per flyer", "Multiple platform sizes", "Priority turnaround", "Captions + promo wording", "1 animated flyer monthly"],
  color: "light",
  checkoutUrl: "https://buy.stripe.com/3cIfZg2VV1GWg1Q0289sk02"
}];
const websitePlans = [{
  name: "Starter Site",
  price: "900",
  description: "A clean, professional single-page site to get you online fast.",
  features: ["1-page custom layout", "Mobile optimized", "Contact form included", "1 week turnaround", "1 round of revisions"],
  color: "dark"
}, {
  name: "Growth Site",
  note: "Most popular",
  price: "2,400",
  description: "A full multi-page site built around your brand and services.",
  features: ["Up to 6 pages", "Fully custom design", "SEO setup included", "2 rounds of revisions", "2–3 week turnaround", "30 days of post-launch tweaks"],
  color: "mid",
  featured: true
}, {
  name: "Full Custom Build",
  price: "4,500+",
  description: "For businesses that need integrations, animation, or complex features.",
  features: ["Unlimited pages", "Custom functionality & integrations", "Motion & interaction design", "Priority turnaround", "Dedicated revisions", "30 days of post-launch support"],
  color: "light"
}];
const hostingPlans = [{
  name: "Basic Hosting",
  price: "20",
  features: ["Reliable hosting", "SSL & security included", "Uptime monitoring"]
}, {
  name: "Hosting + Edits",
  price: "40",
  features: ["Everything in Basic", "Up to 2 small edits/month", "Domain renewal handled"],
  featured: true
}, {
  name: "Priority Care",
  price: "65",
  features: ["Everything in Edits", "Priority email support", "Same-week update turnaround"]
}];
const steps = [["Subscribe", "Pick a plan. No contracts — pause or cancel whenever the calendar gets quiet."], ["Submit a request", "Drop your flyer brief into the queue: event, promotion, menu, or announcement."], ["Get a draft", "A considered, on-brand design lands back in your inbox, ready to review."], ["Revise & ship", "Request changes if needed, then download polished print- and web-ready files."]];
function RegMark({
  position
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: `regmark ${position}`, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "7", fill: "none", stroke: "currentColor" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 0v24M0 12h24" })
  ] });
}
function FlowStudio() {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const [intakeForm, setIntakeForm] = reactExports.useState({
    name: "",
    email: "",
    business: "",
    serviceType: "Logo & brand design",
    budget: "",
    message: ""
  });
  const [intakeStatus, setIntakeStatus] = reactExports.useState("idle");
  function updateIntakeField(field, value) {
    setIntakeForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }
  async function handleIntakeSubmit(e) {
    e.preventDefault();
    setIntakeStatus("sending");
    try {
      await submitIntake({
        data: intakeForm
      });
      setIntakeStatus("sent");
    } catch {
      setIntakeStatus("error");
    }
  }
  reactExports.useEffect(() => {
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), {
      threshold: 0.12
    });
    document.querySelectorAll(".reveal").forEach((element) => reveal.observe(element));
    return () => reveal.disconnect();
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "site-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap nav-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "logo", href: "#top", "aria-label": "Flow Studio home", onClick: closeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-full1.png", alt: "Flow Studio", className: "logo-image" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "desktop-nav", "aria-label": "Primary navigation", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", children: "Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#subscription", children: "Flyer subscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#websites", children: "Website pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", children: "How it works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#work", children: "Work" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "nav-login", href: "https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login", children: "Client login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "nav-cta", href: "#intake", children: [
            "Start a project ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "menu-button", type: "button", onClick: () => setMenuOpen(!menuOpen), "aria-expanded": menuOpen, "aria-label": "Toggle navigation", children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: `mobile-nav ${menuOpen ? "open" : ""}`, "aria-label": "Mobile navigation", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", onClick: closeMenu, children: "Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#subscription", onClick: closeMenu, children: "Flyer subscription" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#websites", onClick: closeMenu, children: "Website pricing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", onClick: closeMenu, children: "How it works" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#work", onClick: closeMenu, children: "Work" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://flow-studio-portal-e19up3nkk-fl-ow-studio.vercel.app/login", onClick: closeMenu, children: "Client login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#intake", onClick: closeMenu, children: [
          "Start a project ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "hero", id: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proof hero-enter", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "tl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "tr" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "bl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "br" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proof-meta mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Job № 0417 — Proof approved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "swatches", "aria-label": "Press color swatches", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Run: open",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Press: online"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "approval-stamp", children: [
        "Design",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "on press"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-layout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow mono", children: "Independent creative studio / Est. 2020" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "display", children: [
            "Brand, print",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "& web design",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Plus flyers,",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "on repeat",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-copy", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Full-service graphic design for logos, brand identity, and websites — with a flyer subscription that keeps fresh work landing every month, no re-briefing required." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "button-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#intake", className: "button button-solid", children: [
              "Start a project ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { size: 18 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#subscription", className: "button button-outline", children: "See flyer plans" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "proof-footer mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CMYK / 300 DPI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Trim 1180 × 650" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sheet 01 of 01" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "services section", id: "services", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap reveal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", children: "01 / Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
          "Every format",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "your brand touches."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "One studio from first sketch to final export — digital, print, identity, and screen." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "service-grid", children: services.map((service, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "service-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `service-tab ${service.color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "service-number mono", children: [
          "0",
          index + 1
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: service.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: service.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "service-type mono", children: service.type })
      ] }, service.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "subscription section", id: "subscription", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap reveal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono light-label", children: "02 / Flyer subscription" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading subscription-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
          "Stay consistent.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Stay visible." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Professional flyers every month, without booking one by one. Send requests through your queue and get on-brand work back on schedule." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "plan-grid", children: plans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `plan ${plan.featured ? "featured" : ""}`, children: [
        plan.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "best-value mono", children: "Most ordered" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "plan-name mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: plan.color }),
          plan.name,
          plan.note && ` / ${plan.note}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "price", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "$" }),
          plan.price,
          /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/ month" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "plan-description", children: plan.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tear-line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: plan.features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 15 }),
          feature
        ] }, feature)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: plan.checkoutUrl, className: `button ${plan.featured ? "button-paper" : "button-outline"}`, children: [
          "Choose ",
          plan.name,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
        ] })
      ] }, plan.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "addons", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mono", children: "Add to any run" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Motion flyer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+$40–75" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rush delivery / under 24 hrs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+$35" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Extra revision" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+$15–25" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Additional size" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+$10" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "website-pricing section", id: "websites", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap reveal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", children: "02.5 / Website design & dev" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
          "A site built",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "to convert."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "One-time project pricing — pick the scope that fits, or start small and grow into it. Payment plans available on request." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "plan-grid website-grid", children: websitePlans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: `plan website-plan ${plan.featured ? "featured" : ""}`, children: [
        plan.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "best-value mono", children: "Most popular" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "plan-name mono", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: plan.color }),
          plan.name,
          plan.note && ` / ${plan.note}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "price", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "$" }),
          plan.price
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "plan-description", children: plan.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tear-line" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: plan.features.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 15 }),
          feature
        ] }, feature)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#intake", className: `button ${plan.featured ? "button-solid" : "button-outline"}`, children: [
          "Get started",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 16 })
        ] })
      ] }, plan.name)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hosting-block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", style: {
          marginTop: 60
        }, children: "Optional / Ongoing hosting & care" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hosting-intro", children: "Skip the hassle of managing hosting yourself — we keep your site fast, secure, and updated." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hosting-grid", children: hostingPlans.map((plan) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `hosting-card ${plan.featured ? "featured" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hosting-name mono", children: plan.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hosting-price", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "$" }),
            plan.price,
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/mo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 13 }),
            f
          ] }, f)) })
        ] }, plan.name)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "how section", id: "how", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap reveal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", children: "03 / How it works" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
          "A queue,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "not a quote."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Less admin. More finished work. A simple process designed to keep momentum moving." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "steps", children: steps.map(([title, text], index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "step", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "step-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mono", children: [
            "0",
            index + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: text })
      ] }, title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "work section", id: "work", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap reveal", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", children: "04 / Selected work" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-heading", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
          "Recent jobs,",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "fresh off press."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A mix of identities, websites, and campaign work made to be seen in the real world." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "work-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "work-card work-brand", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "poster-brand", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "LOW",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "TIDE"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "COFFEE CO." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "work-caption", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Low Tide Coffee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "mono", children: "Brand identity / 2026" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "work-card work-web", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-bar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FORM / 07" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "Objects for",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "quiet rooms."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { children: "Explore collection" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "work-caption", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Form House" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "mono", children: "Web design / 2026" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "work-card work-flyer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flyer-stack", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flyer back", children: [
              "FRI",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "28"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flyer front", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "AFTER DARK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "HOUSE",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "GUESTS"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "10PM — LATE" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "work-caption", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "House Guests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "mono", children: "Flyer series / 2025" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "final-cta", id: "intake", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wrap reveal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cta-proof", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "tl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "tr" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "bl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(RegMark, { position: "br" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-label mono", children: "Start here / New business" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "display", children: [
        "Tell us what",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "you're building",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "One-off project or ongoing flyers — either way, it starts with a short brief and an honest conversation." }),
      intakeStatus === "sent" ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
        marginTop: 24,
        fontWeight: 600
      }, children: "Got it — thanks! We'll be in touch shortly." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleIntakeSubmit, style: {
        display: "grid",
        gap: 14,
        maxWidth: 480,
        margin: "28px auto 0",
        textAlign: "left"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Your name", value: intakeForm.name, onChange: (e) => updateIntakeField("name", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", placeholder: "Email address", value: intakeForm.email, onChange: (e) => updateIntakeField("email", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Business / brand name", value: intakeForm.business, onChange: (e) => updateIntakeField("business", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: intakeForm.serviceType, onChange: (e) => updateIntakeField("serviceType", e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Logo & brand design" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Website design & dev" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Digital & print graphics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Flyer subscription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Something else" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, placeholder: "Budget range (e.g. $500–1000)", value: intakeForm.budget, onChange: (e) => updateIntakeField("budget", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 4, placeholder: "Tell us about the project", value: intakeForm.message, onChange: (e) => updateIntakeField("message", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", className: "button button-solid", disabled: intakeStatus === "sending", children: [
          intakeStatus === "sending" ? "Sending…" : "Submit project brief",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 17 })
        ] }),
        intakeStatus === "error" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
          color: "#a31e22",
          fontSize: 13
        }, children: "Something went wrong sending that — try again, or email email@flowstudiogrfx.com directly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "button-row centered", style: {
        marginTop: 20
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#subscription", className: "button button-outline", children: "View flyer plans" }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap footer-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "logo footer-logo", href: "#top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/logo-full1.png", alt: "Flow Studio", className: "logo-image" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono", children: "Independent design studio / © 2026" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "mono footer-email", href: "mailto:email@flowstudiogrfx.com", children: "email@flowstudiogrfx.com" })
    ] }) })
  ] });
}
export {
  FlowStudio as component
};
