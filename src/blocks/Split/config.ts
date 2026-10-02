import type { Block } from 'payload'

/**
 * Dvousloupcový blok text + obraz (DESIGN.md 8.2b, vzor z 8.3 ř. 4).
 * Obraz a text, které patří k sobě, drží jeden blok — jinak by se
 * v Lexicalu nedaly postavit vedle sebe.
 */
export const Split: Block = {
  slug: 'split',
  interfaceName: 'SplitBlock',
  labels: { singular: 'Text vedle obrazu', plural: 'Texty vedle obrazu' },
  fields: [
    {
      name: 'side',
      type: 'select',
      defaultValue: 'image-left',
      required: true,
      label: 'Na které straně je obraz',
      admin: { description: 'Sousední bloky se musí střídat, jinak vznikne pruh.' },
      options: [
        { label: 'Obraz vlevo, text vpravo', value: 'image-left' },
        { label: 'Text vlevo, obraz vpravo', value: 'image-right' },
      ],
    },
    {
      name: 'drawing',
      type: 'select',
      label: 'Kresba',
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
        value || siblingData?.photo ? true : 'Vyberte kresbu, nebo nahrajte fotografii.',
      admin: {
        description:
          'Do úzkého sloupce patří jen kresba s portrétovou sazbou — panoramatická by měla popisky pod 5 px.',
      },
      options: [
        { label: 'Kořenová zóna', value: 'korenova-zona' },
        { label: 'Kbelíkový test', value: 'kbelikovy-test' },
        { label: 'Hlava na hlavu', value: 'hlava-na-hlavu' },
        { label: 'Řídicí smyčka', value: 'ridici-smycka' },
        /* Článek „Krásný trávník začíná pod zemí" */
        { label: 'Hmatový test půdy', value: 'hmatovy-test' },
        { label: 'Půdní profil (sonda 30 cm)', value: 'pudni-profil' },
        { label: 'Zkouška vsakování', value: 'zkouska-vsaku' },
        { label: 'Třicet centimetrů (100 l vs. 300 l)', value: 'tricet-centimetru' },
        { label: 'Tři zóny profilu', value: 'tri-zony' },
        { label: 'Sedání půdy', value: 'sedani' },
        /* Článek „Písek, biochar a další příměsi" */
        { label: 'Dvě zahrady, jiný úkol', value: 'dve-zahrady' },
        { label: 'Tuna není kubík', value: 'tuna-neni-kubik' },
        { label: 'Tři zóny profilu (Biovin)', value: 'tri-zony-biovin' },
        { label: 'Tři zahrady, tři dávky', value: 'tri-zahrady' },
        { label: 'Ukládání odspodu', value: 'ukladani-odspodu' },
        { label: 'První kořínek (dosah 3 cm)', value: 'prvni-korinek' },
        { label: 'Nabitý vs. nenabitý biochar', value: 'nabity-biochar' },
        { label: 'Mykorhizní vlákna (dosah)', value: 'mykorhizni-vlakna' },
        { label: 'Minerální základ tří zahrad', value: 'zaklad-tri-zahrad' },
        { label: 'Slehnutí: méně než součet vstupů', value: 'slehnuti-vstupu' },
        { label: 'Praný vs. nepraný písek (mezery)', value: 'prany-pisek' },
        { label: 'Míchání od hloubky k povrchu (základ 30 → zeolit 15 → biochar a Actino 10 cm)', value: 'michani-od-hloubky' },
        { label: 'Kontrola sondou (ve své hloubce / hromádka / až na dno)', value: 'kontrola-sondou' },
        { label: 'Mykorhiza pod osivem (stejná dávka, jiné místo)', value: 'mykorhiza-pod-osivem' },
        { label: 'Podíl z vlastní hloubky (2 % do 15 cm = 300 l)', value: 'podil-z-vlastni-hloubky' },
        { label: 'Odečet příměsí od profilu (30 → 29,25 m³ → 65/35)', value: 'odecet-primesi' },
        { label: 'Písek k dovozu podle předvolby', value: 'pisek-podle-predvolby' },
        { label: 'Rezerva se dělí, nepřičítá (222 l)', value: 'rezerva-deleni' },
        { label: 'Co recept snese: zaokrouhlit ano, zaměnit ne', value: 'co-recept-snese' },
        { label: 'Kořen začíná nahoře, pokračuje dolů', value: 'koren-zacina-nahore' },
        { label: 'Přednosti a slabiny tří půd', value: 'prednosti-a-slabiny' },
        { label: 'Jíl jako vana: nejdřív odtok', value: 'jil-jako-vana' },
        { label: 'Kolik písku do jílu (65 %)', value: 'kolik-pisku-do-jilu' },
        { label: 'Hlína: práce místo materiálu (0 %)', value: 'hlina-prace-misto-materialu' },
        { label: 'Písek: voda a živiny pod kořeny', value: 'pisek-pod-koreny' },
        { label: 'Jedna změna naráz', value: 'jedna-zmena-naraz' },
        { label: 'Mykorhiza podle návodu výrobku', value: 'myko-podle-navodu' },
        /* Článek „Jak zasít trávník" */
        { label: 'Klíčení krok za krokem (nejdřív kořínek)', value: 'kliceni-krok-za-krokem' },
        { label: 'Odnožování (jedna rostlina, víc výhonů)', value: 'odnozovani' },
        { label: 'Hustý výsev (stejné světlo)', value: 'husty-vysev' },
        { label: 'Půdní teploměr (nad 10 °C, 5 cm)', value: 'pudni-teplomer' },
        { label: 'Okno konce léta (6–8 týdnů růstu)', value: 'okno-konce-leta' },
        { label: 'Rychlost vzcházení (po týdnu jen jílek)', value: 'rychlost-vzchazeni' },
        { label: 'Hloubka setí (2–5 mm)', value: 'hloubka-seti' },
        { label: 'Křížový výsev (½ + ½ dávky)', value: 'krizovy-vysev' },
        { label: 'Přívalový déšť (smyv a krusta)', value: 'privalovy-dest' },
        { label: 'Kořeny a vláha (kam sahá voda)', value: 'koreny-a-vlaha' },
        { label: 'První seč (8 cm → 6 cm)', value: 'prvni-sec' },
        { label: 'Mapa chyby (tvar napoví)', value: 'mapa-chyby' },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografie místo kresby',
      admin: {
        description:
          'Nahrajte ořez v poměru rámu (4:5, 1:1, 2:3 nebo 3:2), ne 21:9 master — rám se jinak plní ~3× širším obrazem. Alt se bere z knihovny médií.',
        condition: (_, siblingData) => !siblingData?.drawing,
      },
    },
    {
      name: 'photoRatio',
      type: 'select',
      defaultValue: '4:5',
      label: 'Poměr rámu fotografie',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.photo) },
      options: [
        { label: 'Na výšku 4:5', value: '4:5' },
        { label: 'Čtverec 1:1', value: '1:1' },
        { label: 'Vysoký 2:3 (dlouhý text vedle fotky)', value: '2:3' },
        { label: 'Na šířku 3:2 (krátký text vedle fotky)', value: '3:2' },
      ],
    },
    { name: 'eyebrow', type: 'text', label: 'Nadřádek' },
    {
      name: 'tocGroup',
      type: 'text',
      label: 'Skupina v obsahu článku',
      admin: {
        description:
          'Jen u dlouhého článku: vyplňte u první kapitoly skupiny (např. „Před setím“). Obsah „V článku“ se pak otevře a rozdělí do skupin.',
        condition: (_, siblingData) => siblingData?.titleLevel !== 'h3',
      },
    },
    { name: 'title', type: 'text', label: 'Titulek' },
    {
      name: 'titleLevel',
      type: 'select',
      defaultValue: 'h2',
      label: 'Úroveň titulku',
      admin: { description: 'Kapitola = h2. Podkapitola uvnitř kapitoly = h3 (sazba subtitle).' },
      options: [
        { label: 'Kapitola (h2)', value: 'h2' },
        { label: 'Podkapitola (h3)', value: 'h3' },
      ],
    },
    {
      name: 'continues',
      type: 'checkbox',
      label: 'Pokračuje oddíl nad sebou',
      admin: {
        description:
          'Jen pro blok bez titulku se stejným povrchem jako blok nad ním: místo pásové mezery dostane modulovou, takže se oba čtou jako jeden oddíl.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Text',
      admin: { description: 'Odstavce oddělte prázdným řádkem. **Tučně** takto, *kurzivou* takto; celý odstavec v hvězdičkách je perex (větší písmo). Řádek začínající „### “ je mezititulek (h3), řádek začínající „> “ je tip v modrém rámečku. Pro seznamy a odkazy použijte místo toho formátované tělo níže.' },
    },
    {
      name: 'richBody',
      type: 'richText',
      label: 'Formátované tělo',
      admin: { description: 'Volitelné. Umožňuje v bloku zachovat seznamy, odkazy a původní formátování článku.' },
    },
    { name: 'number', type: 'text', label: 'Číslo obrázku', admin: { placeholder: '01' } },
    { name: 'caption', type: 'text', required: true, label: 'Popisek' },
    {
      name: 'alt',
      type: 'text',
      label: 'Popis kresby pro odečítač',
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
        value || !siblingData?.drawing ? true : 'Kresba potřebuje popis pro odečítač (9.2 p. 8).',
      admin: { condition: (_, siblingData) => Boolean(siblingData?.drawing) },
    },
    {
      name: 'surface',
      type: 'select',
      defaultValue: 'bila',
      label: 'Povrch kapitoly',
      admin: {
        description:
          'Krém nese posun povrchu (8.1 p. 3). Mezi dvěma krémovými pásy má zůstat aspoň jedna bílá sekce.',
      },
      options: [
        { label: 'Bílá (výchozí)', value: 'bila' },
        { label: 'Krémový pás', value: 'krem' },
      ],
    },
  ],
}
