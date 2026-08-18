# Vize webu InteliDome

## Co stavíme

Obsahový web a později e-shop **www.intelidome.com** — chytrá závlaha
a automatizace zahrady. Web je výkladní skříň a zdroj návštěvnosti;
obchodní data (objednávky, doklady, sklad, daně) žijí v ERP, které už
běží v ostrém provozu.

## Proč obsah před obchodem

Doména potřebuje návštěvnost a důvěru dřív, než se otevře pokladna.
Rok publikování (blog, plánovač závlahy) znamená: vyhledávače nás znají,
zákazníci přicházejí a majitel se mezitím sžije s tím, jak se web tvoří
a provozuje — v ostrém prostředí, ne na zkoušku. Stojící web s obsahem
je zároveň podmínka aktivace Stripe live účtu.

## Fáze

1. **F1 — Blog naživo**: Payload redakce, design system InteliDome,
   nasazení na Vercel, doména, první články.
2. **F2 — Plánovač závlahy**: interaktivní nástroj (vlajková loď webu),
   lead magnet.
3. **F3 — Obchod**: katalog + Stripe Checkout; hranicí s ERP jsou
   podepsané webhooky (ERP je připravené a čeká).
4. **F4 — Medusa**: plnohodnotný e-commerce backend (fáze 2 dle ERP
   ADR-008); web se přepojí, obsah zůstává v Payloadu.

## Non-goals

- Web nikdy nesdílí kód ani databázi s ERP (hranice = webhooky a eventy).
- Žádná vlastní fakturace/sklad na webu — to je práce ERP.
