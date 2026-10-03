import { cloneDocument, renumberFigures, setFaq } from './lawn-series-helpers'

const soil = '/magazin/krasny-travnik-zacina-pod-zemi-2'
const calculator = '/magazin/kalkulator-na-planovani-pudniho-profilu'
const preparation = '/magazin/jak-pripravit-a-ulozit-smes'

/** Apply the approved series edit without touching dose tables or ingredient details. */
export function reviseAmendments(input: unknown): any {
  const doc = cloneDocument(input)
  const children = doc.root.children as any[]
  const get = (key: string, value: string) => {
    const matches = children.filter((node) => node.type === 'block' && node.fields?.[key] === value)
    if (matches.length !== 1) throw new Error(`Amendments: expected one ${key}=${value}, got ${matches.length}`)
    return matches[0].fields
  }
  const title = (value: string) => get('title', value)
  const name = (value: string) => get('blockName', value)
  const tablesBefore = JSON.stringify(children.filter((node) => node.fields?.blockType === 'table'))
  const ingredientsBefore = JSON.stringify(children.filter((node) => node.fields?.blockType === 'ingredients'))
  if (children.filter((node) => node.fields?.blockType === 'table').length !== 2) {
    throw new Error('Amendments: both original dose tables are required')
  }

  title('Z čeho půdu skládáme a co která složka umí').body = `V tomto článku si představíme jednotlivé složky, vhodné rozsahy dávek pro tři modelové zahrady a rozmístění příměsí v kořenové vrstvě. Nejdříve potřebujeme vědět, co půdě chybí: [zkouška v dlani pomůže rozpoznat její typ](${soil}#pisek-jil-nebo-hlina-prozradi-to-vase-dlan).

Výpočet pro vlastní plochu najdete v [kalkulátoru půdního profilu](${calculator}); práci s připravenou směsí popisuje návod [Jak připravit a uložit směs](${preparation}).

Představme si dvě sousední zahrady po stejném dešti. Na první se zemina lepí na boty a voda dlouho neodchází. Na druhé se brzy dá pohodlně chodit, jenže po několika suchých dnech už tráva strádá. Stejnou recepturou bychom řešili dva různé problémy.`

  name('A2 – pokračování').body = `Materiály mohou být v obou zahradách stejné: písek, původní zemina, biochar, Actino (dříve Biovin) a zeolit. Mění se jejich úloha i množství. Jílovité půdě potřebujeme otevřít cestu pro vzduch a přebytečnou vodu, chudému písku pomoci uchovat vláhu a živiny.

### Písek a zemina: o výsledku rozhodují i mezery

Písek působí jako nejprostší položka celé objednávky. Žádné složité jméno, žádný příslib biologického zázraku. Jen zrnka. Přesto právě jeho výběr a množství mohou rozhodnout o tom, zda směs získá vlastnosti, které od ní čekáme.

Písek je důležitý pro provzdušnění půdy: ve vhodném množství a zrnitosti pomáhá kyslíku pronikat ke kořenům. Musíme ale dávat pozor, kolik ho přimícháme a do jaké půdy. U písčité půdy by další písek znamenal zbytečné plýtvání penězi. Naopak malé množství písku přidané do jílovité půdy může směs ještě více zahustit, a zdravému růstu trávy tak dokonce uškodit.`

  const biochar = title('Co koupit a jak biochar připravit')
  biochar.body = biochar.body.replace(
    /Přesný postup najdete v navazujícím článku[^\n]+/,
    `Započítání složek směsného výrobku vysvětluje [převod materiálů pro objednávku](${calculator}#od-kubiku-k-tunam-litrum-a-balenim).`,
  )

  title('Proč směs mícháme podle objemu, ne podle tun').body = `**Objemem určujeme poměr složek; hmotností plánujeme objednávku a dopravu.** Objemový recept proto nelze převést na stejné poměry tun. Sypná hustota říká, kolik váží určitý objem volně nasypaného materiálu včetně mezer mezi částicemi.

Rozdíl dobře ukáže písek a biochar. Při modelové hustotě písku **1,5 t/m³** zabere jedna tuna asi **0,67 m³**. Tuna biocharu s hustotou **0,20 t/m³** zabere **5 m³**. Stejná hmotnost tedy přinese velmi rozdílný objem; smíchané tuny jedna ku jedné by daly přibližně 88 % biocharu.

Skutečná hustota závisí na materiálu i vlhkosti dodávky. [Převod kubíků na tuny, litry a balení](${calculator}#od-kubiku-k-tunam-litrum-a-balenim) proto počítá s údaji dodavatele.

Při práci s navážkou nepotřebujeme přesnost na jednotlivé kilogramy. Potřebujeme přibližně dodržet zvolené objemové podíly a rovnoměrně promíchat směs. Zaokrouhlení nesmí z několika procent udělat násobně větší podíl; u osiva a koncentrovaných přípravků dál platí dávka výrobku. Jak odhad množství převést do práce po zahradních úsecích, ukazuje [praktický postup míchání](${preparation}#dodavky-a-michani-prizpusobit-rozsahu-zahrady).`

  // The comparison is now explained in the main chapter; avoid an almost empty continuation.
  doc.root.children = doc.root.children.filter((node: any) => !(
    node.type === 'block' && node.fields?.title === 'Tuna písku není stejný kus prostoru jako tuna hlíny'
  ))

  const profile = title('Třicet centimetrů půdy jako prostor pro život')
  profile.body = `Pro naše příklady zvolíme **30 cm hluboký profil** určený pro nově zakládaný nebo kompletně rekonstruovaný trávník. Profil znamená připravovanou vrstvu půdy od povrchu do této hloubky. Třicet centimetrů je model, nikoli předpis platný pro každou zahradu ani pokyn všude automaticky odvézt třicet centimetrů půdy.

Proč záleží na souvislém prostoru pro kořeny a proč samotná výška navážky nestačí, vysvětluje [kapitola o hloubce kořenové vrstvy](${soil}#tricet-centimetru-svobody-proc-koreny-potrebuji-prostor). Zde podle ní rozmisťujeme jednotlivé složky.`

  title('Horní část pomáhá začátku, hlubší umožní kořenům pokračovat').body = `Nejpestřejší složení má horních deset centimetrů: biochar, zeolit a případně Actino. Zeolit pokračuje také mezi **10 a 15 cm**. Zónu **15–30 cm** tvoří samotný minerální základ, kterým mohou kořeny pokračovat za vodou a vzduchem.

Dražší příměsi soustřeďujeme nahoru, protože u trávníků bývá velká část kořenové aktivity blízko povrchu. Neznamená to, že kořeny v deseti centimetrech končí. Příměsi lze zapracovat i hlouběji, ale při zachování stejného podílu ve větším objemu roste spotřeba i cena a jejich přínos tam bývá menší.

**Zóny na obrázku popisují výsledné rozmístění příměsí, nikoli stavební postup po patrech.** V praxi nejprve promícháme půdu s pískem v celé plánované hloubce a další příměsi zapravujeme postupně mělčeji. Hloubky jsou orientační; cílem je nerozptýlit dražší materiál zbytečně hluboko. Podrobnosti ukazuje [postup od minerálního základu k mělčím příměsím](${preparation}#nejprve-promichat-mineralni-zaklad-potom-primesi-melceji).`

  title('Tři zahrady: jaké poměry pro ně zvolit').body = `Těžké půdě potřebujeme zpřístupnit vodu a vzduch, u hlinité zachovat vyvážený základ a písčité pomoci uchovat vláhu. Následující receptury jsou modely pro založení nebo výraznější obnovu trávníku, nikoli univerzální předpisy.

Vybereme odpovídající příklad, zkontrolujeme jeho podmínky a zvolíme konkrétní podíly v uvedených rozmezích. Teprve potom spočítáme množství. Pokud typ půdy neznáme, začneme [zkouškou vzorku v dlani](${soil}#pisek-jil-nebo-hlina-prozradi-to-vase-dlan); u zamokření ověříme i [vsakování a cestu vody do podloží](${soil}#kam-mizi-voda-proc-i-trava-muze-uschnout-z-premokreni).`

  name('E1b – pokračování').body = `**Recept vybíráme podle problému, který má řešit.** Dobře fungující půdu nemusíme měnit jen proto, že pro ni existuje řádek v tabulce. Při dlouhodobém zamokření a špatném zakořenění na těžké nepropustné půdě naopak může dávat smysl důkladnější úprava.

Ani tehdy nemusíme odvézt veškerou jílovitou zeminu a nahradit ji čistým pískem. Ztratili bychom i její schopnost zadržovat vodu a živiny a museli je častěji doplňovat. Ani golfová hřiště se nezakládají ve všech plochách na čistém písku.

Hlinitý příklad v tabulce se týká **těžší hlinité půdy při rekonstrukci**, u níž přidáváme písek. Biochar a zeolit mají v upravené směsi pomoci uchovat vodu a živiny. Podmínky, za kterých příměsi vynechat nebo naopak doplnit organickou hmotu, najdeme přímo u hlinité varianty.`

  name('E3 – pokračování').body = `Po přidání velkého množství písku už nepracujeme s původním jílem. I nízká dávka zeolitu proto musí odpovídat chování nové směsi, nikoli jen názvu výchozí půdy.

Poměr **65/35 popisuje pouze minerální základ**. Příměsi si z celkového objemu vezmou vlastní podíl, takže přidaný písek netvoří 65 % celé horní směsi. Tento rozdíl ukazuje [výpočet pro 100 m² jílovité zahrady](${calculator}#priklad-kolik-materialu-potrebujete-pro-100-m-jilovite-zahrady).

U těžkého jílu má smysl udělat zkoušku před velkou objednávkou. Několik lopat písku vlastnosti celé vrstvy zpravidla nezmění. Některé odborné podklady ukazují potřebný podíl až **75 % a více**; poměr 65/35 proto bereme jako výchozí návrh.

Pod novou směsí musí zůstat funkční cesta pro vodu. Ani případná mykorhiza nenahradí odstranění utužení a vyřešení odtoku; o jejím použití rozhodneme podle samostatných pravidel na konci kapitoly.`

  title('Střední hlinitá půda: zachovat vyvážený základ').body = `Dobře fungující hlinitá půda mívá nenápadnou výhodu: voda se vsákne, zemina se drobí a za sucha ještě nějakou vláhu uchová. Náš model ovšem řeší **rekonstrukci těžší hlinité půdy se zachovanou a udržovanou ornicí**, kterou chceme udělat lépe zpracovatelnou a propustnější.

Minerální základ tvoří **30 % přidaného písku a 70 % původní hlíny objemově**. Actino vynecháme; biochar i zeolit volíme v rozmezí **3–7 %** v jejich určených zónách.

Písek upravuje minerální základ, zatímco porézní příměsi mají podpořit uchování vody a některých živin. Rozmezí patří k této přestavbě a není důkazem, že každá hlína potřebuje více příměsí než každý jíl.`

  name('E5 – pokračování').body = `**Pokud hlína dobře propouští vodu, drobí se a příliš rychle nevysychá, nového písku, biocharu i zeolitu může být nula.** Urovnání, odstranění kamenů a uvolnění míst utužených technikou mohou být užitečnější než dodávka materiálu. Ve výchozí variantě se zachovanou biologicky aktivní půdou nenakupujeme ani samostatnou mykorhizu.

Jiná situace nastává u dlouhodobě zanedbané hlíny bez doplňování organické hmoty. Pro ni lze připravit variantu s **2,5–5 % Actina v horních 10 cm** na úkor části minerálního základu. Pokud ale pod rýčem najdeme ztvrdlou vrstvu po bagru, nejprve ji rozrušíme. [Prohlídka půdní sondy](${soil}#pohled-do-hlubin-co-ceka-koreny-o-dvacet-centimetru-niz) pomůže tyto dva problémy rozlišit.`

  name('E7 – pokračování').body = `Příměs vždy posuzujeme ve výsledné směsi: u jílu hlídáme vzduch a odtok, u písku dobu, po kterou zůstává voda dostupná kořenům.

### Jak na sebe navazují poměry v jednotlivých hloubkách

Příměsi nahrazují část minerálního základu. **V každé zóně zůstává součet podílů 100 %.** Zvolíme konkrétní podíl každé příměsi a základem doplníme zbytek. Nejnižší podíl základu odpovídá nejvyšším dávkám všech příměsí a naopak; krajní hodnoty nelze libovolně sčítat.

U jílovité varianty se zbylý základ dělí objemově **65/35** mezi písek a zeminu, u hlinité **30/70**. U písčité ho tvoří původní písčitá zemina. Poměr složek základu se s hloubkou nemění, jeho podíl v celé směsi ano. [Kalkulátor počítá objem každé příměsi podle její hloubky](${calculator}#jak-se-pocita-objem-pudy-a-jednotlivych-primesi).`

  title('Kdy dávku upravit a kdy příměs vynechat').body = `Pro první přípravu vybereme podíly z tabulky odpovídající zahrady. Pokud chceme snížit náklady nebo porovnat směsi na malé ploše, můžeme začít u dolní hranice. Horní hranice může mít smysl k ověření například na velmi hrubé, rychle vysychající půdě; není automaticky lepší.

**Při porovnání měníme vždy jednu dávku.** Přidaný či ubraný objem vyrovnáme opačnou změnou minerálního základu; ostatní příměsi ponecháme stejné. Poloviční dávka nemusí znamenat poloviční účinek a více materiálu nezaručuje úměrně větší užitek.

U těžké půdy nejprve odstraníme utužení a překážky odtoku. U lehké při srovnání sledujeme, zda mezi zálivkami vysychá pomaleji. Hodnotíme tak konkrétní vlastnost, kterou jsme chtěli zlepšit, nikoli množství přidaného materiálu.`

  title('Mykorhizní přípravek má vlastní pravidla dávkování').body = `Samostatný mykorhizní přípravek lze zvážit po výrazné rekonstrukci nebo při vytváření převážně nové směsi s malým podílem biologicky aktivní půdy. Sucho samo neprokazuje nedostatek vhodných hub. Nulový nákup přípravku také neznamená, že v půdě žádné mykorhizní houby nejsou.

**Dávku určuje návod konkrétního výrobku a účel použití, nikoli typ půdy.** Rozlišuje-li návod běžné založení a náročnější podmínky, zvolíme odpovídající použití. Písčitá půda sama o sobě dávku nezvyšuje; pro stejný výrobek a stejné použití může zůstat ve všech třech zahradách stejná.

Přípravek musí přijít do kontaktu s mladými kořeny. Kdy a kam ho při zakládání zapravit, ukazuje [praktický návod k umístění mykorhizy](${preparation}#mykorhizu-umistit-tam-kde-se-setka-s-mladymi-koreny).

Složení už známe. [Kalkulátor půdního profilu](${calculator}) je převede na množství pro vlastní zahradu a [návod na přípravu směsi](${preparation}) provede samotnou prací.`

  setFaq(doc, 'Proč se směs míchá podle objemu, a ne podle kilogramů?', `Protože různé materiály při stejné hmotnosti zabírají jiný prostor. Objem určuje poměr složek; [hmotnost pro objednávku spočítáme z hustoty konkrétní dodávky](${calculator}#od-kubiku-k-tunam-litrum-a-balenim).`)
  setFaq(doc, 'Do jaké hloubky patří jednotlivé příměsi?', `V modelovém profilu 30 cm počítáme s biocharem a případným Actinem do 10 cm, se zeolitem do 15 cm. Minerální základ pokračuje celou hloubkou. Jde o výsledné rozmístění: [při práci nejprve promícháme základ, potom příměsi zapravujeme mělčeji](${preparation}#nejprve-promichat-mineralni-zaklad-potom-primesi-melceji). Zóny nebudujeme jako oddělená patra.`)
  setFaq(doc, 'Řídí se dávka mykorhizního přípravku typem půdy?', `Ne. Určuje ji návod konkrétního výrobku a účel použití. Samotná písčitá půda není důvodem k vyšší dávce; [přípravek umístíme k budoucím mladým kořenům](${preparation}#mykorhizu-umistit-tam-kde-se-setka-s-mladymi-koreny).`)

  if (JSON.stringify(doc.root.children.filter((node: any) => node.fields?.blockType === 'table')) !== tablesBefore) {
    throw new Error('Amendments: dose tables changed unexpectedly')
  }
  if (JSON.stringify(doc.root.children.filter((node: any) => node.fields?.blockType === 'ingredients')) !== ingredientsBefore) {
    throw new Error('Amendments: ingredient cards changed unexpectedly')
  }
  renumberFigures(doc)
  return doc
}
