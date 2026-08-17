export interface Memory {
  id: number;
  slug: string;
  title: string;
  date: string;
  image: string;
  story: string;
  contentImage?: {
    src: string;
    alt: string;
  };
  spotifyUrl?: string;
}

export const memories: Memory[] = [
  {
    id: 1,
    slug: "our-first-date",
    title: "Our First Date",
    date: "2025-02-14",

    // تظهر في Home Carousel
    // ونفس الصورة تصبح Hero في صفحة الذكرى
    image: "/images/memories/img1.jpg",

    story:
      "I still remember how nervous we both were that day. We talked for hours, laughed about the smallest things, and somehow the evening felt much shorter than it really was. It was just a simple day, but it became the beginning of so many beautiful memories.",

    // صورة واحدة فقط داخل الـ Story Content
    contentImage: {
      src: "/images/memories/img1.jpg",
      alt: "A moment from our first date",
    },

    spotifyUrl:
      "https://open.spotify.com/embed/track/2PPN1HFpVotjq7oJIqQbnx",
  },

  {
    id: 2,
    slug: "our-first-trip",
    title: "Our First Trip",
    date: "2025-06-21",

    // Carousel + Hero
    image: "/images/memories/img2.jpg",

    story:
      "I still laugh whenever I remember how completely lost we got on the way there. We had no idea where we were going, but somehow getting lost became one of my favorite parts of the whole trip. We spent the day discovering new places, taking random pictures, and making memories we never planned for.",

    // صورة واحدة داخل المحتوى
    contentImage: {
      src: "/images/memories/img2.jpg",
      alt: "A moment from our first trip",
    },

    spotifyUrl:
      "https://open.spotify.com/embed/track/EXAMPLE_TRACK_ID",
  },

  {
    id: 3,
    slug: "a-special-day",
    title: "A Special Day",
    date: "2025-08-10",

    // Carousel + Hero
    image: "/images/memories/img3.jpg",

    story:
      "Some days feel ordinary while you are living them, but later you realize they were anything but ordinary. This was one of those days. Nothing had to be perfect for it to become one of the moments I never wanted to forget.",

    // صورة واحدة داخل المحتوى
    contentImage: {
      src: "/images/memories/img3.jpg",
      alt: "A special moment from that day",
    },

    spotifyUrl:
      "https://open.spotify.com/embed/track/EXAMPLE_TRACK_ID",
  },
];