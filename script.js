  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const tag = s => "#" + s.replace(/[^a-z0-9]/gi, "");

  // Tone vocabulary
  const voice = {
    friendly: { open: ["Hey there!", "Good news, friends:", "We have something for you."], adj: ["lovingly made", "easy to love", "thoughtfully designed"], close: ["Come say hi.", "We can't wait to hear what you think.", "Treat yourself today."] },
    bold:     { open: ["Stop scrolling.", "Ordinary is over.", "Here's your upgrade."], adj: ["unapologetically better", "built to stand out", "seriously powerful"], close: ["Get yours now.", "Don't wait. Win the day.", "Make the move."] },
    luxury:   { open: ["Introducing", "Refined, by design:", "For the discerning:"], adj: ["exquisitely crafted", "timeless", "made to be savored"], close: ["Discover the collection.", "Experience the difference.", "Reserve yours today."] },
    playful:  { open: ["Ooh, look what just landed!", "Plot twist:", "Hold on to your socks!"], adj: ["ridiculously cute", "pure joy", "kinda magical"], close: ["Go on, you deserve it!", "Tell your friends (or don't, more for you).", "Tap, shop, smile."] }
  };

  const builders = {
    caption: (t, a, v) => `${pick(v.open)} ${cap(t)} for ${a}: ${pick(v.adj)}. ${pick(v.close)}\n\n${tag(t.split(" ")[0])} ${tag(a.split(" ")[0])} #smallbusiness #newdrop`,
    product: (t, a, v) => `${cap(t)}\n\n${pick(v.open)} Made for ${a}, this is ${pick(v.adj)} from the first moment.\n\n- Quality you can feel\n- Designed for everyday use\n- A great gift for someone special\n\n${pick(v.close)}`,
    ad: (t, a, v) => `Headline: ${cap(t)}, ${pick(v.adj)}\nBody: ${pick(v.open)} The favorite of ${a} everywhere. ${pick(v.close)}\nButton: Shop now`,
    email: (t, a, v) => `Subject: ${pick(v.open)} ${cap(t)}\n\nHi there,\n\nWe made something for ${a}: ${t}, ${pick(v.adj)} and ready when you are.\n\n${pick(v.close)}\n\nThe Quill team`
  };

  const $ = id => document.getElementById(id);
  let type = "caption", timer;

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");
      type = btn.dataset.type;
      generate();
    });
  });

  function generate() {
    const topic = $("topic").value.trim();
    const aud = $("audience").value.trim() || "everyone";
    const out = $("output");
    if (!topic) {
      out.className = "output empty";
      out.textContent = "Enter what you are promoting, then select Generate content.";
      $("actions").hidden = true;
      return;
    }
    const text = builders[type](topic, aud, voice[$("tone").value]);
    out.className = "output";
    out.textContent = "";
    $("actions").hidden = false;
    clearInterval(timer);
    let i = 0;
    timer = setInterval(() => {
      out.textContent = text.slice(0, i += 3);
      if (i >= text.length) { out.textContent = text; clearInterval(timer); }
    }, 14);
  }

  $("generate").addEventListener("click", generate);
  $("again").addEventListener("click", generate);
  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("output").textContent);
      $("copy").textContent = "Copied";
      setTimeout(() => $("copy").textContent = "Copy", 1500);
    } catch (e) { $("copy").textContent = "Copy failed"; }
  });
