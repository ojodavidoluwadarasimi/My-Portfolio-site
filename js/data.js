/* Content for Notebook, Lab and GitHub. Add real entries here only when they exist. */
window.PORTFOLIO_DATA = {
  articles: [
    {
      title: "Lessons from building ScoreWise and Kicks & Cuffs",
      category: "Project lessons",
      description: "What building a CBT exam platform and a footwear store taught me about starting from the user, shipping early and respecting real constraints.",
      date: "2026-11-25",
      readingTime: "1 min read",
      body: '<p>ScoreWise and Kicks &amp; Cuffs are the two projects I have finished and put live so far. They solve very different problems, but building both taught me the same few things about how to approach engineering work.</p><h4>Start from the real user</h4><p>ScoreWise is a computer based testing platform for JAMB UTME and Post-UTME preparation. The hardest part was making the interface feel like the real exam while staying usable. Thinking about how students actually sit that exam drove more design decisions than any technical preference did.</p><h4>Ship a working slice first</h4><p>I kept the core exam flow solid and added features progressively: subject categories, performance tracking, lessons, keyboard shortcuts and dark mode. A working vertical slice early was worth more than many half finished features.</p><h4>Real constraints improve the design</h4><p>Kicks &amp; Cuffs is an online footwear store. Treating size as a first class part of inventory, and handling real Paystack payments, forced me to think carefully about stock handling and about keeping payment and order state reliable. A store that takes real money cannot behave like a demo.</p><h4>Clarity over feature volume</h4><p>Small sellers need something clear and dependable more than a long feature list. That is why the owner dashboard stays simple and the storefront stays focused on the product.</p><h4>What I want to improve</h4><p>Richer analytics and better admin tooling for ScoreWise. Inventory alerts and better order management for Kicks &amp; Cuffs. Both also need more performance and accessibility work.</p>'
    }
  ],
  plannedTopics: [
    "Memory management in C++","Pointers and references","Algorithm complexity","How HTTP requests work",
    "REST API design","Authentication and sessions","Database indexing","Processes versus threads",
    "Concurrency and distributed systems"
  ],
  experiments: [
    { title:"REST API performance testing", objective:"Measure how a small API behaves under load.", status:"Planned" },
    { title:"Database indexing benchmarks", objective:"Compare query times with and without indexes.", status:"Planned" },
    { title:"C++ multithreading experiments", objective:"Explore threads, locks and shared state in modern C++.", status:"Planned" },
    { title:"Caching implementation", objective:"Build a simple cache and study its trade offs.", status:"Planned" },
    { title:"Algorithm performance comparisons", objective:"Compare algorithms empirically against their theory.", status:"Planned" },
    { title:"Distributed systems simulations", objective:"Simulate nodes, failures and consistency problems.", status:"Planned" }
  ],
  repos: [
    { owner:"ojodavidoluwadarasimi", name:"scorewise-cbt-portal", fallback:"JAMB UTME and Post-UTME computer-based testing platform.", stack:"Python, FastAPI, Supabase" },
    { owner:"ojodavidoluwadarasimi", name:"kicks-and-cuffs", fallback:"Footwear e-commerce store with size based inventory and Paystack payments.", stack:"JavaScript, Supabase, Paystack" }
  ]
};
