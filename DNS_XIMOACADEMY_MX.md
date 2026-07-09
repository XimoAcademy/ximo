# DNS de ximoacademy.mx — registros pendientes en Akky

Estado: 2026-07-08. Todo lo demás ya está configurado (Resend, Vercel, Stripe LIVE).
**Este es el ÚNICO paso manual restante**: entrar a akky.mx → Iniciar sesión →
Mis dominios → ximoacademy.mx → Administrar DNS (zona DNS) y agregar estos registros.
(O simplemente inicia sesión en Akky y pídeme continuar: yo los pego.)

## 1. Para el sitio (Vercel) — la app quedará en https://www.ximoacademy.mx

| Tipo  | Nombre/Host | Valor                                |
|-------|-------------|--------------------------------------|
| A     | @           | 216.198.79.1                         |
| CNAME | www         | 59ad0f69963df8a8.vercel-dns-017.com. |

## 2. Para correos (Resend) — permite enviar desde hola@ximoacademy.mx

| Tipo | Nombre/Host       | Valor                                 | Prioridad |
|------|-------------------|---------------------------------------|-----------|
| TXT  | resend._domainkey | (valor DKIM completo, abajo)          | —         |
| MX   | send              | feedback-smtp.us-east-1.amazonses.com | 10        |
| TXT  | send              | v=spf1 include:amazonses.com ~all     | —         |
| TXT  | _dmarc            | v=DMARC1; p=none;                     | —         |

Valor DKIM completo (una sola línea, sin espacios extra):

```
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtRNJYf/a0sKyLJEmHGkF8a8SVW6UeBFdOcVuUYoEDb/B3fvHfENC9sog3Twt2xxdLi7k7W3q0glXEKxoRjahfYsSepZ3IfB+/zGGF9ITZK+INrnKe5sNlt66vW7lmYuK/uPC5/7T0XDQXR1piN5IEQUe172A4ULg7SzIBk7rgQQIDAQAB
```

## 3. Después de agregar los registros (yo puedo hacer esto si me avisas)

1. En resend.com/domains → ximoacademy.mx → "I've added the records" / Verify
   (puede tardar de minutos a horas por propagación DNS).
2. Al verificarse, cambiar `EMAIL_FROM` en Vercel a: `Ximo <hola@ximoacademy.mx>`
   y hacer redeploy — desde ese momento los correos a anunciantes funcionan.
3. En Vercel → Domains, ximoacademy.mx pasará a "Valid Configuration" solo.
4. Cambiar `NEXT_PUBLIC_SITE_URL` y `NEXT_PUBLIC_APP_URL` en Vercel a
   `https://www.ximoacademy.mx` y redeploy (hasta entonces deben seguir en
   ximo-theta.vercel.app para que los redirects de Stripe no se rompan).

Notas:
- En Akky el host a veces se captura con el dominio completo
  (ej. `send.ximoacademy.mx`); usa el formato que Akky te muestre.
- El registro MX de `send` NO afecta tu correo normal: es un subdominio
  exclusivo de Resend. No toques los MX de `@` si algún día configuras
  buzones de correo del dominio.
