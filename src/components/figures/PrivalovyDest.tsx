import React from 'react'

/**
 * Přívalový déšť (DESIGN.md 9.2) — mírný svah v řezu, nad ním hustý lijavec.
 * Prudká voda stéká po povrchu a bere semena s sebou: nahoře zůstane holé
 * místo s jedním dvěma semeny, pod svahem se osivo nahromadí. Povrch nese
 * tmavší pruh — po vyschnutí z něj bude tvrdá krusta.
 *
 * Jediná pointa: před lijákem nesít. Jediný akcent je voda (#2563eb): kapky
 * deště a šipky odtoku po svahu jsou týž motiv. Krusta je hlubší odstín
 * zeminy, ne nová barva. Popisky stojí v jedné řadě na krému mezi deštěm
 * a svahem a k místům vedou konstrukční linky. Portrétová sazba 520 px,
 * id s prefixem `pd-` (žádná nejsou potřeba). Statická kresba — výsledek
 * (kde semena skončila) je čitelnější než pohyb.
 */
export const PrivalovyDest: React.FC = () => (
  <svg aria-hidden="true" className="block h-auto w-full" viewBox="0 0 520 320">
    {/* Pointa kresby (9.2 p. 3) je jedna. */}
    <text className="sv-val" x="40" y="38" style={{ fontSize: 24 }}>Před lijákem nesít</text>

    {/* ── přívalový déšť: husté šikmé kapky ───────────────────── */}
    <g fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
      <path d="M52 54 l-4 10 M74 54 l-4 10 M96 54 l-4 10 M118 54 l-4 10 M140 54 l-4 10 M162 54 l-4 10 M184 54 l-4 10 M206 54 l-4 10 M228 54 l-4 10 M250 54 l-4 10 M272 54 l-4 10 M294 54 l-4 10 M316 54 l-4 10 M338 54 l-4 10 M360 54 l-4 10 M382 54 l-4 10 M404 54 l-4 10 M426 54 l-4 10 M448 54 l-4 10 M470 54 l-4 10" />
      <path d="M63 68 l-4 10 M85 68 l-4 10 M107 68 l-4 10 M129 68 l-4 10 M151 68 l-4 10 M173 68 l-4 10 M195 68 l-4 10 M217 68 l-4 10 M239 68 l-4 10 M261 68 l-4 10 M283 68 l-4 10 M305 68 l-4 10 M327 68 l-4 10 M349 68 l-4 10 M371 68 l-4 10 M393 68 l-4 10 M415 68 l-4 10 M437 68 l-4 10 M459 68 l-4 10" />
      <path d="M52 82 l-4 10 M74 82 l-4 10 M96 82 l-4 10 M118 82 l-4 10 M140 82 l-4 10 M162 82 l-4 10 M184 82 l-4 10 M206 82 l-4 10 M228 82 l-4 10 M250 82 l-4 10 M272 82 l-4 10 M294 82 l-4 10 M316 82 l-4 10 M338 82 l-4 10 M360 82 l-4 10 M382 82 l-4 10 M404 82 l-4 10 M426 82 l-4 10 M448 82 l-4 10 M470 82 l-4 10" />
    </g>

    {/* ── popisky v jedné řadě na krému, vodicí linky k místům ── */}
    <text className="sv-lbl" x="40" y="120">holé místo</text>
    <text className="sv-lbl" x="188" y="120">po vyschnutí</text>
    <text className="sv-lbl" x="188" y="141">krusta</text>
    <text className="sv-lbl" x="356" y="120">odplavená</text>
    <text className="sv-lbl" x="356" y="141">semena</text>
    <g stroke="#d5d3cc" strokeWidth="1.6" strokeDasharray="3 7" strokeLinecap="round">
      <line x1="96" y1="128" x2="96" y2="155" />
      <line x1="236" y1="149" x2="236" y2="201" />
      <line x1="374.5" y1="149" x2="374.5" y2="218" />
    </g>

    {/* ── svah v řezu: zleva výš, doprava klesá ───────────────── */}
    <path d="M40 160 H104 C 118 160, 124 163, 136 168 L318 236 C 330 241, 338 244, 352 244 H480 V284 H40 Z" fill="#6b5138" opacity="0.9" />
    {/* narušený povrch: po vyschnutí krusta (hlubší odstín zeminy) */}
    <path d="M40 160 H104 C 118 160, 124 163, 136 168 L318 236 C 330 241, 338 244, 352 244 H480 V251 H352 C 338 251, 330 248, 318 243 L136 175 C 124 170, 118 167, 104 167 H40 Z" fill="#54402c" opacity="0.85" />
    <path d="M40 160 H104 C 118 160, 124 163, 136 168 L318 236 C 330 241, 338 244, 352 244 H480 V284 H40 Z" fill="none" stroke="#232830" strokeWidth="1.6" strokeLinejoin="round" />

    {/* odtok po povrchu: táž voda, směr dolů po svahu */}
    <g fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M142 159.5 L186 176 M179.1 177.2 L186 176 L181.5 170.6" />
      <path d="M258 202.9 L302 219.3 M295.1 220.5 L302 219.3 L297.5 213.9" />
    </g>

    {/* ── semena: nahoře zbyla dvě, pod svahem hromádka ───────── */}
    <g fill="#f6f5f2" stroke="#232830" strokeWidth="1.6">
      <ellipse cx="58" cy="155.6" rx="5.5" ry="3.4" transform="rotate(-8 58 155.6)" />
      <ellipse cx="208.5" cy="191.2" rx="5.5" ry="3.4" transform="rotate(20 208.5 191.2)" />

      <ellipse cx="358" cy="239.6" rx="5.5" ry="3.4" transform="rotate(10 358 239.6)" />
      <ellipse cx="369" cy="239.6" rx="5.5" ry="3.4" transform="rotate(-6 369 239.6)" />
      <ellipse cx="380" cy="239.6" rx="5.5" ry="3.4" transform="rotate(4 380 239.6)" />
      <ellipse cx="391" cy="239.6" rx="5.5" ry="3.4" transform="rotate(-10 391 239.6)" />
      <ellipse cx="363.5" cy="233.6" rx="5.5" ry="3.4" transform="rotate(-12 363.5 233.6)" />
      <ellipse cx="374.5" cy="233.6" rx="5.5" ry="3.4" transform="rotate(8 374.5 233.6)" />
      <ellipse cx="385.5" cy="233.6" rx="5.5" ry="3.4" transform="rotate(-4 385.5 233.6)" />
      <ellipse cx="374.5" cy="227.6" rx="5.5" ry="3.4" transform="rotate(-8 374.5 227.6)" />
      <ellipse cx="408" cy="239.6" rx="5.5" ry="3.4" transform="rotate(14 408 239.6)" />
    </g>
  </svg>
)
