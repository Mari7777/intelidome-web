import React from 'react'

/**
 * Okno konce léta (DESIGN.md 9.2) — proč se seje na konci léta. Nahoře
 * schematický průběh roku (bez číselné svislé osy): křivka vzduchu a křivka
 * půdy, která se za vzduchem opožďuje. Na jaře leží půda pod vzduchem
 * (je ještě chladná), koncem léta a na podzim nad ním (drží letní teplo).
 * Teplý pruh na přelomu léta a podzimu je okno, KDY sít. Kóta pod osou
 * začíná ve dni výsevu uvnitř okna a běží za něj: nese jedinou pointu, že
 * PO výsevu má zbývat 6–8 týdnů růstu (76 jednotek při 140 jednotkách na
 * roční období). Pruh a kóta jsou dvě značky se dvěma významy.
 *
 * Dole tři období pod sebou; řádek „Konec léta“ nese zmenšenou značku okna.
 * Akcent je teplý okr (půda, okno); voda v kresbě není, modrá tedy také ne.
 * Portrétová sazba 520 px, id s prefixem `ok-` (kresba žádné nepotřebuje).
 * Statická kresba — pointa je poloha okna vůči oběma křivkám.
 */
export const OknoKonceLeta: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 640">
    {/* Pointa kresby (9.2 p. 3) je jedna: po výsevu 6–8 týdnů růstu. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>6–8 týdnů růstu</text>
    <text className="sv-lbl" x="480" y="38" textAnchor="end">schematicky</text>

    {/* ── okno na přelomu léta a podzimu ──────────────────────── */}
    <text className="sv-lbl" x="330" y="80" textAnchor="middle">výsev</text>
    <rect x="290" y="92" width="80" height="218" fill="#b76a00" opacity="0.15" />
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="290" y1="92" x2="290" y2="310" />
      <line x1="370" y1="92" x2="370" y2="310" />
    </g>

    {/* ── křivky: půda se za vzduchem opožďuje ────────────────── */}
    <path d="M50 268 C 120 268, 165 116, 235 116 C 305 116, 380 284, 470 284" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M50 290 C 140 290, 200 130, 275 130 C 350 130, 400 252, 470 252" fill="none" stroke="#b76a00" strokeWidth="2.2" strokeLinecap="round" />
    <text className="sv-val" x="140" y="176" textAnchor="end">vzduch</text>
    <text className="sv-val" x="392" y="190">půda</text>

    {/* ── osa roku ────────────────────────────────────────────── */}
    <line x1="40" y1="310" x2="480" y2="310" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="50" y1="304" x2="50" y2="316" />
      <line x1="190" y1="304" x2="190" y2="316" />
      <line x1="330" y1="304" x2="330" y2="316" />
      <line x1="470" y1="304" x2="470" y2="316" />
    </g>
    <text className="sv-lbl" x="120" y="334" textAnchor="middle">jaro</text>
    <text className="sv-lbl" x="240" y="334" textAnchor="middle">léto</text>
    <text className="sv-lbl" x="424" y="334" textAnchor="middle">podzim</text>

    {/* ── kóta růstu PO výsevu: začíná ve dni výsevu uvnitř okna a běží
        za něj (≈ 7 týdnů při 140 jednotkách na roční období). Okno říká
        KDY sít, kóta KOLIK času má zbývat — dvě značky, dva významy
        (porota kola 01). ─────────────────────────────────────────── */}
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="330" y1="316" x2="330" y2="358" />
      <line x1="406" y1="310" x2="406" y2="358" />
      <line x1="330" y1="358" x2="406" y2="358" />
    </g>
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="330" y1="352" x2="330" y2="364" />
      <line x1="406" y1="352" x2="406" y2="364" />
    </g>
    <text className="sv-val" x="368" y="390" textAnchor="middle">6–8 týdnů</text>
    <text className="sv-lbl" x="368" y="412" textAnchor="middle">růstu po výsevu</text>

    {/* ── tři období výsevu ───────────────────────────────────── */}
    <line x1="40" y1="436" x2="480" y2="436" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />

    <text className="sv-val" x="80" y="472">Jaro</text>
    <text className="sv-lbl" x="210" y="472">půda ještě chladná,</text>
    <text className="sv-lbl" x="210" y="493">léto přijde brzy</text>

    <text className="sv-val" x="80" y="532">Léto</text>
    <text className="sv-lbl" x="210" y="532">povrch rychle vysychá</text>

    {/* značka okna = týž pruh mezi dvěma konstrukčními linkami, zmenšený */}
    <rect x="42" y="580" width="24" height="14" fill="#b76a00" opacity="0.15" />
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="42" y1="580" x2="42" y2="594" />
      <line x1="66" y1="580" x2="66" y2="594" />
    </g>
    <text className="sv-val" x="80" y="592">Konec léta</text>
    <text className="sv-lbl" x="210" y="592">teplá půda,</text>
    <text className="sv-lbl" x="210" y="613">chladnější vzduch</text>
  </svg>
)
