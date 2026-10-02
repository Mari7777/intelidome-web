import React from 'react'

/**
 * Půdní teploměr (DESIGN.md 9.2) — s výsevem se neřídíme vzduchem, ale
 * teplotou půdy. Vlevo řez holou půdou před výsevem (14 px na cm) se
 * zapíchnutým teploměrem: hrot sedí v 5 cm, kde se měří. Vpravo svislá
 * stupnice teploty půdy 0–30 °C (8 px na stupeň) s ryskami 0, 10, 15, 25, 30.
 * Jediná pointa: začíná se nad 10 °C — ryska 10 °C je proto delší než
 * ostatní. Akcent je teplý okr pásma 15–25 °C, příznivého pro klíčení;
 * voda v kresbě není, modrá tedy také ne.
 *
 * Portrétová sazba 520 px, id s prefixem `pt-` (kresba žádné nepotřebuje).
 * Popisky mají rezervu na telefonní sazbu 18/21 jednotek. Statická kresba —
 * pointa je práh na stupnici, pohyb by ji nezpřesnil.
 */
export const PudniTeplomer: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 400">
    {/* Pointa kresby (9.2 p. 3) je jedna: s výsevem začínáme nad 10 °C. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Nad 10 °C</text>

    {/* ── kóta hloubky měření ─────────────────────────────────── */}
    <text className="sv-val" x="40" y="251">5 cm</text>
    <text className="sv-lbl" x="40" y="273">hloubka</text>
    <text className="sv-lbl" x="40" y="294">měření</text>
    <line x1="146" y1="220" x2="146" y2="290" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="140" y1="220" x2="152" y2="220" />
      <line x1="140" y1="290" x2="152" y2="290" />
    </g>

    {/* ── řez půdou: holá země před výsevem ───────────────────── */}
    <rect x="162" y="220" width="120" height="120" fill="#6b5138" opacity="0.9" />
    {/* hladina hrotu: 5 cm pod povrchem */}
    <line x1="162" y1="290" x2="212" y2="290" stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round" />
    <path d="M162 220 V340 H282 V220 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* ── půdní teploměr: tyčinka s kulatou hlavou ────────────── */}
    <path d="M219 150 V281 L222 290 L225 281 V150 Z" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="222" cy="132" r="20" fill="#f6f5f2" stroke="#232830" strokeWidth="1.6" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="209" y1="132" x2="212" y2="132" />
      <line x1="222" y1="119" x2="222" y2="122" />
      <line x1="232" y1="132" x2="235" y2="132" />
      <line x1="222" y1="132" x2="229" y2="124" />
    </g>
    <circle cx="222" cy="132" r="2" fill="#232830" />

    {/* ── stupnice teploty půdy 0–30 °C, 8 px na stupeň ───────── */}
    <text className="sv-lbl" x="306" y="80">teplota půdy</text>
    {/* pásmo 15–25 °C */}
    <rect x="306" y="140" width="24" height="80" rx="3" fill="#b76a00" opacity="0.55" />
    <line x1="318" y1="100" x2="318" y2="340" stroke="#232830" strokeWidth="1.6" strokeLinecap="round" />
    <g stroke="#232830" strokeWidth="1.6" strokeLinecap="round">
      <line x1="312" y1="100" x2="324" y2="100" />
      <line x1="312" y1="140" x2="324" y2="140" />
      <line x1="312" y1="220" x2="324" y2="220" />
      {/* ryska 10 °C je práh — delší než ostatní */}
      <line x1="304" y1="260" x2="332" y2="260" />
      <line x1="312" y1="340" x2="324" y2="340" />
    </g>

    <text className="sv-val" x="344" y="105">30</text>

    <text className="sv-val" x="344" y="172">15–25 °C</text>
    <text className="sv-lbl" x="344" y="194">příznivé</text>
    <text className="sv-lbl" x="344" y="215">pro klíčení</text>

    <text className="sv-val" x="344" y="265">10 °C</text>
    <text className="sv-lbl" x="344" y="287">odtud</text>
    <text className="sv-lbl" x="344" y="308">začínáme</text>

    <text className="sv-val" x="344" y="345">0</text>

    {/* ── jak měřit ───────────────────────────────────────────── */}
    <text className="sv-lbl" x="162" y="374">měřit několik dnů</text>
  </svg>
)
