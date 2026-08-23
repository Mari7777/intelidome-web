# ADR-005 — Asymetrická sazba figur v článku

**Stav:** přijato · **Datum:** 2026-08-23 · **Nahrazuje část:** DESIGN.md 8.2 (v2.0)

## Kontext

Design-loop nad článkem `jak-navrhnout-automatickou-zavlahu` prošel v kole 11
se skóre 4·4·4·4·4·4 a nulou kritických nálezů. Přesto majitel po prohlédnutí
celé stránky namítl, že článek čte **„jako by byl napsaný na toaletním papíru"**
— jeden úzký sloupec, text i obrazy pod sebou, a že takovou stránku na Sonosu
nenašel.

Námitka je oprávněná a **porota ji chytit nemohla**: šest lenzí měřilo proti
`DESIGN.md`, a ten sám v 8.2 předepisoval „1 SVG figura v krémovém panelu"
bez jakéhokoli pravidla o šířce nebo ukotvení. Systém tu monotónnost učil.

Měření potvrdilo diagnózu: prose 700 px na střed (levý okraj 370 na 1440),
figury 960 px na střed (levý okraj 240). Rozdíl **130 px na stranu** je
opticky nerozeznatelný, takže pět figur téhož tvaru — široký, nízký, krémový,
zaoblený — vytvořilo stuhu přes 11 000 px.

Systém přitom lepší vzor **už znal**: 8.3 ř. 4 (landing page) má „3 střídavé
2sloupcové bloky text+obraz". Článek ho jen nedostal.

## Rozhodnutí

Přidat do 8.2 novou podsekci **8.2b Asymetrická sazba figur** a bumpnout
DESIGN.md na **2.1**.

Text zůstává na 700 px — širší řádek se hůř čte a délka řádku je už vedená
jako samostatná vada dokumentu. Mění se **jen obraz**: figura se ukotví
k jedné hraně textu a přeteče do protějšího okraje, kapitoly se ve stranách
střídají, a jedna fotografie za článek smí jít přes celou šířku jako předěl.

Mřížka článku dostala linku `edge` přesně o okraj od kraje stránky, takže
ukotvená figura si drží radius panelu a nedotýká se hrany viewportu.

## Zvažované alternativy

| Varianta | Proč ne |
|---|---|
| Dvousloupcové bloky text+obraz (8.3 ř. 4) | Silnější zásah do rytmu; článek by se přiblížil produktové stránce. Zůstává jako možnost pro delší články. |
| Rozšířit prose na 820–900 px | Nejmenší práce, ale zhoršuje čitelnost a neřeší monotónnost — pruh by byl jen širší. |
| Nechat beze změny | Porota prošla, ale majitel je vlastníkem vkusu značky a námitka je věcná. |

## Důsledky

- Blok `Figure` má nové pole **Sazba** (`layout`): v ose / ukotvit vlevo /
  ukotvit vpravo / přes celou šířku.
- Naměřeno po zásahu (1440 px): próza 370/700 beze změny, figury
  370→1400, 40→1070, 370→1400, 0→1440, 40→1070. Vodorovný přetok nula.
- Pod 900 px se offsety skládají zpět do osy; ověřeno na 768, 393 i 320 px.
- **Vedlejší zisk:** figury se kreslí na 1030 px místo 880, takže popisky
  12 px jsou blíž nativní velikosti — dřívější nález o zmenšování měřítka
  se tím zmírnil.
- Full-bleed je vyhrazený fotografii. Schéma s popisky ho neunese, protože
  se rozjede měřítko kresby.
