# Ximo — Auditoría de enlaces externos

Fecha: 2026-07-07. Todos los enlaces externos del código fueron inventariados
(`https://` + `mailto:` en `app/` y `lib/`) y verificados por red donde fue posible.

## Inventario y veredicto

| Página / componente | URL | Estado | Problema | URL final | Razón |
|---|---|---|---|---|---|
| `app/app/sat-toefl/page.tsx` | https://www.khanacademy.org/digital-sat | ✅ Viva (página JS; carga en navegador) | Ninguno | Sin cambio | Prep oficial y gratuita del SAT digital (Khan Academy es el partner oficial de College Board) |
| `app/app/sat-toefl/page.tsx` | https://blog.prepscholar.com/the-ultimate-sat-study-guide-for-sat-prep | ✅ Viva | Ninguno — el contenido enlazado es gratuito ("They're all free… on our blog") | Sin cambio | Guía gratuita; no lleva a un paywall |
| `app/app/sat-toefl/page.tsx` | https://magoosh.com/toefl/best-free-toefl-resources/ | ✅ Viva | Ninguno — página de recursos gratuitos | Sin cambio | Curaduría de recursos TOEFL gratuitos |
| `app/app/sat-toefl/page.tsx` | https://www.ets.org/toefl/test-takers/ibt/prepare.html | ✅ Viva | Ninguno | Sin cambio | Fuente oficial (ETS) de preparación TOEFL |
| `app/page.tsx` (footer) + `app/build-log/page.tsx` | https://www.instagram.com/delfinmanny_/ | ✅ Viva (perfil "Manuel Zúñiga · Nadador" confirmado) | `rel="noreferrer"` sin `noopener` | Sin cambio de URL; `rel="noopener noreferrer"` añadido | Cuenta oficial del fundador |
| `app/page.tsx` (footer) + `app/build-log/page.tsx` | https://www.tiktok.com/@delfinmanny | ✅ Verificada en navegador 2026-07-08 (perfil "Manny", 6,013 seguidores) | `rel` incompleto | `rel="noopener noreferrer"` añadido | Cuenta oficial del fundador |
| `app/page.tsx` (footer) + `app/build-log/page.tsx` | https://www.youtube.com/@delfinmanny | ✅ Verificada en navegador 2026-07-08 (canal "Delfín Manny", 75 videos) | `rel` incompleto | `rel="noopener noreferrer"` añadido | Cuenta oficial del fundador |
| `app/page.tsx` (footer) + `app/build-log/page.tsx` | https://app.zoop.club/delfinmanny | ✅ Viva ("Manuel Zúñiga's exclusive community") | `rel` incompleto | `rel="noopener noreferrer"` añadido | Comunidad de pago del fundador; enlazada como "síguenos", no como recurso educativo |
| `app/app/comunidad/page.tsx` (nuevo) | https://discord.gg/fbz3Zyryf9 | ✅ Verificado vivo (servidor "Ximo") 2026-07-08 | — | Fallback en código + `NEXT_PUBLIC_DISCORD_INVITE_URL` para sobreescribir | QR real en `/public/discord-qr.png` (decodificación verificada); abre en pestaña nueva con `noopener noreferrer` y aviso "sitio externo" |
| `app/app/marcas/page.tsx` | `media_url` dinámico (archivo del anuncio) | n/a | — | Sin cambio | Ya usaba `target="_blank" rel="noopener noreferrer"` |
| `app/app/directorio/[slug]` y `app/app/universidades/[id]` | Sitios web de programas NCAA (datos de la BD) | n/a (dinámicos) | — | Sin cambio | Ya usaban `noopener noreferrer` |
| Varios | `mailto:ximoacademy@gmail.com`, `mailto:` a coaches | ✅ | — | Sin cambio | Correcto |

## Cambios aplicados

1. **`rel="noopener noreferrer"`** en todos los enlaces externos con `target="_blank"`
   (landing footer, build-log, lesson resources nuevos, botón de Discord).
2. **Pista visible de "sitio externo"**:
   - SAT/TOEFL: la insignia `↗` ahora dice "Sitio externo ↗".
   - Footer de la landing: nota "Enlaces a sitios externos".
   - Página de Discord: "Se abre en una pestaña nueva · sitio externo" + aviso de plataforma externa.
   - Recursos de lecciones con URL http: "Abrir ↗ (sitio externo)".
3. **Discord configurable**: `NEXT_PUBLIC_DISCORD_INVITE_URL` (documentado en `.env.example`).
   Sin la variable, el botón se muestra deshabilitado; nunca se enlaza un invite falso.

## Pendiente manual antes del lanzamiento

- Nada. Todos los enlaces externos quedaron verificados el 2026-07-08 (TikTok y YouTube
  en navegador; Discord vía API de invites; QR decodificado de vuelta a la URL correcta).
