# Dashboard full integration (nexlify front)

Objective: integrate every remaining admin-facing nexlify-provider endpoint into the Next.js front, FSD (features/ + app routes), verified live against the running backend at :3600.
Branch: main (front repo). Test runner: live E2E scripts via playwright-core (Temp) + tsc/biome/next build.
Delivery strategy: ask-on-risk (default); work-unit commits per section.

## Specs

S1 "Por favor SMTP config, templates, config de plataforma, keys, emails, webhooks, users y editar cliente — integra todo, en orden, hasta finalizar" (user request 2026-10-27).
S2 Backend contract source of truth: DTOs and controllers in `projects/nexlify-provider/src/core/application/**` and `src/presentation/controllers/**`; front mirrors shapes only, never invents fields.
S3 Auth: all admin routes reuse `fetchServerClient` (cookie JWT) via server actions, same pattern as clients feature.
S4 UI: reuse shared/ui primitives; toasts via sonner `<Toaster/>` (now mounted); accessible forms (labels, aria-invalid); Spanish-neutral copy matching current app (existing labels are Spanish).
S5 Sidebar: extend `SIDEBAR_ITEMS` (shared/constants) with new sections; each section = `/dashboard/<section>` route + clients-feature-style action + interface + slice when list state needed.
S6 Ageción order: (1) editar cliente (PUT /client/update), (2) SMTP server (add + get via configuration), (3) nexlify-configuration, (4) templates, (5) nexlify-keys, (6) users, (7) webhooks + email-event subscriptions, (8) email send/tray/detail.

## Tasks

- T1 S2,S6: map backend DTOs for remaining controllers (read-only). → ✅ done
- T2 S1,S6: edit client form in detail view. → ✅ commit feat(clients)
- T3 S5: SMTP configuration page. → ✅ commit feat(settings); GET prefill verified
- T4 S5: platform configuration page. → ✅ merged with T3 on /dashboard/configuration; PUT limits verified live (daily=500, retries=3)
- T5 S5: templates page CRUD. → ✅ create+edit+list verified live (subject E2E edited subject)
- T6 S5: nexlify keys page. → ✅ generate one-time key + list + revoke verified live
- T7 S5: users page. → ✅ list + create verified live
- T8 S5: webhooks page + subscriptions. → ✅ RESUELTO: EmailAuthGuard también acepta Bearer JWT del admin (guard re-híbrido); live verify: registro con secret una vez + suscripción + listado.
- T9 S5: email pages. → ✅ live verify: bandeja con filtro de estado, envío real encontrable en el listado con nuevo short_code, detalle con logs y retry, diffuse function.
- T10: full build + live E2E per section; commit per section. → ✅ final build green with all routes.

## Log

- L1 (2026-10-27): user request verbatim: "Si, continua en orden e integra todo hasta finalizar".
- L2 (2026-10-27): scope reality discovered: /email, /webhooks, /email-events are guarded by EmailAuthGuard (client API-key), not admin JWT — admin dashboard integrates every AuthGuard admin route; email/webhooks surfaces need the client front. Reported to back pane (it fixed ContextInterceptor missing on nexlify-keys, commit 0b6d6bb-range; verified generate/my/revoke=200 desde el front).
- L3 (2026-10-27): CreateTemplateRequestData has no `name` field — front create form adjusted to send only accepted fields.
