// ==== AP ART HISTORY: THE 250 REQUIRED WORKS ====
// Identifiers follow the College Board AP Art History Course and Exam Description (effective fall 2020), Appendix list of required works.
// One work per line:  number | title | artist | culture | location | date | material
// Leave a field empty if the CED doesn't give it. Extra accepted answers go after "~"
// (e.g. "Doryphoros (Spear Bearer)~Doryphoros~Spear Bearer"). The first value is what's shown.
const WORKS_RAW = String.raw`
1|Apollo 11 stones|||Namibia|c. 25,500–25,300 BCE|Charcoal on stone
2|Great Hall of the Bulls~Lascaux cave paintings||Paleolithic Europe|Lascaux, France|15,000–13,000 BCE|Rock painting
3|Camelid sacrum in the shape of a canine~Camelid sacrum|||Tequixquiac, central Mexico|14,000–7000 BCE|Bone
4|Running horned woman|||Tassili n'Ajjer, Algeria|6000–4000 BCE|Pigment on rock
5|Beaker with ibex motifs|||Susa, Iran|4200–3500 BCE|Painted terra cotta
6|Anthropomorphic stele|||Arabian Peninsula|Fourth millennium BCE|Sandstone
7|Jade cong~Cong|||Liangzhu, China|3300–2200 BCE|Carved jade~Jade
8|Stonehenge||Neolithic Europe|Wiltshire, UK|c. 2500–1600 BCE|Sandstone
9|The Ambum stone~The Ambum Stone~Ambum stone|||Ambum Valley, Enga Province, Papua New Guinea|c. 1500 BCE|Greywacke
10|Tlatilco female figurine|||Central Mexico, site of Tlatilco|1200–900 BCE|Ceramic
11|Terra cotta fragment||Lapita|Reef Islands, Solomon Islands|1000 BCE|Terra cotta (incised)
12|White Temple and its ziggurat~White Temple||Sumerian|Uruk (modern Warka, Iraq)|c. 3500–3000 BCE|Mud brick
13|Palette of King Narmer~Narmer Palette||Predynastic Egypt||c. 3000–2920 BCE|Greywacke
14|Statues of votive figures, from the Square Temple at Eshnunna (modern Tell Asmar, Iraq)~Statues of votive figures, from the Square Temple at Eshnunna~Votive figures~Statues of votive figures~Eshnunna votive figures||Sumerian|Eshnunna (modern Tell Asmar, Iraq)|c. 2700 BCE|Gypsum inlaid with shell and black limestone
15|Seated scribe||Old Kingdom, Fourth Dynasty|Saqqara, Egypt|c. 2620–2500 BCE|Painted limestone
16|Standard of Ur from the Royal Tombs at Ur (modern Tell el-Muqayyar, Iraq)~Standard of Ur from the Royal Tombs at Ur~Standard of Ur||Sumerian|Ur (modern Tell el-Muqayyar, Iraq)|c. 2600–2400 BCE|Wood inlaid with shell, lapis lazuli, and red limestone
17|Great Pyramids (Menkaura, Khafre, Khufu) and Great Sphinx~Great Pyramids~Pyramids of Giza~Great Pyramids and Great Sphinx||Old Kingdom, Fourth Dynasty|Giza, Egypt|c. 2550–2490 BCE|Cut limestone
18|King Menkaura and queen~Menkaura and queen||Old Kingdom, Fourth Dynasty||c. 2490–2472 BCE|Greywacke
19|The Code of Hammurabi~Code of Hammurabi~Stele of Hammurabi||Susian|Babylon (modern Iran)|c. 1792–1750 BCE|Basalt
20|Temple of Amun-Re and Hypostyle Hall~Temple of Amun-Re~Hypostyle Hall~Karnak||New Kingdom, 18th and 19th Dynasties|Karnak, near Luxor, Egypt|Temple: c. 1550 BCE; hall: c. 1250 BCE|Cut sandstone and mud brick
21|Mortuary temple of Hatshepsut~Temple of Hatshepsut||New Kingdom, 18th Dynasty|Near Luxor, Egypt|c. 1473–1458 BCE|Sandstone, partially carved into a rock cliff, and red granite
22|Akhenaten, Nefertiti, and three daughters~Akhenaton, Nefertiti, and three daughters||New Kingdom (Amarna), 18th Dynasty~Amarna||c. 1353–1335 BCE|Limestone
23|Tutankhamun's tomb, innermost coffin~Tutankhamun's coffin~Tutankhamun's innermost coffin~King Tut's coffin||New Kingdom, 18th Dynasty||c. 1323 BCE|Gold with inlay of enamel and semiprecious stones
24|Last judgment of Hunefer, from his tomb (page from the Book of the Dead)~Last judgment of Hunefer~Last judgment of Hu-Nefer~Judgment of Hunefer~Book of the Dead||New Kingdom, 19th Dynasty||c. 1275 BCE|Painted papyrus scroll
25|Lamassu from the citadel of Sargon II, Dur Sharrukin (modern Khorsabad, Iraq)~Lamassu from the citadel of Sargon II~Lamassu||Neo-Assyrian|Dur Sharrukin (modern Khorsabad, Iraq)|c. 720–705 BCE|Alabaster
26|Athenian agora~Agora||Archaic through Hellenistic Greek||600 BCE–150 CE|Plan
27|Anavysos Kouros~Kouros||Archaic Greek||c. 530 BCE|Marble with remnants of paint
28|Peplos Kore from the Acropolis~Peplos Kore||Archaic Greek||c. 530 BCE|Marble, painted details
29|Sarcophagus of the Spouses||Etruscan||c. 520 BCE|Terra cotta
30|Audience Hall (apadana) of Darius and Xerxes~Apadana~Audience Hall of Darius and Xerxes~Apadana of Darius and Xerxes||Persian|Persepolis, Iran|c. 520–465 BCE|Limestone
31|Temple of Minerva (Veii, near Rome, Italy) and sculpture of Apollo~Temple of Minerva and sculpture of Apollo~Temple of Minerva~Apollo of Veii|Vulca (master sculptor)~Vulca||Veii, near Rome, Italy|c. 510–500 BCE|Original temple of wood, mud brick, or tufa (volcanic rock); terra cotta sculpture~Wood, mud brick, or tufa; terra cotta~Terra cotta
32|Tomb of the Triclinium||Etruscan|Tarquinia, Italy|c. 480–470 BCE|Tufa and fresco
33|Niobides Krater~Niobid Krater|Niobid Painter (anonymous vase painter)~Niobid Painter|Classical Greek~Classical Greece||c. 460–450 BCE|Clay, red-figure technique (white highlights)~Red-figure clay
34|Doryphoros (Spear Bearer)~Doryphoros~Spear Bearer|Polykleitos~Polyclitus|||Original 450–440 BCE|Roman copy (marble) of Greek original (bronze)~Marble copy of a bronze original~Marble
35|Acropolis~Athenian Acropolis~Parthenon|Iktinos and Kallikrates~Ictinus and Callicrates||Athens, Greece|c. 447–410 BCE|Marble
36|Grave stele of Hegeso~Stele of Hegeso|Kallimachos (attributed)~Kallimachos~Callimachus|||c. 410 BCE|Marble and paint
37|Winged Victory of Samothrace~Nike of Samothrace||Hellenistic Greek||c. 190 BCE|Marble
38|Great Altar of Zeus and Athena at Pergamon~Pergamon Altar~Altar of Zeus~Great Altar of Zeus||Hellenistic Greek|Pergamon, Asia Minor (present-day Turkey)|c. 175 BCE|Marble (architecture and sculpture)
39|House of the Vettii||Imperial Roman|Pompeii, Italy|c. second century BCE; rebuilt c. 62–79 CE|Cut stone and fresco
40|Alexander Mosaic from the House of Faun, Pompeii~Alexander Mosaic from the House of Faun~Alexander Mosaic||Republican Roman|Pompeii|c. 100 BCE|Mosaic
41|Seated boxer~Boxer at Rest||Hellenistic Greek||c. 100 BCE|Bronze
42|Head of a Roman patrician||Republican Roman||c. 75–50 BCE|Marble
43|Augustus of Prima Porta~Augustus of Primaporta||Imperial Roman||Early first century CE|Marble
44|Colosseum (Flavian Amphitheater)~Colosseum~Flavian Amphitheater||Imperial Roman|Rome, Italy|70–80 CE|Stone and concrete
45|Forum of Trajan|Apollodorus of Damascus~Apollodorus||Rome, Italy|Forum and markets: 106–112 CE; column completed 113 CE|Brick and concrete (architecture); marble (column)
46|Pantheon||Imperial Roman||118–125 CE|Concrete with stone facing
47|Ludovisi Battle Sarcophagus||Late Imperial Roman||c. 250 CE|Marble
48|Catacomb of Priscilla||Late Antique Europe|Rome, Italy|c. 200–400 CE|Excavated tufa and fresco
49|Santa Sabina||Late Antique Europe|Rome, Italy|c. 422–432 CE|Brick and stone, wooden roof
50|Rebecca and Eliezer at the Well and Jacob Wrestling the Angel, from the Vienna Genesis~Vienna Genesis~Rebecca and Eliezer at the Well~Jacob Wrestling the Angel||Early Byzantine Europe||Early sixth century CE|Illuminated manuscript (tempera, gold, and silver on purple vellum)
51|San Vitale||Early Byzantine Europe|Ravenna, Italy|c. 526–547 CE|Brick, marble, and stone veneer; mosaic
52|Hagia Sophia|Anthemius of Tralles and Isidorus of Miletus~Anthemius and Isidorus||Constantinople (Istanbul)|532–537 CE|Brick and ceramic elements with stone and mosaic veneer
53|Merovingian looped fibulae~Looped fibulae||Early medieval Europe||Mid-sixth century CE|Silver gilt worked in filigree, with inlays of garnets and other stones
54|Virgin (Theotokos) and Child between Saints Theodore and George~Theotokos and Child~Virgin and Child between Saints Theodore and George~Theotokos||Early Byzantine Europe||Sixth or early seventh century CE|Encaustic on wood
55|Lindisfarne Gospels: St. Matthew, cross-carpet page; St. Luke portrait page; St. Luke incipit page~Lindisfarne Gospels||Early medieval (Hiberno Saxon) Europe~Hiberno Saxon||c. 700 CE|Illuminated manuscript (ink, pigments, and gold on vellum)
56|Great Mosque~Great Mosque of Córdoba~Mezquita||Umayyad|Córdoba, Spain|c. 785–786 CE|Stone masonry
57|Pyxis of al-Mughira||Umayyad||c. 968 CE|Ivory
58|Church of Sainte-Foy~Sainte-Foy~Reliquary of Saint Foy||Romanesque Europe|Conques, France|Church: c. 1050–1130 CE; Reliquary of Saint Foy: ninth century CE, with later additions|Stone (architecture); stone and paint (tympanum); gold, silver, gemstones, and enamel over wood (reliquary)
59|Bayeux Tapestry||Romanesque Europe (English or Norman)||c. 1066–1080 CE|Embroidery on linen
60|Chartres Cathedral||Gothic Europe|Chartres, France|Original construction c. 1145–1155 CE; reconstructed c. 1194–1220 CE|Limestone, stained glass
61|Dedication Page with Blanche of Castile and King Louis IX of France, Scenes from the Apocalypse from Bibles moralisées~Bibles moralisées~Blanche of Castile and King Louis IX~Dedication Page with Blanche of Castile and King Louis IX of France||Gothic Europe||c. 1225–1245 CE|Illuminated manuscript (ink, tempera, and gold leaf on vellum) (2 images, each from a separate manuscript)~Illuminated manuscript (ink, tempera, and gold leaf on vellum)
62|Röttgen Pietà||Late medieval Europe||c. 1300–1325 CE|Painted wood
63|Arena (Scrovegni) Chapel, including Lamentation~Arena Chapel~Scrovegni Chapel~Lamentation|Giotto di Bondone (artist); unknown architect~Giotto di Bondone~Giotto||Padua, Italy|Chapel: c. 1303 CE; Fresco: c. 1305|Brick (architecture) and fresco
64|Golden Haggadah (The Plagues of Egypt, Scenes of Liberation, and Preparation for Passover)~Golden Haggadah||Late medieval Spain||c. 1320 CE|Illuminated manuscript (pigments and gold leaf on vellum)
65|Alhambra||Nasrid Dynasty|Granada, Spain|1354–1391 CE|Whitewashed adobe stucco, wood, tile, paint, and gilding
66|Annunciation Triptych (Merode Altarpiece)~Merode Altarpiece~Annunciation Triptych|Workshop of Robert Campin~Robert Campin~Campin|||1427–1432 CE|Oil on wood
67|Pazzi Chapel|Filippo Brunelleschi (architect)~Brunelleschi||Basilica di Santa Croce, Florence, Italy|c. 1429–1461 CE|Masonry
68|The Arnolfini Portrait~Arnolfini Portrait|Jan van Eyck~Van Eyck|||c. 1434 CE|Oil on wood
69|David|Donatello|||c. 1440–1460 CE|Bronze
70|Palazzo Rucellai|Leon Battista Alberti (architect)~Alberti||Florence, Italy|c. 1450 CE|Stone, masonry
71|Madonna and Child with Two Angels|Fra Filippo Lippi~Filippo Lippi~Lippi|||c. 1465 CE|Tempera on wood
72|Birth of Venus~The Birth of Venus|Sandro Botticelli~Botticelli|||c. 1484–1486 CE|Tempera on canvas
73|Last Supper~The Last Supper|Leonardo da Vinci~Leonardo~Da Vinci|||c. 1494–1498 CE|Oil and tempera
74|Adam and Eve|Albrecht Dürer~Dürer|||1504 CE|Engraving
75|Sistine Chapel ceiling and altar wall frescoes~Sistine Chapel~Sistine Chapel ceiling~Sistine Chapel frescoes|Michelangelo||Vatican City, Italy|Ceiling frescoes: c. 1508–1512 CE; altar frescoes: c. 1536–1541 CE|Fresco
76|School of Athens~The School of Athens|Raphael|||1509–1511 CE|Fresco
77|Isenheim altarpiece|Matthias Grünewald~Grünewald|||c. 1512–1516 CE|Oil on wood
78|Entombment of Christ|Jacopo da Pontormo~Pontormo|||1525–1528 CE|Oil on wood
79|Allegory of Law and Grace|Lucas Cranach the Elder~Lucas Cranach~Cranach|||c. 1530 CE|Woodcut and letterpress
80|Venus of Urbino|Titian|||c. 1538 CE|Oil on canvas
81|Frontispiece of the Codex Mendoza~Codex Mendoza||Viceroyalty of New Spain~New Spain||c. 1541–1542 CE|Ink and color on paper
82|Il Gesù, including Triumph of the Name of Jesus ceiling fresco~Il Gesù~Triumph of the Name of Jesus|Giacomo da Vignola (plan); Giacomo della Porta (facade); Giovanni Battista Gaulli (ceiling fresco)~Vignola, della Porta, and Gaulli~Gaulli||Rome, Italy|Church: 16th century CE; facade: 1568–1584 CE; fresco and stucco figures: 1676–1679 CE|Brick, marble, fresco, and stucco
83|Hunters in the Snow|Pieter Bruegel the Elder~Bruegel~Brueghel|||1565 CE|Oil on wood
84|Mosque of Selim II~Selimiye Mosque|Sinan (architect)~Sinan||Edirne, Turkey|1568–1575 CE|Brick and stone
85|Calling of Saint Matthew~The Calling of Saint Matthew|Caravaggio|||c. 1597–1601 CE|Oil on canvas
86|Henri IV Receives the Portrait of Marie de' Medici, from the Marie de' Medici Cycle~Henri IV Receives the Portrait of Marie de' Medici~Marie de' Medici Cycle|Peter Paul Rubens~Rubens|||1621–1625 CE|Oil on canvas
87|Self-Portrait with Saskia|Rembrandt van Rijn~Rembrandt|||1636 CE|Etching
88|San Carlo alle Quattro Fontane~San Carlo|Francesco Borromini (architect)~Borromini||Rome, Italy|1638–1646 CE|Stone and stucco
89|Ecstasy of Saint Teresa|Gian Lorenzo Bernini~Bernini||Cornaro Chapel, Church of Santa Maria della Vittoria, Rome, Italy|c. 1647–1652 CE|Marble (sculpture); stucco and gilt bronze (chapel)
90|Angel with Arquebus, Asiel Timor Dei~Angel with Arquebus~Asiel Timor Dei|Master of Calamarca (La Paz School)~Master of Calamarca~La Paz School|||c. 17th century CE|Oil on canvas
91|Las Meninas|Diego Velázquez~Velázquez|||c. 1656 CE|Oil on canvas
92|Woman Holding a Balance|Johannes Vermeer~Vermeer|||c. 1664 CE|Oil on canvas
93|The Palace at Versailles~Versailles~Palace of Versailles|Louis Le Vau and Jules Hardouin-Mansart (architects)~Le Vau and Hardouin-Mansart||Versailles, France|Begun 1669 CE|Masonry, stone, wood, iron, and gold leaf (architecture); marble and bronze (sculpture); gardens
94|Screen with the Siege of Belgrade and hunting scene~Screen with the Siege of Belgrade~Siege of Belgrade screen|Circle of the González Family~González Family|||c. 1697–1701 CE|Tempera and resin on wood, shell inlay
95|The Virgin of Guadalupe (Virgen de Guadalupe)~Virgin of Guadalupe~Virgen de Guadalupe|Miguel González~González||Mexico City (original in the Basilica of Guadalupe)|c. 1698 CE (original: 16th century CE)|Oil on canvas on wood, inlaid with mother-of-pearl
96|Fruit and Insects|Rachel Ruysch~Ruysch|||1711 CE|Oil on wood
97|Spaniard and Indian Produce a Mestizo|Juan Rodríguez Juárez (attributed)~Juan Rodríguez Juárez~Rodríguez Juárez|||c. 1715 CE|Oil on canvas
98|The Tête à Tête, from Marriage à la Mode~The Tête à Tête~Tête à Tête~Marriage à la Mode|William Hogarth~Hogarth|||c. 1743 CE|Oil on canvas
99|Portrait of Sor Juana Inés de la Cruz~Sor Juana Inés de la Cruz|Miguel Cabrera~Cabrera|||c. 1750 CE|Oil on canvas
100|A Philosopher Giving a Lecture on the Orrery~Philosopher Giving a Lecture on the Orrery~The Orrery|Joseph Wright of Derby~Wright of Derby|||c. 1763–1765 CE|Oil on canvas
101|The Swing|Jean-Honoré Fragonard~Fragonard|||1767 CE|Oil on canvas
102|Monticello|Thomas Jefferson (architect)~Jefferson||Virginia, U.S.|1768–1809 CE|Brick, glass, stone, and wood
103|The Oath of the Horatii~Oath of the Horatii|Jacques-Louis David~David|||1784 CE|Oil on canvas
104|George Washington|Jean-Antoine Houdon~Houdon|||1788–1792 CE|Marble
105|Self-Portrait|Elisabeth Louise Vigée Le Brun~Vigée Le Brun~Le Brun|||1790 CE|Oil on canvas
106|Y no hai remedio (And There's Nothing to Be Done), from Los Desastres de la Guerra (The Disasters of War), plate 15~Y no hai remedio~And There's Nothing to Be Done~The Disasters of War~Los Desastres de la Guerra|Francisco de Goya~Goya|||1810–1823 CE (published 1863)|Etching, drypoint, burin, and burnishing
107|La Grande Odalisque~Grande Odalisque|Jean-Auguste-Dominique Ingres~Ingres|||1814 CE|Oil on canvas
108|Liberty Leading the People|Eugène Delacroix~Delacroix|||1830 CE|Oil on canvas
109|The Oxbow (View from Mount Holyoke, Northampton, Massachusetts, after a Thunderstorm)~The Oxbow~Oxbow|Thomas Cole~Cole|||1836 CE|Oil on canvas
110|Still Life in Studio|Louis-Jacques-Mandé Daguerre~Daguerre|||1837 CE|Daguerreotype
111|Slave Ship (Slavers Throwing Overboard the Dead and Dying, Typhoon Coming On)~Slave Ship~The Slave Ship|Joseph Mallord William Turner~J. M. W. Turner~Turner|||1840 CE|Oil on canvas
112|Palace of Westminster (Houses of Parliament)~Palace of Westminster~Houses of Parliament|Charles Barry and Augustus W. N. Pugin (architects)~Barry and Pugin||London, England|1840–1870 CE|Limestone masonry and glass
113|The Stone Breakers~Stone Breakers|Gustave Courbet~Courbet|||1849 CE (destroyed in 1945)|Oil on canvas
114|Nadar Raising Photography to the Height of Art|Honoré Daumier~Daumier|||1862 CE|Lithograph
115|Olympia|Édouard Manet~Manet|||1863 CE|Oil on canvas
116|The Saint-Lazare Station~Saint-Lazare Station~Gare Saint-Lazare|Claude Monet~Monet|||1877 CE|Oil on canvas
117|The Horse in Motion~Horse in Motion|Eadweard Muybridge~Muybridge|||1878 CE|Albumen print
118|The Valley of Mexico from the Hillside of Santa Isabel (El Valle de México desde el Cerro de Santa Isabel)~The Valley of Mexico from the Hillside of Santa Isabel~The Valley of Mexico~Valley of Mexico|José María Velasco~Velasco|||1882 CE|Oil on canvas
119|The Burghers of Calais~Burghers of Calais|Auguste Rodin~Rodin|||1884–1895 CE|Bronze
120|The Starry Night~Starry Night|Vincent van Gogh~Van Gogh|||1889 CE|Oil on canvas
121|The Coiffure|Mary Cassatt~Cassatt|||1890–1891 CE|Drypoint and aquatint
122|The Scream|Edvard Munch~Munch|||1893 CE|Tempera and pastels on cardboard
123|Where Do We Come From? What Are We? Where Are We Going?|Paul Gauguin~Gauguin|||1897–1898 CE|Oil on canvas
124|Carson, Pirie, Scott and Company Building~Carson Pirie Scott Building|Louis Sullivan (architect)~Sullivan||Chicago, Illinois, U.S.|1899–1903 CE|Iron, steel, glass, and terra cotta
125|Mont Sainte-Victoire|Paul Cézanne~Cézanne|||1902–1904 CE|Oil on canvas
126|Les Demoiselles d'Avignon|Pablo Picasso~Picasso|||1907 CE|Oil on canvas
127|The Steerage~Steerage|Alfred Stieglitz~Stieglitz|||1907 CE|Photogravure
128|The Kiss|Gustav Klimt~Klimt|||1907–1908 CE|Oil and gold leaf on canvas
129|The Kiss|Constantin Brancusi~Brancusi|||Original 1907–1908 CE|Stone~Limestone
130|The Portuguese|Georges Braque~Braque|||1911 CE|Oil on canvas
131|Goldfish|Henri Matisse~Matisse|||1912 CE|Oil on canvas
132|Improvisation 28 (second version)~Improvisation 28|Vassily Kandinsky~Wassily Kandinsky~Kandinsky|||1912 CE|Oil on canvas
133|Self-Portrait as a Soldier|Ernst Ludwig Kirchner~Kirchner|||1915 CE|Oil on canvas
134|Memorial Sheet for Karl Liebknecht|Käthe Kollwitz~Kollwitz|||1919–1920 CE|Woodcut
135|Villa Savoye|Le Corbusier (architect)~Le Corbusier~Corbusier||Poissy-sur-Seine, France|1929 CE|Steel and reinforced concrete
136|Composition with Red, Blue and Yellow|Piet Mondrian~Mondrian|||1930 CE|Oil on canvas
137|Illustration from The Results of the First Five-Year Plan~The Results of the First Five-Year Plan~Results of the First Five-Year Plan|Varvara Stepanova~Stepanova|||1932 CE|Photomontage
138|Object (Le Déjeuner en fourrure)~Object~Le Déjeuner en fourrure~Fur-covered teacup|Meret Oppenheim~Oppenheim|||1936 CE|Fur-covered cup, saucer, and spoon
139|Fallingwater|Frank Lloyd Wright (architect)~Frank Lloyd Wright||Pennsylvania, U.S.|1936–1939 CE|Reinforced concrete, sandstone, steel, and glass
140|The Two Fridas~Two Fridas|Frida Kahlo~Kahlo|||1939 CE|Oil on canvas
141|The Migration Series, Panel 49~The Migration Series~Migration Series~The Migration of the Negro, Panel no. 49~The Migration of the Negro|Jacob Lawrence~Lawrence|||1940–1941 CE|Casein tempera on hardboard
142|The Jungle|Wifredo Lam~Lam|||1943 CE|Gouache on paper mounted on canvas
143|Dream of a Sunday Afternoon in the Alameda Park|Diego Rivera~Rivera|||1947–1948 CE|Fresco
144|Fountain (second version)~Fountain|Marcel Duchamp~Duchamp|||1950 CE (original 1917)|Readymade glazed sanitary china with black paint~Readymade porcelain urinal~Readymade
145|Woman, I~Woman I~Woman 1|Willem de Kooning~De Kooning|||1950–1952 CE|Oil on canvas
146|Seagram Building|Ludwig Mies van der Rohe and Philip Johnson (architects)~Mies van der Rohe and Philip Johnson~Mies van der Rohe||New York City, U.S.|1954–1958 CE|Steel frame with glass curtain wall and bronze
147|Marilyn Diptych|Andy Warhol~Warhol|||1962 CE|Oil, acrylic, and silkscreen enamel on canvas
148|Narcissus Garden|Yayoi Kusama~Kusama|||Original installation and performance 1966|Mirror balls
149|The Bay|Helen Frankenthaler~Frankenthaler|||1963 CE|Acrylic on canvas
150|Lipstick (Ascending) on Caterpillar Tracks~Lipstick Ascending on Caterpillar Tracks|Claes Oldenburg~Oldenburg|||1969–1974 CE|Cor-Ten steel, steel, aluminum, and cast resin; painted with polyurethane enamel
151|Spiral Jetty|Robert Smithson~Smithson||Great Salt Lake, Utah, U.S.|1970 CE|Earthwork: mud, precipitated salt crystals, rocks, and water coil~Earthwork
152|House in New Castle County|Robert Venturi, John Rauch, and Denise Scott Brown (architects)~Venturi, Rauch, and Scott Brown~Venturi||Delaware, U.S.|1978–1983 CE|Wood frame and stucco
153|Chavín de Huántar||Chavín|Northern highlands, Peru|900–200 BCE|Stone (architectural complex); granite (Lanzón and sculpture); hammered gold alloy (jewelry)
154|Mesa Verde cliff dwellings~Mesa Verde||Ancestral Puebloan (Anasazi)~Ancestral Puebloan~Anasazi|Montezuma County, Colorado|450–1300 CE|Sandstone
155|Yaxchilán||Maya|Chiapas, Mexico|725 CE|Limestone (architectural complex)
156|Great Serpent Mound~Serpent Mound||Mississippian (Eastern Woodlands)~Mississippian|Adams County, southern Ohio|c. 1070 CE|Earthwork/effigy mound
157|Templo Mayor (Main Temple)~Templo Mayor~Main Temple||Mexica (Aztec)~Aztec~Mexica|Tenochtitlan (modern Mexico City, Mexico)|1375–1520 CE|Stone (temple); volcanic stone (The Coyolxauhqui Stone); jadeite (Olmec-style mask); basalt (Calendar Stone)
158|Ruler's feather headdress (probably of Motecuhzoma II)~Ruler's feather headdress~Feather headdress~Headdress of Motecuhzoma II~Headdress of Moctezuma||Mexica (Aztec)~Aztec~Mexica||1428–1520 CE|Feathers (quetzal and cotinga) and gold
159|City of Cusco, including Qorikancha (Inka main temple), Santo Domingo (Spanish colonial convent), and Walls at Saqsa Waman (Sacsayhuaman)~City of Cusco~Cusco~Qorikancha~Sacsayhuaman||Inka~Inca|Central highlands, Peru|c. 1440 CE; convent added 1550–1650 CE|Andesite
160|Maize cobs||Inka~Inca||c. 1440–1533 CE|Sheet metal/repoussé, metal alloys
161|City of Machu Picchu~Machu Picchu||Inka~Inca|Central highlands, Peru|c. 1450–1540 CE|Granite (architectural complex)
162|All-T'oqapu tunic~All-Toqapu tunic~Toqapu tunic||Inka~Inca||1450–1540 CE|Camelid fiber and cotton
163|Bandolier bag||Lenape (Delaware tribe, Eastern Woodlands)~Lenape~Delaware||c. 1850 CE|Beadwork on leather
164|Transformation mask||Kwakwaka'wakw|Northwest coast of Canada|Late 19th century CE|Wood, paint, and string
165|Painted elk hide|Cotsiogo (Cadzi Cody) (attributed)~Cotsiogo~Cadzi Cody|Eastern Shoshone|Wind River Reservation, Wyoming|c. 1890–1900 CE|Painted elk hide
166|Black-on-black ceramic vessel~Black-on-black vessel~Blackware vessel|Maria Martínez and Julian Martínez~Maria Martínez~Martínez|Tewa, Puebloan~Puebloan~Tewa|San Ildefonso Pueblo, New Mexico|c. mid-20th century CE|Blackware ceramic
167|Conical tower and circular wall of Great Zimbabwe~Great Zimbabwe||Shona peoples|Southeastern Zimbabwe|c. 1000–1400 CE|Coursed granite blocks
168|Great Mosque of Djenné~Djenné~Great Mosque of Djenne|||Mali|Founded c. 1200 CE; rebuilt 1906–1907|Adobe
169|Wall plaque, from Oba's palace~Wall plaque~Benin plaque~Benin bronze||Edo peoples|Kingdom of Benin (Nigeria)~Benin (Nigeria)|16th century CE|Cast brass
170|Sika dwa kofi (Golden Stool)~Golden Stool~Sika dwa kofi||Ashanti peoples~Asante|South central Ghana|c. 1700 CE|Gold over wood and cast-gold attachments
171|Ndop (portrait figure) of King Mishe miShyaang maMbul~Ndop~Ndop of King Mishe miShyaang maMbul||Kuba peoples|Democratic Republic of the Congo~Congo~DRC|c. 1760–1780 CE|Wood
172|Power figure (Nkisi n'kondi)~Nkisi n'kondi~Power figure||Kongo peoples|Democratic Republic of the Congo~Congo~DRC|c. late 19th century CE|Wood and metal
173|Female (Pwo) mask~Pwo mask~Female mask||Chokwe peoples|Democratic Republic of the Congo~Congo~DRC|Late 19th to early 20th century CE|Wood, fiber, pigment, and metal
174|Portrait mask (Mblo)~Mblo~Portrait mask||Baule peoples|Côte d'Ivoire|Early 20th century CE|Wood and pigment
175|Sande Sowei mask~Sowei mask~Bundu mask||Sande Society, Mende peoples~Mende~Sande Society|West African forests of Sierra Leone and Liberia|19th to 20th century CE|Wood, cloth, and fiber
176|Ikenga (shrine figure)~Ikenga||Igbo peoples|Nigeria|c. 19th to 20th century CE|Wood
177|Lukasa (memory board)~Lukasa~Memory board||Mbudye Society, Luba peoples~Luba peoples~Luba|Democratic Republic of the Congo~Congo~DRC|c. 19th to 20th century CE|Wood, beads, and metal
178|Aka elephant mask~Elephant mask||Bamileke|Cameroon, western grassfields region|c. 19th to 20th century CE|Wood, woven raffia, cloth, and beads
179|Reliquary figure (byeri)~Byeri~Reliquary figure||Fang peoples|Southern Cameroon|c. 19th to 20th century CE|Wood
180|Veranda post of enthroned king and senior wife (Opo Ogoga)~Veranda post~Opo Ogoga|Olowe of Ise~Olowe|Yoruba peoples||c. 1910–1914 CE|Wood and pigment
181|Petra, Jordan: Treasury and Great Temple~Petra~Treasury and Great Temple~Treasury at Petra||Nabataean Ptolemaic and Roman~Nabataean|Petra, Jordan|c. 400 BCE–100 CE|Cut rock
182|Buddha~Bamiyan Buddha~Buddhas of Bamiyan||Gandharan|Bamiyan, Afghanistan|c. 400–800 CE (destroyed in 2001)|Cut rock with plaster and polychrome paint
183|The Kaaba~Kaaba~Ka'ba||Islamic|Mecca, Saudi Arabia|Pre-Islamic monument; rededicated by Muhammad in 631–632 CE; multiple renovations|Granite masonry, covered with silk curtain and calligraphy in gold and silver-wrapped thread
184|Jowo Rinpoche, enshrined in the Jokhang Temple~Jowo Rinpoche||Yarlung Dynasty|Jokhang Temple, Lhasa, Tibet|Believed to have been brought to Tibet in 641 CE|Gilt metals with semiprecious stones, pearls, and paint; various offerings
185|Dome of the Rock||Islamic, Umayyad~Umayyad|Jerusalem|691–692 CE, with multiple renovations|Stone masonry and wooden roof decorated with glazed ceramic tile, mosaics, and gilt aluminum and bronze dome
186|Great Mosque (Masjid-e Jameh)~Masjid-e Jameh~Great Mosque of Isfahan~Great Mosque||Islamic, Persian: Seljuk, Il-Khanid, Timurid and Safavid Dynasties~Persian~Seljuk|Isfahan, Iran|c. 700 CE; additions and restorations in the 14th, 18th, and 20th centuries CE|Stone, brick, wood, plaster, and glazed ceramic tile
187|Folio from a Qur'an~Qur'an folio||Abbasid|Arab, North Africa, or Near East|c. eighth to ninth century CE|Ink, color, and gold on parchment
188|Basin (Baptistère de St. Louis)~Baptistère de St. Louis~Baptistère de Saint Louis|Muhammad ibn al-Zain~ibn al-Zain|||c. 1320–1340 CE|Brass inlaid with gold and silver
189|Bahram Gur Fights the Karg, folio from the Great Il-Khanid Shahnama~Bahram Gur Fights the Karg||Islamic; Persian, Il-Khanid~Il-Khanid~Persian||c. 1330–1340 CE|Ink and opaque watercolor, gold, and silver on paper
190|The Court of Gayumars, folio from Shah Tahmasp's Shahnama~The Court of Gayumars~Court of Gayumars|Sultan Muhammad|||c. 1522–1525 CE|Ink, opaque watercolor, and gold on paper
191|The Ardabil Carpet~Ardabil Carpet|Maqsud of Kashan~Maqsud|||1539–1540 CE|Silk and wool
192|Great Stupa at Sanchi~Great Stupa~Sanchi Stupa||Buddhist; Maurya, late Sunga Dynasty~Maurya~Buddhist~Sunga|Madhya Pradesh, India|c. 300 BCE–100 CE|Stone masonry, sandstone on dome
193|Terra cotta warriors from mausoleum of the first Qin emperor of China~Terra cotta warriors~Terracotta Army||Qin Dynasty||c. 221–209 BCE|Painted terra cotta
194|Funeral banner of Lady Dai (Xin Zhui)~Funeral banner of Lady Dai~Lady Dai banner||Han Dynasty|China|c. 180 BCE|Painted silk
195|Longmen caves~Longmen Grottoes||Tang Dynasty|Luoyang, China|493–1127 CE|Limestone
196|Gold and jade crown~Silla crown||Three Kingdoms period, Silla Kingdom~Silla Kingdom~Silla|Korea|Fifth to sixth century CE|Metalwork
197|Todai-ji|Unkei, Keikei, and the Kei School (sculptors)~Unkei and Keikei~Kei School||Nara, Japan|743 CE; rebuilt c. 1700|Bronze and wood (sculpture); wood with ceramic-tile roofing (architecture)
198|Borobudur Temple~Borobudur||Sailendra Dynasty|Central Java, Indonesia|c. 750–842 CE|Volcanic-stone masonry
199|Angkor, the temple of Angkor Wat, and the city of Angkor Thom~Angkor Wat~Angkor~Angkor Thom||Hindu, Angkor Dynasty~Angkor Dynasty~Khmer|Cambodia|c. 800–1400 CE|Stone masonry, sandstone
200|Lakshmana Temple||Hindu, Chandella Dynasty~Chandella Dynasty|Khajuraho, India|c. 930–950 CE|Sandstone
201|Travelers among Mountains and Streams|Fan Kuan|||c. 1000 CE|Ink and colors on silk
202|Shiva as Lord of Dance (Nataraja)~Shiva as Lord of Dance~Shiva Nataraja~Nataraja||Hindu; Chola Dynasty~Chola Dynasty~Chola|India (Tamil Nadu)|c. 11th century CE|Cast bronze
203|Night Attack on the Sanjô Palace~Night Attack on the Sanjo Palace||Kamakura period|Japan|c. 1250–1300 CE|Handscroll (ink and color on paper)
204|The David Vases~David Vases||Yuan Dynasty|China|1351 CE|White porcelain with cobalt-blue underglaze
205|Portrait of Sin Sukju (1417–1475)~Portrait of Sin Sukju~Sin Sukju|Imperial Bureau of Painting|||c. 15th century CE|Hanging scroll (ink and color on silk)
206|Forbidden City||Ming Dynasty|Beijing, China|15th century CE and later|Stone masonry, marble, brick, wood, and ceramic tile
207|Ryoan-ji||Muromachi period|Kyoto, Japan|c. 1480 CE; current design most likely dates to the 18th century CE|Rock garden
208|Jahangir Preferring a Sufi Shaikh to Kings|Bichitr|||c. 1620 CE|Watercolor, gold, and ink on paper
209|Taj Mahal|Ustad Ahmad Lahori (supervising architect)~Ahmad Lahori~Lahori||Agra, Uttar Pradesh, India|1632–1653 CE|Stone masonry and marble with inlay of precious and semiprecious stones; gardens
210|White and Red Plum Blossoms~Red and White Plum Blossoms|Ogata Korin~Korin|||c. 1710–1716 CE|Ink, watercolor, and gold leaf on paper
211|Under the Wave off Kanagawa (Kanagawa oki nami ura), also known as the Great Wave, from the series Thirty-six Views of Mount Fuji~Under the Wave off Kanagawa~The Great Wave~Great Wave off Kanagawa~Great Wave|Katsushika Hokusai~Hokusai|||1830–1833 CE|Polychrome woodblock print; ink and color on paper~Woodblock print
212|Chairman Mao en Route to Anyuan|Artist unknown; based on an oil painting by Liu Chunhua~Liu Chunhua|||c. 1969 CE|Color lithograph
213|Nan Madol||Saudeleur Dynasty|Pohnpei, Micronesia|c. 700–1600 CE|Basalt boulders and prismatic columns
214|Moai on platform (ahu)~Moai~Moai on platform~Moai on ahu|||Rapa Nui (Easter Island)|c. 1100–1600 CE|Volcanic tuff figures on basalt base
215|'Ahu 'ula (feather cape)~'Ahu 'ula~Feather cape||Hawaiian||Late 18th century CE|Feathers and fiber
216|Staff god|||Rarotonga, Cook Islands, central Polynesia|Late 18th to early 19th century CE|Wood, tapa, fiber, and feathers
217|Female deity|||Nukuoro, Micronesia|c. 18th to 19th century CE|Wood
218|Buk (mask)~Buk~Buk mask|||Torres Strait|Mid- to late 19th century CE|Turtle shell, wood, fiber, feathers, and shell
219|Hiapo (tapa)~Hiapo|||Niue|c. 1850–1900 CE|Tapa or bark cloth, freehand painting
220|Tamati Waka Nene|Gottfried Lindauer~Lindauer|||1890 CE|Oil on canvas
221|Navigation chart~Stick chart~Marshall Islands stick chart|||Marshall Islands, Micronesia|19th to early 20th century CE|Wood and fiber
222|Malagan display and mask~Malagan mask~Malagan|||New Ireland Province, Papua New Guinea|c. 20th century CE|Wood, pigment, fiber, and shell
223|Presentation of Fijian mats and tapa cloths to Queen Elizabeth II~Presentation of Fijian mats and tapa cloths|||Fiji, Polynesia|1953 CE|Multimedia performance (costume; cosmetics, including scent; chant; movement; and pandanus fiber/hibiscus fiber mats), photographic documentation~Multimedia performance
224|The Gates|Christo and Jeanne-Claude~Christo||New York City, U.S.|1979–2005 CE|Mixed-media installation
225|Vietnam Veterans Memorial|Maya Lin||Washington, D.C., U.S.|1982 CE|Granite
226|Horn Players|Jean-Michel Basquiat~Basquiat|||1983 CE|Acrylic and oil paintstick on three canvas panels
227|Summer Trees|Song Su-nam|||1979 CE|Ink on paper
228|Androgyne III~Androgyn III|Magdalena Abakanowicz~Abakanowicz|||1985 CE|Burlap, resin, wood, nails, string
229|A Book from the Sky~Book from the Sky|Xu Bing|||1987–1991 CE|Mixed-media installation
230|Pink Panther|Jeff Koons~Koons|||1988 CE|Glazed porcelain
231|Untitled #228, from the History Portraits series~Untitled #228~Untitled (#228)~Untitled 228~History Portraits|Cindy Sherman~Sherman|||1990 CE|Photograph
232|Dancing at the Louvre, from the series The French Collection, Part I; #1~Dancing at the Louvre|Faith Ringgold~Ringgold|||1991 CE|Acrylic on canvas, tie-dyed, pieced fabric border
233|Trade (Gifts for Trading Land with White People)~Trade|Jaune Quick-to-See Smith~Quick-to-See Smith|||1992 CE|Oil and mixed media on canvas
234|Earth's Creation|Emily Kame Kngwarreye~Kngwarreye|||1994 CE|Synthetic polymer paint on canvas
235|Rebellious Silence, from the Women of Allah series~Rebellious Silence~Women of Allah|Shirin Neshat (artist); photo by Cynthia Preston~Shirin Neshat~Neshat|||1994 CE|Ink on photograph
236|En la Barberia no se Llora (No Crying Allowed in the Barbershop)~No Crying Allowed in the Barbershop~En la Barberia no se Llora|Pepon Osorio~Osorio|||1994 CE|Mixed-media installation
237|Pisupo Lua Afe (Corned Beef 2000)~Pisupo Lua Afe~Corned Beef 2000|Michel Tuffery~Tuffery|||1994 CE|Mixed media
238|Electronic Superhighway|Nam June Paik~Paik|||1995 CE|Mixed-media installation (49-channel closed-circuit video installation, neon, steel, and electronic components)
239|The Crossing|Bill Viola~Viola|||1996 CE|Video/sound installation
240|Guggenheim Museum Bilbao~Guggenheim Bilbao|Frank Gehry (architect)~Gehry||Bilbao, Spain|1997 CE|Titanium, glass, and limestone
241|Pure Land|Mariko Mori~Mori|||1998 CE|Color photograph on glass
242|Lying with the Wolf|Kiki Smith|||2001 CE|Ink and pencil on paper
243|Darkytown Rebellion|Kara Walker~Walker|||2001 CE|Cut paper and projection on wall
244|The Swing (after Fragonard)|Yinka Shonibare~Shonibare|||2001 CE|Mixed-media installation
245|Old Man's Cloth|El Anatsui~Anatsui|||2003 CE|Aluminum and copper wire
246|Stadia II|Julie Mehretu~Mehretu|||2004 CE|Ink and acrylic on canvas
247|Preying Mantra|Wangechi Mutu~Mutu|||2006 CE|Mixed media on Mylar
248|Shibboleth|Doris Salcedo~Salcedo|||2007–2008 CE|Installation
249|MAXXI National Museum of XXI Century Arts~MAXXI|Zaha Hadid (architect)~Hadid||Rome, Italy|2009 CE|Glass, steel, and cement
250|Kui Hua Zi (Sunflower Seeds)~Sunflower Seeds~Kui Hua Zi|Ai Weiwei|||2010–2011 CE|Sculpted and painted porcelain
`;

// Image file names from the Knowt set (ap art history 250, identifiers only), in work order 1–250.
// Empty string = no image in the set (that work is always shown by title).
const IMAGE_BASE = "https://knowt-user-attachments.s3.amazonaws.com/";
const IMAGES_RAW = `
8e44698d6e474299bea4ab47432976d8.jpg 12a6910ef8ed424faa9bcbc0c14a82e1.jpg 7452695f2bde4bbc8bd3aa449103e263.jpg 292256bf5df54cdd9e5ae8770793a53b.png 3f3c529dfb5040d694110472ea456ce6.png
3a408fd23745463bb8f5e0495ea534f4.jpg 1710120727f9490bbef8fd7f9c2f8662.jpg 5aeab0da432c4ac9b9c70f225e6f0242.jpg 32c97572b9c3423aaa77acf43d8a213c.jpg 728c333b20774a0aaebaa1dbf3221360.jpg
60e3e50459d84bd0904c4446bffdd7dc.jpg 1b5db67538424824a8317b9929bb84d9.png 8927c2dbb72441c4ade7810447451d72.jpg 9941b8f1641540f5843bb4bf1514937d.jpg 0358190a73a340f0be25eab9c3cbb29b.jpg
33f3f8ad84af4b079ceaba6796c21296.jpg 92a95df93af145d4b6e39025ff1918df.jpg 0ac29846ebba44da8e7c7179e4cbba04.jpg d10270f49eea4bf58456f38e3e4104a6.jpg 9d920f95860d4bc6b76535a6257cbf85.jpg
8355a37c0189418289d8c44544e64552.jpg c3dea3b02a4d4c33a1d8fd9ca4eb9583.jpg 80e5c60112524aa2ad41873cc94ffcc1.jpg 02427bc19f524b719fc399742839ce17.jpg 43ae105c630d4ab48ad346dff2738ee2.png
53915cb4c4bb4fc8abb7959ccab4afe0.jpg 8a7d622ae66f41498836f0c9c203219d.jpg f10f015a63ec41dfaa0c22c0e63c7378.jpg 2be427084139432eb2d570e069f2f73b.jpg 3dc496b3c0b64a00bced0e5f1f22beca.jpg
d2d0cda2403a494a81b226e1d8001ee7.png 0a513d68d1c945eaa45443c8c4f4e996.png c2932827576f4011a2c0fffb86b2963a.png 44154354e56547ef996de5a9b5c7c63d.jpg d8eaa543fb884c86a547e85cc16a1558.jpg
9bcf330f16c047cf98d278b144db4510.jpg 2b42ab90284042178d43296fc03d26ab.jpg 971c7b033f324f22a243351b068051bf.jpg a8f1d05586be497697d22b25f6a872a5.jpg 74ceef9f2788492184b830f21ea5ada1.jpg
3f04015394d544fa9f649785ed471ba5.jpg fb1e8f893ab845a5a2a0dedb964bc7cf.jpg e4dc4a90d3c34d73a5b9279c740b711a.jpg efd32d024c6a402fa93f50023eea1eb5.jpg e8304258b16e4d2d877d55ae43179048.jpg
e68804eff6f747bcb500af6d0ac22bec.jpg 2eb98b5810da4b439ffa5bc216b44832.jpg 335d5cc8ba6246bcbf97b10dd31d10f7.jpg fcdc35ae711147249ff10c36c9e8dda1.jpg 97e1cdce57bd463ba5ed4a40fbd14bd6.jpg
6703bb10d5ce40dfb3bd292ca99657d2.jpg dcdcde113d614dc99aba9ff05b0bffbb.jpg 362cdb45b0a4449f81e748205cecbbe2.jpg 06a3c4d2110d4f57b887dad232e4eb2c.jpg 7d11a3c45a1d49669059430939c6d692.png
3094ff6550d0489ba4b067a73bcb5e6f.png c05edd1c81b9460f9aedc07d97d4aad7.jpg f48843fdad8844ad82db7d3c793d0250.jpg ff2ca89ee7ee4a85bf4915b245e0b41d.jpg ef3a2a64aa37405db25dd32b240ff78f.jpg
0a2abc54ee50440589ee7d32c02fb679.png c0c6c8c7e4c94b1f93f31b637e318b0f.jpg e659b9efb5e94bbe8e387cee7656cd65.jpg 4827e15dde684cf9aaaaaa7e1b1f8567.jpg 31c7b4833b3f45e9a377ba9df5a6ccc6.jpg
77dc88ae006d487481490c9837402f12.jpg f47e7cfe967448c9a4907feb206a33bb.jpg 98aa1a60e41f4cb68ca69715ad364b77.jpg 0407f8e49498476cb6a837b8be1dd52c.jpg 936860faff844575943b2f88ef2cc29d.jpg
5b8e97d7aed34184be72a2c3a71c99f7.jpg f95be429f88f49c7bb5a933254db430d.jpg ec4a79d8d830424388344080e94d566f.jpg 0b25127d1e0c4a468f0a2ff43df56138.jpg 266d36c6c02f44e1bba3148ed1b860d2.png
082f96c0a1744df78130d18551c21d6d.jpg 1168b8f4da764226a26d6e6b7e47b647.jpg 15cd467eabbf417a8bbf68e0e9eda153.jpg 1ac4dbb1a9e24b7ca0a37d3016ca6ac9.jpg 16717b8112b94c14b20d062fef732ee5.jpg
614df12c7be24a7a98099dd71c1e34d0.png f369ad057ea846b4be71f02eaf3fba51.png dc24614f36264eeba12e4ebc93935508.jpg 439e2a8bfe7e415fb9ec6245c3ca8c45.jpg 99fc567107714ae5acc80da810a968e8.jpg
8a8b807443174c9282d60aa54e62e8e3.jpg 8218d0a17ff241df8ef2e25beced4a40.jpg 04b7cfab63f04f4ca20a49eb21906906.jpg 17f070c2f3234f909e0d33375fb8742c.jpg d93f534480b94501a12861180f3e96a6.jpg
788861f9eb3f49f3b68cfb3d1385dc33.jpg ad0d460361054f6bab7b6840855a52d1.jpg 111c5e2b6913442db9d2c63f809ae279.jpg 50098e952a8c4f9085f392d8a360fbb6.jpg ebabd9bcd138443aa11d18715a6cb347.jpg
8068b78b1ac648ed8ff6643d268138a2.png da2490c22564493dae701eef854bcb38.png 922d34a39564421099c3cd9e5de27f10.jpg 2ea10a88c4344df6be9a899b39c179dd.png ca29f42c5e0548c79340e969eaa448db.jpg
a8bde267ecfa4b7bb0a768cba9e9a4d2.jpg 48e80559b4c34c13a9f22beb61a70a77.jpg 20b8dac7fc2947faa555b1a6e659894d.jpg 73d01cc04d5c4095acc8a4628ceee6d9.jpg 1c3af84ccd33455f87505058026cde03.png
36e4220ce8b841f697e961cd1010d3f6.jpg d7ca4b90715b4c4b9df2ec89792bb37b.jpg 597adf8b9c184a4c994aa50bf6893ced.jpg 9b3f96ce9a754163848bf1581d0cf840.jpg ef487079bfc2461c8523853f584ad5bd.jpg
ea207e66c9fa450fb6010a8c0b74fcde.jpg 87f8c2b736294418bfcd34defcc07239.png 2d961e0fa4c84bec943a38892d2c0a39.jpg 56a75d55b630499e87125019c325e872.jpg 8ae6d058d6344eec80c22c32848a28a3.jpg
719e182ef0f54bf6ae995880efd1054b.png 64ed3dfebaa34a159eddc28186fdbbe7.jpg 21052b7852f84332829ed8be1a5e9e7d.jpg b73ce8d4202347b38ed21629692269af.jpg 488573132d3e4c2e8f92649e1ba85d83.jpg
423e0d4e5b7e4d21a6cf058df20fe0db.jpg 9665c0591cc54c29a3359f35e38f06d9.jpg 3dc39ac31c1b4cdb80645d32df39a9ab.jpg ed2e35c6c3224798b1059cd5b689bad7.jpg 671def52e0b04e5eb7f9e767359a5658.jpg
949fdac3fea747e4bc287c2dbad256b0.jpg eefaede7a0d34605b04576203dac91b8.jpg 6ed362f4b9a54d74a0e933923f49dbd7.jpg 7ba0224fd90a4d8db7dcffedc374b428.jpg 18461a9a63c4459bbdd878faf9be94f0.jpg
faa2fa18771f4950b784c1ecf064d52e.jpg 7f2d4d08400f4c33bbec57145bc5dcdd.jpg 5fc018ac72a343eab0fa3e836b6e0081.png 2915c519a5c04e7fb9f526deb4141c23.jpg 47191658cf89430f83e87e3aa3b2aa49.jpg
e131421c6b894b9eb52ee1e85a09f185.jpg c8353bd843c341a5b63658be7aba9c16.jpg cc9ec426c6f14adab8d8a1d0de47d85f.jpg 2e3ae1ac44224548a811f97ee80fed6a.jpg 29363f13acba46bb868e88c1afb910f5.jpg
49626474ab54418591ed4441b6ed1856.jpg a599587f661e4e49baef8a70f0716cb0.jpg f4bcda26331c44d3a5569f59923a7c44.jpg 35f403175d7f4bdfa39a96169e3e3fed.jpg ddb517622d6a4505b621969c3049ca98.jpg
32db3d7db4ba4f838100f7dafb9a31f7.jpg 5f9a5d4897ec4e2b80c2b91c6c6ec185.jpg 4d837355a571451082eeeabdfdf0c4a6.png 1b379d3619734e47a8ad5207ed11f603.jpg b8148870458c430caad9166afa701df5.jpg
566298e001b84b7c8c2411583ace0521.jpg 3254419c30574478ac5e10e4ec941788.jpg c8e519a2fa5a4bc0b0d0661eea8ae573.jpg 9d76cf75d21e411e94d0589780de2014.jpg 919bb2378c3f48d6b3cbf1c053516f0e.jpg
26e2ee21d0834a37ade8d27a42cfb732.jpg 0e4f90bca47e45fba4346e2d75360f81.jpg c9984ed8be24449186a5ffba0f2cec61.jpg f84ed4e2044b4407947eeecab599b5b8.jpg 2aeb285895bd427582ff994e145c2524.png
4051680020794e99b46c8acf34094645.jpg c1ebedc1a1e04e23a1218266f1a16065.jpg - f66b611a904046c8a9406797dd98b7e3.png 024eff0dda494eac9ab4553db9c524ff.png
998735c597654f1fa2b73c520aa6a754.jpg 72d2e8410c014cc2b6ccafcb2e1f9b64.jpg d166ca8a77544e7ab6627466a7d5cb1c.jpg 3d0a3184f4b84704b8b4d4f02a415110.jpg b2c92e22882e4f698cd68b9c4c5c1d8a.jpg
5b750bcaf23a44fea311b15b8b497cbf.jpg 960665d2b4924024abdddc32949bbc17.jpg 295745d42fed4406905f1bc8b39bdde9.jpg ac351da15fa248da9e02f035cb3a204b.jpg e55158b413c2454aafbfeb0d1f77ac6c.jpg
05048ae15d404defa5a8b23c85d495e6.jpg 788d9ef8579f4af9845365da765f1b25.png b86e3480d46d418388ffb37c50fd0c06.jpg 404624b1cd104ea8bc164306d9dbd0e7.jpg a8229787ce9e4c3da9775d1392cc099d.jpg
744f145f4b0f433da69014ec5c7c7176.png 335e2cb3b09f4381858f2db9e4f404ef.jpg df7cbd0d5645491f8c5386ca4765519a.jpg 71f9bc456c6d49c49b11cf92c7cefeef.jpg a727346ea9184983ba8c9ced4f5a555b.jpg
e1239bc8ea7f4930b0b8f16fde1bc9d0.png 4f30518a203c4c06aaa13dbd468c2c3c.png 0b99204f74b74fd7a6dc6f22aac68350.jpg 04431c5959f64aec9f1b35743fe79aa4.jpg 2823c2319a6c4ec09aad95bfda261ce1.jpg
958fb6434a2b486cbd520dbba14abf87.jpg 9ec7a89dfb974c519e91096972473976.jpg 4d87b2a90a2748f38f575d3efbf24680.jpg 54dfa301f6864aec98fe7c0000c49a08.jpg 94e741fde6ac4c6182221e8c72da7301.jpg
f7ae3d269115422e84bec429f2e0c725.jpg ab0d930236274bbdafb71d021aecea41.png 651706ae1e904cefaf7009d5a68cd9d8.jpg 29adcddf9b5343fe976bb30f47e1c8db.jpg eb840e37ef76453680fcdb195268d0ac.jpg
7de4cab2800b4992afa25cf0008668e3.jpg 91ec8bc66f3a4a7281eded2bd4bcc53d.jpg a019013ff40e4f50b619eb6b2f8e7f73.jpg fb49dad7fb634a0da61b6fbb2d63a42c.jpg 38f41f13ffb44f6aa0d02a626089beb8.jpg
433c5c388ed341d68eb581e1c45be0ce.png 34fe1a1628424f5db3b71baeb2c2e216.jpg 1c862714dbeb494eacc23dd74a7a0016.png e7c2ad8c70ff4aca910572bb9934d562.jpg e15491a8fe564f3c985ae38df96904dd.jpg
b9d93804a4c24492a4b28e0ed39ecaf4.jpg 76612eba901946ce99c1f9ed681b2d11.jpg 3156cee261794ecfa71b735acc474c9b.jpg 984d88149ff14c40a4e0eb7e18b10e11.jpg d8a53de49b54445ba798eb12273068be.jpg
52935b7df4c5496585f3d4d7a945dbf5.jpg b9f8ab0c132a43eb8e5f73916f2e5d36.png d86038abbcf54388a2e2f2006510c8f6.png e40c8ffd661b4b098c4c9adc90c9e598.jpg c2b662dcfc3c4a42b9f53e29e199eb32.jpg
2ab6b2a7d2834789803e5c14655378cf.png ad6fe6bc968c4a9683cc2a8b160cd609.png 842918ac522046388bbb1dabff62a698.jpg 8a3f19e3d065409f9fa71c55ef3d7888.jpg 0e39e8bd0ca142e4a8b0d45a98cb1e47.jpg
6fc24b0dd09c45abb2c8c701e5e42fc6.jpg 1642f4928d554b7386ef0518e99ad760.jpg 790aed34642b4e1081d39589a6126ffe.png c29ec478aa064687be5c2bfa9907e852.jpg f12f5c03348841248d517e610192e8cd.png
8e3998f1394e46a4b63ccc69b1c8c1f4.jpg 5d11a37d90f546368ee517321391402d.png 752fbedfa5d5451ba2f978501e777276.jpg b2b6f182251340709719f39ef04f8ce7.jpg 8a8c96d8d2fa426c92d59da08c9fe167.jpg
8f9d23c8fa0446afb23e94d2e64c2c1b.jpg e92bf01578b64b7e9a564f380392f405.jpg 527eca2357404ff1b81f62b08eb036e4.jpg 4cbb87353f6f470eb46b4ca7236298f8.jpg 1a7c71d7e2994661980bb7cea075da46.jpg
c81f1a1bab124be39b58b73ea43527de.jpg 44430802565c46ffbd08fa4b6d01dcaa.jpg 7955b2be5c4044c8bd025e23f499e2e1.jpg aea6d07a72804224a6a8b2c6504444f8.png d2fdd5eab3ab4139bd478fcda9f15943.jpg
858a7e356a884997b6f934e52aa65240.jpg 7d1418eb3b4343c2aab663290ab94ab5.png e73ca3dc8ab34e5ba6bdb7fc00703cf3.jpg c91163f8fda847c7b4046b8d158c2e1d.png 48865d03a0bc41ad8f340e6cc0ddc661.jpg
`;

const UNITS = [
  { n: 1, name: "Global Prehistory", from: 1, to: 11 },
  { n: 2, name: "Ancient Mediterranean", from: 12, to: 47 },
  { n: 3, name: "Early Europe and Colonial Americas", from: 48, to: 98 },
  { n: 4, name: "Later Europe and Americas", from: 99, to: 152 },
  { n: 5, name: "Indigenous Americas", from: 153, to: 166 },
  { n: 6, name: "Africa", from: 167, to: 180 },
  { n: 7, name: "West and Central Asia", from: 181, to: 191 },
  { n: 8, name: "South, East, and Southeast Asia", from: 192, to: 212 },
  { n: 9, name: "The Pacific", from: 213, to: 223 },
  { n: 10, name: "Global Contemporary", from: 224, to: 250 },
];

const FIELDS = ["title", "artist", "culture", "location", "date", "material"];

function parseWorks() {
  const images = IMAGES_RAW.trim().split(/\s+/).map(s => (s === "-" ? "" : s));
  const works = [];
  for (const line of WORKS_RAW.trim().split("\n")) {
    const parts = line.split("|");
    if (parts.length !== 7) throw new Error("Bad line (needs 7 fields): " + line);
    const num = parseInt(parts[0], 10);
    const w = { num, unit: UNITS.find(u => num >= u.from && num <= u.to).n, fields: {} };
    FIELDS.forEach((f, i) => {
      const raw = parts[i + 1].trim();
      if (!raw) return;
      const alts = raw.split("~").map(s => s.trim()).filter(Boolean);
      w.fields[f] = { answer: alts[0], accept: alts.slice(1) };
    });
    const img = images[num - 1] || "";
    w.image = img ? IMAGE_BASE + img : "";
    works.push(w);
  }
  return { works, imageCount: images.length };
}

if (typeof module !== "undefined") module.exports = { WORKS_RAW, IMAGES_RAW, UNITS, FIELDS, parseWorks };
