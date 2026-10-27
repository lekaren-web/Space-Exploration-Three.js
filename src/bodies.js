// The Sun, planets, Pluto and the Moon. Sizes and distances are compressed so everything fits on
// screen; periods and facts are real. `year` is in Earth years, `day` in Earth hours (negative = spins
// backwards), `tilt` in degrees.
export const bodies = [
  {
    id: 'sun', name: 'Sun', kind: 'Star', radius: 10, color: '#ffb347',
    text: 'A yellow dwarf star that holds 99.8% of the solar system’s mass.',
    facts: [['Diameter', '1.39 million km'], ['Day', 'About 25 Earth days at the equator'], ['Age', 'About 4.6 billion years']],
  },
  {
    id: 'mercury', name: 'Mercury', kind: 'Planet', radius: 1.2, orbit: 22, year: 0.241, day: 1408, tilt: 0.03, color: '#b7b2ab',
    text: 'The smallest planet and the closest to the Sun, with almost no atmosphere to hold heat.',
    facts: [['Diameter', '4,879 km'], ['Year', '88 Earth days'], ['Day', '59 Earth days'], ['From the Sun', '0.39 AU']],
  },
  {
    id: 'venus', name: 'Venus', kind: 'Planet', radius: 2, orbit: 30, year: 0.615, day: -5832, tilt: 177, color: '#e3c58f',
    text: 'The hottest planet. Thick carbon dioxide clouds trap heat, and it spins backwards.',
    facts: [['Diameter', '12,104 km'], ['Year', '225 Earth days'], ['Day', '243 Earth days'], ['From the Sun', '0.72 AU']],
  },
  {
    id: 'earth', name: 'Earth', kind: 'Planet', radius: 2.1, orbit: 40, year: 1, day: 23.9, tilt: 23.4, color: '#4f8fd6',
    text: 'The only world known to host life, and the only one with liquid water on its surface.',
    facts: [['Diameter', '12,742 km'], ['Year', '365.25 days'], ['Day', '23.9 hours'], ['From the Sun', '1 AU (150 million km)']],
  },
  {
    id: 'moon', name: 'Moon', kind: 'Moon of Earth', radius: 0.6, parent: 'earth', orbit: 4.2, year: 0.0748, day: 655.7, tilt: 6.7, color: '#c9c9c9',
    text: 'Earth’s only natural satellite. It always shows us the same face.',
    facts: [['Diameter', '3,474 km'], ['Orbit', '27.3 days'], ['From Earth', '384,400 km']],
  },
  {
    id: 'mars', name: 'Mars', kind: 'Planet', radius: 1.6, orbit: 50, year: 1.88, day: 24.6, tilt: 25.2, color: '#d0734a',
    text: 'A cold desert world with Olympus Mons, the tallest volcano in the solar system.',
    facts: [['Diameter', '6,779 km'], ['Year', '687 Earth days'], ['Day', '24.6 hours'], ['From the Sun', '1.52 AU']],
  },
  {
    id: 'jupiter', name: 'Jupiter', kind: 'Planet', radius: 6, orbit: 72, year: 11.86, day: 9.9, tilt: 3.1, color: '#d6b48c',
    text: 'The largest planet. Its Great Red Spot is a storm wider than Earth.',
    facts: [['Diameter', '139,820 km'], ['Year', '11.9 Earth years'], ['Day', '9.9 hours'], ['From the Sun', '5.2 AU']],
  },
  {
    id: 'saturn', name: 'Saturn', kind: 'Planet', radius: 5, orbit: 96, year: 29.46, day: 10.7, tilt: 26.7, color: '#e6d3a3', rings: true,
    text: 'A gas giant with the brightest rings in the solar system, made mostly of ice.',
    facts: [['Diameter', '116,460 km'], ['Year', '29.5 Earth years'], ['Day', '10.7 hours'], ['From the Sun', '9.5 AU']],
  },
  {
    id: 'uranus', name: 'Uranus', kind: 'Planet', radius: 3.4, orbit: 118, year: 84, day: -17.2, tilt: 97.8, color: '#9fdbe2',
    text: 'An ice giant tipped on its side, so it rolls around the Sun.',
    facts: [['Diameter', '50,724 km'], ['Year', '84 Earth years'], ['Day', '17.2 hours'], ['From the Sun', '19.2 AU']],
  },
  {
    id: 'neptune', name: 'Neptune', kind: 'Planet', radius: 3.3, orbit: 138, year: 164.8, day: 16.1, tilt: 28.3, color: '#5b82e6',
    text: 'The windiest planet, with the fastest winds measured in the solar system.',
    facts: [['Diameter', '49,244 km'], ['Year', '165 Earth years'], ['Day', '16.1 hours'], ['From the Sun', '30.1 AU']],
  },
  {
    id: 'pluto', name: 'Pluto', kind: 'Dwarf planet', radius: 0.9, orbit: 156, year: 248, day: -153.3, tilt: 122.5, color: '#cfb294',
    text: 'A dwarf planet in the Kuiper Belt, with a bright heart-shaped plain of nitrogen ice.',
    facts: [['Diameter', '2,377 km'], ['Year', '248 Earth years'], ['Day', '6.4 Earth days'], ['From the Sun', '39.5 AU']],
  },
]
