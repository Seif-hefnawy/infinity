export interface Memory {
  id: string;
  slug: string;
  title: string;
  date: string;
  image: string;
  story: string;
  spotifyUrl?: string;
   songTitle?: string;
  specialMessage: string;
}

export const memories: Memory[] = [
  {
    id: '1',
    slug: 'our-first-date',
    title: 'Our First Date',
    date: '14 February 2025',
    
    image: '/images/memories/img1.jpg',
    spotifyUrl:'https://open.spotify.com/embed/track/2PPN1HFpVotjq7oJIqQbnx?utm_source=generator',

    story:
      'I still remember how nervous we both were that day. We talked for hours, laughed about the smallest things, and somehow the evening felt much shorter than it really was. It was just a simple day, but it became the beginning of so many beautiful memories.',
    specialMessage:
      'If I could go back to one moment and live it all over again, I would choose this one. ❤️',
  },

  {
    id: '2',
    slug: 'our-first-trip',
    title: 'Our First Trip',
    date: '10 March 2025',
    image: '/images/memories/img2.jpg',
    story:
      'Our first trip together was full of little adventures. We got lost, laughed about it, discovered new places, and spent hours talking about everything and nothing. Looking back, it was never really about where we went. It was about being there together.',
    specialMessage:
      'Every place feels a little more beautiful when I am there with you.',
  },

  {
    id: '3',
    slug: 'our-anniversary',
    title: 'Our Anniversary',
    date: '14 February 2026',
    image: '/images/memories/img3.jpg',
    story:
      'One year later, we found ourselves celebrating the day where everything started. So much had changed, yet being with you still felt just as natural as that very first day. A whole year of conversations, laughter, little arguments, unforgettable moments, and memories I would never trade for anything.',
    specialMessage:
      'One year was only the beginning. I cannot wait to see how many more memories we create together. ❤️',
  },
];