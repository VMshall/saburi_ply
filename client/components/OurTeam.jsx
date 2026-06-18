import { Button } from "./ui/button";

export function OurTeam() {
  const fallbackImage =
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&auto=format&fit=crop&w=1200&h=800";

  const teamMembers = [
    {
      id: 1,
      name: "Mr. Gajanand Munka",
      role: "Chairman & Founder",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Started Saburi in the early 1990s in Kolkata, focused on quality, automation, and sustainability.",
    },
    {
      id: 2,
      name: "Mr. Ankit Munka",
      role: "Managing Director",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Leads national expansion and operations with a modern, corporate outlook and strategic vision.",
    },
    {
      id: 3,
      name: "Mr. Manish Birdika",
      role: "Managing Director",
      image:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Drives overall growth and organizational development with hands-on leadership and market insight.",
    },
    {
      id: 4,
      name: "Mr. Mohit Agarwal",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Oversees executive operations, innovation, and the company’s growing WPC brand portfolio.",
    },
    {
      id: 5,
      name: "Mr. Rahul Munka",
      role: "Director",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Supports corporate governance, strategic planning, and emerging business development initiatives.",
    },
    {
      id: 6,
      name: "Mr. Manish Agarwal",
      role: "Director",
      image:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&auto=format&fit=crop&w=1200&h=800",
      bio:
        "Strengthens brand presence and customer relationships across markets with a focus on trust.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[80%] h-40 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-3">
            The people behind our quality and service. Meet the leaders driving
            Saburiply forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((m) => (
            <div
              key={m.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 bg-gray-100">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-black">
                  {m.role}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground">{m.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.bio}</p>

                <div className="mt-5 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Experience
                    </span>
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                      Leadership
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() =>
                      document
                        .getElementById("contact-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
