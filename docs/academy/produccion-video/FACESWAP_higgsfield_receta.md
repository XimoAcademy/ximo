# Face-swap del personaje en escenas Pinterest — receta Higgsfield

Objetivo: tomar las **escenas estéticas Pinterest** y **reemplazar solo la cara y el
pelo** por los del **personaje** (las 8 fotos de referencia), manteniendo idéntico
todo lo demás (ropa, pose, cuerpo, luz, fondo, encuadre).

> **Estado:** Higgsfield = Free, **0 créditos**, trial expirado (2026-07-14). **No se
> puede generar todavía.** Esta receta queda lista para pegar y correr en cuanto haya créditos.

## Modelo
- **Primario: `nano_banana_pro`** (Google, image-to-image) — acepta la escena objetivo
  **+ varias fotos de referencia** del personaje a la vez y edita solo lo indicado.
  Ajustes: `resolution: 2k`, aspect ratio = el de cada foto original (ver tabla).
- Alternativo: `soul_2` (Higgsfield Soul 2.0) — más realista para retrato, pero solo
  admite **1 imagen** de referencia; úsalo si Nano Banana no mantiene bien el parecido.

## Referencias del personaje (usar las 2–3 más nítidas de cara de frente)
Las 8 primeras fotos son el mismo personaje. Mejores para cara/pelo: la del Real
Madrid (polo turquesa, frente clara) y la selfie de cielo (frente + pelo visibles).
Sube 2–3 como `medias` junto con la escena objetivo.

## Instrucción reutilizable (pégala en `prompt` para cada escena)
```
Replace ONLY the face and the hair of the person in this photo with the face and
hair of the reference person. Keep everything else EXACTLY the same: clothing, body,
pose, hands, skin tone, lighting, background, framing, colors and photographic style.
Match the reference person's facial identity, hairstyle and hair color precisely, and
blend seamlessly with the scene's lighting.
Do NOT add or keep any of the following on the person: rings, tattoos, earrings,
chains, bracelets, watches, necklaces, or cigarettes. If the original photo shows any
of these, remove them and show clean skin. Keep eyewear/sunglasses only if present in
the original scene. Photorealistic, natural, no extra objects.
```

## Escenas objetivo (7) — qué quitar en cada una
Aspect ratio: elige el más cercano al de la foto. La mayoría son verticales → `3:4` o `9:16`.

| Archivo | Escena | Quitar (además del reemplazo cara+pelo) | AR |
|---|---|---|---|
| `29a6abd0` | Restaurante, camisa blanca | collar, arete, pulsera de la muñeca | 3:4 |
| `42d48c6a` | Piscina de noche, sin camisa | cualquier arete/cadena | 1:1 / 4:3 |
| `0a10b3d3` | Bar, camisa blanca, taza de cobre | collar de cruz, arete (mantén la bebida) | 3:4 |
| `283c191f` | Cuarto, camisa negra | collares, **tatuajes de antebrazos**, arete | 3:4 |
| `f4b08d01` | Cama, bata blanca | cadena fina del cuello (el pelo rubio se reemplaza) | 3:4 |
| `367109b0` | Balcón B&N, camisa negra | anillo de la mano | 3:4 |
| `5c369591` | Calle B&N, Audi, suéter crema | cadena fina (mantén las gafas de sol) | 3:4 |

## Flujo cuando haya créditos
1. `media_upload_widget` → subir las 2–3 referencias del personaje + la escena objetivo.
2. `generate_image` con `model: "nano_banana_pro"`, `resolution: "2k"`, el `prompt` de
   arriba, `medias` = [escena objetivo, ref1, ref2], `aspect_ratio` de la tabla.
3. Repetir por cada una de las 7 escenas. Si el parecido falla, reintentar con `soul_2`
   (1 sola referencia frontal) o añadir una referencia más nítida.
4. Revisar: cara/pelo del personaje, cero joyas/tatuajes/cigarros, resto intacto.

## Nota
Trabaja solo con la imagen/parecido del personaje que tú controlas (fotos propias).
Las escenas Pinterest son referencia de composición; el resultado es un set estético
coherente del personaje, no una foto real de esos lugares.
