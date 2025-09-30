exports.handler = async (event) => {
  try {
    const { message = "" } = JSON.parse(event.body || "{}");
    const faqs = [
      { q: "vaccines", a: "We require Rabies, DHPP, and Bordetella with proof." },
      { q: "overnight", a: "Overnight Stays include cozy suites, night checks, and webcams." },
      { q: "hours", a: "Open daily 6:30am–8:00pm. Self-bathing is 24/7 with code access." },
      { q: "groom", a: "Full service grooming by appointment. Ask about deshedding and nail trims." },
      { q: "training", a: "We offer Group, Private, Puppy U, and Stay-N-Train." },
      { q: "splash", a: "Indoor/outdoor splash parks with supervision and size/play style groups." },
      { q: "reservation", a: "Use the Reservations form; we confirm via email shortly." }
    ];
    const lower = message.toLowerCase();
    const hit = faqs.find(f => lower.includes(f.q));
    const reply = hit
      ? hit.a
      : "Thanks for asking! I can help with services, reservations, hours, and requirements. Try asking about vaccines, overnight, or grooming.";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 200, body: JSON.stringify({ reply: "I had trouble understanding that—please try again." }) };
  }
};
