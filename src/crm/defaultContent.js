// path: src/crm/defaultContent.js
export const defaultContent = {
  site: {
    name: "Meadow Ridge Pet Lodge",
    logoUrl: "/logo.svg",
    phone: "(555) 555-0123",
    email: "hello@happypaws.example",
    address: "123 Wag Street, Pawville, USA",
    social: {
      facebookUrl: "https://www.facebook.com/MeadowRidgePetLodge",
      instagramUrl: "https://www.instagram.com/meadowridgepetlodge"
    },
    hours: {
      weekly: [
        { day: "Sunday", open: "", close: "", closed: true },
        { day: "Monday", open: "8:00 AM", close: "5:00 PM", closed: false },
        { day: "Tuesday", open: "8:00 AM", close: "5:00 PM", closed: false },
        { day: "Wednesday", open: "8:00 AM", close: "5:00 PM", closed: false },
        { day: "Thursday", open: "8:00 AM", close: "5:00 PM", closed: false },
        { day: "Friday", open: "8:00 AM", close: "5:00 PM", closed: false },
        { day: "Saturday", open: "9:00 AM", close: "2:00 PM", closed: false },
      ],
      holiday: "",
    },
  },

  seo: {
    defaultTitle: "Meadow Ridge Pet Lodge – Pet Day Care & Boarding",
    defaultDescription: "Indoor/outdoor splash parks, boarding, grooming, training, and more.",
    defaultImage: "/logo.svg",
    canonicalBase: "", // e.g. "https://happy-paws-2025.netlify.app" or your custom domain
    twitterHandle: "", // e.g. "@HappyPaws"
    pages: {
      home: {
        title: "Meadow Ridge Pet Lodge – Pet Day Care & Boarding",
        description: "Safe, clean, and joy-filled experiences for dogs and their humans.",
        image: "",
      },
      services: { title: "Services • Happy Paws", description: "Splash parks, overnight stays, day options, grooming & more.", image: "" },
      prices: { title: "Prices • Happy Paws", description: "Service pricing and options.", image: "" },
      training: { title: "Training • Happy Paws", description: "Group classes, private lessons, Puppy U, Stay-N-Train.", image: "" },
      about: { title: "About • Happy Paws", description: "Meet the team, our mission, and what sets us apart.", image: "" },
      contact: { title: "Contact • Happy Paws", description: "Ask questions or request a reservation.", image: "" },
      jobs: { title: "Careers • Happy Paws", description: "Join a mission-driven team that puts dogs first.", image: "" },
      privacy: { title: "Privacy Policy • Happy Paws", description: "How we respect and protect your data.", image: "" },
      credits: { title: "Site Credits • Happy Paws", description: "Acknowledgements and attributions.", image: "" },
    },
  },

  theme: {
    body: { color: "#ffffff", imageUrl: "", size: "cover", repeat: "no-repeat", position: "center center", attachment: "scroll" },
    pages: {
      home: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      services: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      prices: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      training: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      about: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      contact: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      jobs: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      privacy: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
      credits: { color: "", imageUrl: "", size: "", repeat: "", position: "", attachment: "" },
    },
  },

  home: {
    heroImages: [
      "https://images.unsplash.com/photo-1558944351-c0d7e269024d",
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    ],
    mission: "Safe, clean, and joy-filled experiences for dogs and their humans.",
    missionTeasers: [
      { title: "Splash Parks", excerpt: "Indoor & outdoor water fun.", link: "/services#splash" },
      { title: "Overnight Stays", excerpt: "Cozy suites & 24/7 care.", link: "/services#overnight" },
      { title: "Training", excerpt: "From puppy to pro.", link: "/training" },
    ],
    quickLinks: [
      { label: "Mission", href: "/about#mission" },
      { label: "What Sets Us Apart", href: "/about#different" },
      { label: "FAQs", href: "/about#faqs" },
    ],
  },

  services: [
    { id: "splash", title: "Indoor / Outdoor Splash Parks", description: "Supervised splash zones for all sizes.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "overnight", title: "Overnight Stays", description: "Comfortable suites, night checks, and webcams.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "day", title: "Day Options", description: "Half, full, and extended day play.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "bathing", title: "24 Hour Code Access Self Bathing Room", description: "Wash anytime with secure access.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "birthday", title: "Birthday Parties", description: "Custom themes, photos, and treats.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "social", title: "Indoor / Outdoor Social Areas with 16 Tap Pour My Beer / Wine System", description: "Relax while pups play.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "events", title: "Events", description: "Monthly socials & adoption events.", startingAt: "", tiers: [], priceDetails: "" },
    { id: "grooming", title: "Full Service Grooming", description: "Baths, cuts, nails, and spa add-ons.", startingAt: "", tiers: [], priceDetails: "" },
  ],

  training: [
    { id: "group", title: "Group Obedience Classes", description: "Basic to advanced manners." },
    { id: "sport", title: "Sport, AKC & Fun Classes", description: "Rally, tricks, CGC." },
    { id: "puppy", title: "Puppy University", description: "Foundations for life." },
    { id: "private", title: "Private Lessons", description: "One-on-one coaching." },
    { id: "staytrain", title: "Stay-N-Train / Day-Train", description: "Board & train or daily." },
    { id: "trainers", title: "Meet The Trainers and Reviews", description: "Experienced, certified team." },
  ],

  about: {
    team: [
      { name: "Alex Rivera", role: "General Manager", photo: "", bio: "10+ years in pet care." },
      { name: "Sam Lee", role: "Head Trainer", photo: "", bio: "CPDT-KA & AKC evaluator." },
    ],
    mission: "We deliver safe, enriching, and transparent care that puts canine welfare first.",
    // New format: editable title + body (Markdown)
    different: [
      { title: "Advanced Air Purification in Every Animal Area", body: "With Aerapy air systems installed throughout all pet-access spaces, we actively reduce airborne contaminants, odors, and pathogens — promoting a cleaner, healthier environment for pets and staff alike." },
      { title: "Commercial-Grade Outdoor Play Surfaces", body: "All exterior play yards feature commercial-grade turf designed for durability, drainage, sanitation efficiency, and year-round safety." },
      { title: "VIP Presidential Private Suites", body: "Our premium private suites include in-room televisions and enhanced comfort features, offering a low-stress, luxury boarding experience for discerning pet parents." },
      { title: "Social Lounge with 16-Tap Beer & Wine System", body: "Guests enjoy a thoughtfully designed social space featuring a 16-tap self-serve beer and wine wall paired with theatre-quality popcorn — creating a hospitality experience unlike traditional kennels." },
      { title: "Heated Indoor Splash Park and Outdoor Splash Park", body: "Our heated splash park allows for safe, supervised water enrichment year-round, supporting exercise, mental stimulation, and controlled energy release." },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1558944351-c0d7e269024d",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      "https://images.unsplash.com/photo-1507149833265-60c372daea22",
    ],
    // Reviews removed (section removed)
    faqs: [
      { q: "What vaccines are required?", a: "Rabies, DHPP, and Bordetella. Proof required." },
      { q: "Do you separate by size?", a: "Yes, by size and play style with supervisor ratios." },
    ],
  },

  contact: {
    general: "Questions? Call, email, or use the form.",
    reservations: "Use the reservation form and we’ll confirm availability by email.",
  },

  jobs: {
    intro: "Join a mission-driven team that puts dogs first.",
    positions: [
      { title: "Daycare Attendant", description: "Supervise groups, clean & care.", applyLink: "#" },
      { title: "Groomer", description: "Full-service grooming experience.", applyLink: "#" },
    ],
  },

  policies: {
    privacy: "We respect your privacy. We collect only what we need to provide services…",
  },

  credits: {
    text: "Site by You. Photos via Unsplash placeholders—replace with client assets.",
  },
};