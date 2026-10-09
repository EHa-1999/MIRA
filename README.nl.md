# MIRA

**Modular Information & Records Assistant**, de Office Assistent uit XENA Deel II.

[English](README.md) · **Nederlands**

Een interactieve demo van een assistentpaneel in kantoorsoftware dat zorgt voor kwaliteit aan de bron: metadateren, toegankelijkheid, persoonsgegevens, classificeren, waarmerken en workflow, voor tekstdocumenten, rekenbladen, presentaties en e-mail. Hetzelfde paneel werkt in verschillende kantoorpakketten, en geneste onderdelen (een ingesloten tabel, een gekoppeld bereik, een bijlage) houden hun herkomst.

![Het raadsvoorstel met het paneel van de assistent](docs/screenshot-tekst.png)

> **Een demo, geen product.** Alle voorbeeldgegevens zijn verzonnen: personen, dossiers en zaaknummers bestaan niet. Een deel van wat de demo toont is toekomstbeeld; de schakelaar *Tijdvak* laat zien wat vandaag al kan.

De demo hoort bij *XENA Deel II, De Office Assistent*, de architectuurvisie waarop zij is gebaseerd. Zij is de tegenhanger van de demo [Archiefwaardige opslag voor de medewerker](https://github.com/EHa-1999/XENA).

## Uitproberen

Open `index.html` in een browser. Het is één zelfstandig bestand: geen installatie, geen buildstap, geen server.

Staat GitHub Pages aan voor deze repository, dan is de demo ook te openen via `https://<account>.github.io/<repository>/`.

De demo is beschikbaar in het Nederlands, Duits, Engels en Frans. De demo opent in het Nederlands. De taal is rechtsboven te wijzigen, en die keuze wordt onthouden; met `#de`, `#en`, `#fr` of `#nl` achter het adres kies je een taal direct.

## Wat de demo laat zien

| Weergave | Wat je ziet |
|---|---|
| **Tekst** | Een raadsvoorstel in de tekstverwerker, met het paneel van de assistent ernaast. Het meest uitgewerkte stuk; begin hier. |
| **Rekenblad** | De bron van de cijfers. Sla een nieuwe versie op en zie onder *Gebruikt in* welke stukken achterlopen. |
| **Presentatie** | Drie dia's met sprekersnotities. Het paneel volgt de dia die in beeld is. |
| **E-mail** | Een bericht met twee bijlagen. Bij het verzenden stelt de assistent één vraag per bijlage. |
| **Architectuur** | De vier omgevingen, het contract ertussen en per handeling de stappen. |
| **Techniek** | Per functie wat zij vraagt en van wie: de werkomgeving, de leverancier of het platform. |
| **Groeipad** | In vier stappen invoeren, waarvan drie zonder op de markt te wachten. |
| **Help** | De weergaven, een route om te proberen, veelgestelde vragen en begrippen. |

Voor de documentweergaven gelden drie schakelaars: **Tijdvak** (huidige praktijk, vandaag met de assistent, later), **Werkomgeving** (drie kantoorpakketten of mailomgevingen) en **Bekijk als** (opsteller, of een inwoner of ontvanger). De balk onderaan, *Onder de motorkap*, toont bij elke handeling welke aanroep of gebeurtenis erbij hoort.

## Indeling van de repository

| Pad | Inhoud |
|---|---|
| `index.html` | De demo, samengesteld en klaar om te openen. |
| `src/demo.html` | De bron: opmaak, structuur en script in één bestand. Nederlands is de brontaal. |
| `i18n/<taal>.json` | Vertalingen, met de Nederlandse tekst als sleutel. |
| `i18n/bron.json` | Alle Nederlandse teksten uit de demo, automatisch verzameld. |
| `i18n/TERMEN.md` | Termkeuzes per taal, met bronnen. |
| `build.py` | Stelt `index.html` samen uit de bron en de vertalingen. |
| `tools/strings.js` | Verzamelt de teksten en meldt per taal wat ontbreekt. |
| `VERSION`, `CHANGELOG.md` | Het versienummer en de versielijst. |

## Samenstellen en vertalen

```
python3 build.py                 # maakt index.html; de versie komt uit VERSION, de datum is vandaag
npm install playwright           # eenmalig, voor het hulpmiddel hieronder
node tools/strings.js            # verzamelt alle Nederlandse teksten in i18n/bron.json
node tools/strings.js de         # meldt wat in het Duits nog onvertaald is
```

Voor een nieuwe versie: het nummer in `VERSION` ophogen, een regel toevoegen aan `CHANGELOG.md`, `build.py` draaien.

Een taal toevoegen: maak `i18n/<code>.json` met de Nederlandse tekst als sleutel en de vertaling als waarde. In het menu staan de talen waarvoor een bestand bestaat. Getallen in een tekst staan in de sleutel als `{0}`, `{1}` enzovoort.

## Colofon

Gemaakt door Erik Hoekstra, programma-architect en senior consultant, afdeling i-Ontwikkeling, Gemeente Haarlem, met assistentie van Claude (Anthropic).

Contact: ehoekstra@haarlem.nl · erik@erikhoekstra.com

## Licentie

© 2026 Gemeente Haarlem. Vrij te gebruiken, aan te passen en te verspreiden onder de [European Union Public Licence (EUPL) 1.2](https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12). Zie `LICENSE`.
