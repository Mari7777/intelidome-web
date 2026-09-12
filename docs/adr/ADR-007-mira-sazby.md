# ADR-007 — Míra sazby: 33 em, ne 700 px

**Stav:** přijato 2026-09-12 · **Souvisí:** ADR-006 (mřížka v3), DESIGN.md 4.3 p. 4, 8.2a

## Kontext

DESIGN.md 4.3 p. 4 předepisuje prózu na šířce `--id-maxw-prose` = 700 px
s poznámkou „≈ 65 znaků". Porota to naměřila už u článku 1 (82–97 znaků)
a dvakrát adjudikovala do koše B; u článku 2 to porotce typografie zvedl
na kritický nález: `.id-article > p` 700 px / SF Pro 17 px → **průměr
87,4 znaku, maximum 94** (32 z 37 odstavců nad 80); `li` 677 px → 83,7;
`.id-split__p` 652 px → 81,1; callout 15 px v 724 px → **112**. Rubrika
skillu říká: odstavec nad 80 znaků = kritické. Systém si tedy odporoval:
šířka sloupce byla navržená pro 65 znaků, ale písmo v ní dává 87.

Zúžit sloupec nejde: mřížka v3 (ADR-006) je součet dvou sloupců a mezery
(A = 322, B = 652, g = 56 → obsah 700, mimoosová figura 1030, pás 1360)
a jiná šířka obsahu tenhle součet rozbije. Zvětšit písmo na 19 px dá
78 znaků — pod hranicí, ale daleko od cíle a bez rezervy.

## Rozhodnutí

1. **Sloupec a míra jsou dvě různé věci.** Sloupec `content` zůstává
   700 px (osa 370/1070, mřížka se nemění). Nový token
   `--id-measure: 33em` je **míra textu** uvnitř sloupce: při 17 px
   = 561 px ≈ 70 znaků, při 15 px (callout) = 495 px ≈ 70 znaků,
   při 13,5 px (popisek) = 446 px ≈ 62 znaků. Míra v `em` drží počet
   znaků nezávisle na velikosti písma.
2. Míra se uplatňuje **pravým odsazením, ne zúžením boxu**:
   `padding-right: max(0px, calc(100% - var(--id-measure)))`. Box
   odstavce zůstává 700 px, takže osy mřížky (a přejímka
   `layout-check`) se nehnou; text jde na 561 px a zbytek je vzduch
   vpravo — jako v každé editorial sazbě, kde text nevyplňuje sloupec
   od kraje ke kraji.
3. Platí pro všechny prozaické uzly: `.id-article > p`, `li`,
   `.id-split__p`, text calloutu, odpovědi FAQ, prózu produktového
   pásu, figcaption (tam už 62ch z 8.2b — beze změny). Neplatí pro
   titulky, lead souhrnu (má vlastní 21 px / 66 znaků) a centrované
   CTA (52–56ch).
4. Tělo prózy dostává předepsaný tracking −0,01 em (4.2), který
   dosud nebyl nasazený.

## Důsledky

- DESIGN.md 4.3 p. 4 opravit: „700 px = sloupec; míra textu 33 em
  (≈ 70 znaků); 700 px ≈ 65 znaků NEPLATÍ".
- V dvousloupci vedle kresby zůstane vpravo od textu ~90 px vzduchu
  (652 − 561). Je to méně než mezera sloupce (56) + vnitřní okraj
  panelu (32), takže díra mezi textem a kresbou nevzniká.
- Kdo bude chtít 65 znaků přesně, změní jeden token, ne mřížku.
