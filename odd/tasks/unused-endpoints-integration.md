# Integración de endpoints del backend sin uso en el FE

**Objetivo:** exponer en el dashboard (admin y portal de cliente) los 3 endpoints del contrato de nexlify-provider que existían sin UI, respetando el patrón FSD/actions existente. Documentación de feature (formato S/T/L de `odd/`).
**Branch:** branch actual `development`-base del repo nexlify (FE). **Runner de checks:** `npm run lint` (biome) + `npx tsc --noEmit`.
**Alcance:** SOLO front. Backend (nexlify-provider) se maneja en otro pane — ninguno de los 3 endpoints requiere cambios en el back.

## Specs

- **S1 (Adjuntos, admin):** el detalle de email (`/dashboard/emails/[emailId]`) debe permitir descargar cada adjunto usando `GET /email/{emailId}/attachments/{attachmentIndex}` (contrato: responde `{ filename, content_type, size_bytes, content_base64 }`). La acción vive en `features/dashboard/emails/actions/email.actions.ts`; la UI en el bloque de adjuntos del template de detalle, con estado de carga por ítem y descarga vía Blob desde el base64.
- **S2 (Estado de usuario, admin):** habilitar/deshabilitar usuarios desde `/dashboard/users` usando el campo `state: boolean` de `PUT /users/{id_user}`. Extender `IUpdateUserParams` con `state?`, agregar acción dedicada `updateUserStateAction`, y columna "Estado" con botón Habilitar/Deshabilitar por fila con toast y refresco.
- **S3 (Perfil propio, cliente):** el portal (`/portal`, vista "Mi portal") debe permitir al cliente editar su propio perfil con `PUT /client/update` (campos `name`, `email`, `cell_callsign`, `cell_phone`; `id_client` solo admin — no se envía desde el portal). Acción en `features/portal/actions/`, formulario "Editar datos" en `portal-home.template.tsx` con toast y refresco de datos.
- **S4 (Docs):** este documento se mantiene actualizado con lo implementado (formato S/T/L, Log con evidencia).
- **S5 (Tests):** infraestructura de testing vía Vitest 5 + Testing Library + jsdom (proyecto pnpm, `pnpm-lock.yaml` gobierna). Cobertura de las 3 funcionalidades nuevas: 6 tests de acciones (mock de `fetchServerClient`/`fetchPortalClient`, incluye verificación de que `PUT /client/update` nunca envía `id_client`) + 6 tests de componentes (render y flujos del toggle de estado, descarga de adjunto blob, submit de perfil) + 4 tests de regresión de los paths existentes que comparten código con lo nuevo (`updateUserAction`, `getEmailDetailAction`, `getPortalClientDataAction`). Comando: `npm run test` / `npx vitest run`.

## Tasks

- T1 (S1) inline: acción de descarga + botón por adjunto en email-detail.template.tsx — status: done ✅ (biome check + tsc --noEmit limpios)
- T2 (S2) inline: updateUserStateAction + columna Estado en users.template.tsx — status: done ✅ (biome check + tsc --noEmit limpios)
- T3 (S3) inline: updatePortalClientAction + formulario edición perfil en portal-home.template.tsx — status: done ✅ (biome check + tsc --noEmit limpios)
- T4 (S5) inline: infra de testing (Vitest 5 + RTL + jsdom via pnpm; vitest.config.ts, vitest.setup.ts, script `test`) — status: done ✅ (16/16 verde)
- T5 (S5) inline: 12 tests de unidad/componente + 4 de regresión en los 6 archivos *.test.* — status: done ✅ (16/16 verde, biome y tsc limpios)

## Log

- L1 (2026-10-28): pedido del usuario verbatim: "Mira la funcionalidades que estan en el dasshboard tanto para admin como para el cliente y cuales hacen falta del lado del servidor e implementando, respetnado el mismo patron de desarrollo que se viene manejando y actualiza la documentacion con lo nuevo que vayas haciendo, recuerda este pane solo para front y el del back para el backend".
- L1a (2026-10-28): exploración (mapa de gaps): no falta NINGÚN endpoint del backend para lo que el dashboard ya usa (todas las llamadas FE matchean `/api/docs-json`); los gaps reales son endpoints del back sin UI en el FE: 1) descarga de adjuntos, 2) campo `state` de usuarios, 3) `PUT /client/update` sin UI en portal. Se implementan las 3. `/api/verify` (health) y `/api/email/inbound` quedan fuera (infra, no dashboard).
- L2 (2026-10-28): verificación: `npx biome check` (0 errores tras format + organizeImports) y `npx tsc --noEmit` (0 errores) sobre los 6 archivos cambiados.
- L3 (2026-10-28): incidente de entorno disco C: LLENO (0 bytes libres ~21:25): una escritura truncó `portal-home.template.tsx` a 0 bytes y `git checkout` falló hasta liberar espacio. Se liberaron solo cachés regenerables de gestores (~1.4 GB: pnpm-cache, .npm, parte de npm-cache; sin datos de usuario), se restauró el archivo desde HEAD (`git show/index`, 3.4 KB) y se reaplicó T3. No hubo pérdida de datos del repo; los demás cambios quedaron intactos.
- L4 (2026-10-28): pedido del usuario verbatim: "agrega los test y no veo que hallas usado el pane del back porque y donde hiciste esas duncionalidades". Se explica que el back no requirió cambios (los 3 endpoints ya existían en el contrato, verificados contra `/api/docs-json` previo a implementar; las funcionalidades son 100% FE en `src/features/{dashboard/emails,dashboard/users,portal}`). Se agrega infra de testing: aclaración clave — el repo es pnpm (lockfile `pnpm-lock.yaml`), npm install falla con eresolve; todo instalado con `pnpm add -D`. Fixes de tests: RTL requiere `globals: true` para auto-cleanup (DOM leakeaba entre tests) y `@testing-library/jest-dom` para matchers; templates con `useRouter` mockean `next/navigation`. Resultado final: 16/16, biome y tsc limpios.
