This folder holds the cover image for each Archive timeline project
(the horizontal gallery on the homepage, under the bubble chart).

Filenames are auto-generated from each project's "Project Name" in
timeline.csv (lowercased, spaces -> hyphens, punctuation stripped) -
drop a matching .jpg in here and it's picked up automatically, no
code changes needed. Anything missing falls back to a plain gray
placeholder with the project name on it, so nothing breaks in the
meantime.

Expected filenames, from the current timeline.csv:

hades-a-gateway-to-olympus.jpg              <- Hades — A Gateway to Olympus
into-other-waters-for-love-exploration.jpg  <- Into Other Waters — For Love & Exploration
spiritfarer-caring-for-the-lost.jpg         <- Spiritfarer — Caring for the Lost
assemble-with-care-and-curiosity.jpg        <- Assemble with Care — and Curiosity
zelda-a-breath-of-fresh-wind.jpg            <- Zelda — A Breath of Fresh Wind
the-backbencher.jpg                         <- The Backbencher
lost-in-dungeon.jpg                         <- Lost in Dungeon
crisis-city.jpg                             <- Crisis City
press-start-to-play.jpg                     <- Press Start to Play
the-root-of-love.jpg                        <- The Root of Love
top-of-tetris.jpg                           <- Top of Tetris
1-dash.jpg                                  <- 1 Dash
project-age-99.jpg                          <- Project Age 99
cricket-kings.jpg                           <- Cricket Kings
cricket-score-hero.jpg                      <- Cricket Score Hero
bumpy-ride.jpg                              <- Bumpy Ride
publication-design.jpg                      <- Publication Design
limitless-institute.jpg                     <- Limitless Institute
nuqi-social-media.jpg                       <- Nuqi Social Media
packaging-baarbara-coffee.jpg               <- Packaging — Baarbara Coffee
school-performance-booster.jpg              <- School Performance Booster
fiddling-with-my-mind.jpg                   <- Fiddling with my Mind
the-hottest-chillis.jpg                     <- The Hottest Chillis
product-design-carrier.jpg                  <- Product Design — Carrier
fabled-ciphers.jpg                          <- Fabled Ciphers
trapped.jpg                                 <- Trapped
extractor.jpg                               <- Extractor
bird-map.jpg                                <- Bird Map
moodstich.jpg                               <- Moodstich
56-bhog.jpg                                 <- 56 Bhog
undersea-cables.jpg                         <- Undersea cables
lighrock.jpg                                <- Lighrock
aquiring-bubble-chart.jpg                   <- Aquiring Bubble Chart
nbfc-revenue-chart.jpg                      <- NBFC Revenue Chart
intermission-bajaj-finance.jpg              <- Intermission: Bajaj Finance
exp-003-particle-and-audio.jpg              <- Exp - #003 _ particle and audio
exp-006-particles-and-noise.jpg             <- Exp. #006 _ particles and noise
exp-010-hand-tracking-audio-object-transform.jpg <- Exp 010 . hand tracking + audio & object transform .
astrome-fresnal-calculator.jpg              <- Astrome Fresnal Calculator
taktse-report-card.jpg                      <- Taktse Report Card

--- Needs a fix in timeline.csv first ---

intermission-asian-paints.jpg  <- FOUR rows share the exact name
                                   "Intermission: Asian Paints", but
                                   their descriptions are clearly 4
                                   different episodes (Asian Paints,
                                   Bajaj Finance is correctly named
                                   separately, but the Bharti Airtel
                                   and ITC rows are also mislabeled
                                   "Intermission: Asian Paints"). As
                                   it stands, all of those would
                                   collide onto this one filename.
                                   Rename those 2 rows' Project Name
                                   to match their real subject and
                                   they'll get their own image slot.

One more thing worth fixing in timeline.csv: the "Publication Design"
row's Date cell is just "16th 2020" (missing the month name) - it's
currently defaulting to Jan 1, 2020 on the timeline. Fix that cell to
its real date (e.g. "16th April 2020", matching the format used
elsewhere) to place it correctly.
