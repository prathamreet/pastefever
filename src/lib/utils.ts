export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export const formatTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

export const generateObjectLabel = (timestamp: number): string => {
  const adjectives = [
    // Original
    "vibrant", "zenith", "kinetic", "silent", "bold", "mystic", "rapid", "stable",
    "fluid", "stark", "neon", "prism", "shadow", "lunar", "arctic", "cosmic",
    "urban", "prime", "alpha", "delta", "sigma", "echo", "vector", "binary",
    "hidden", "stealth", "active", "proxy", "static", "atomic", "quantum", "neural",
    
    // Energy & Motion
    "dynamic", "blazing", "swift", "volatile", "thermal", "kinetic", "radiant",
    "pulsing", "surging", "flowing", "drifting", "shifting", "rolling", "spinning",
    
    // Tech & Digital
    "digital", "cyber", "virtual", "pixel", "crypto", "meta", "hyper", "ultra",
    "mega", "giga", "tera", "nano", "micro", "macro", "proto", "beta", "gamma",
    "omega", "nexus", "flux", "apex", "vertex", "matrix", "grid", "mesh",
    
    // Nature & Elements
    "solar", "stellar", "nebula", "crystal", "iron", "steel", "titanium", "carbon",
    "plasma", "photon", "electric", "magnetic", "ionic", "azure", "crimson", "ember",
    "frost", "storm", "thunder", "lightning", "wind", "ocean", "granite", "obsidian",
    
    // Qualities & States
    "sharp", "smooth", "rough", "sleek", "polished", "matte", "glossy", "chrome",
    "phantom", "ghost", "spectral", "ethereal", "void", "null", "blank", "pure",
    "mixed", "hybrid", "fused", "merged", "split", "dual", "triple", "quad",
    
    // Temporal & Spatial
    "instant", "eternal", "ancient", "future", "modern", "retro", "classic", "legacy",
    "distant", "near", "deep", "shallow", "high", "low", "inner", "outer",
    "central", "remote", "local", "global", "universal", "dimensional", "parallel",
    
    // Mystery & Stealth
    "rogue", "shadow", "dark", "light", "bright", "dim", "faint", "vivid",
    "obscure", "cryptic", "encoded", "sealed", "locked", "open", "free", "bound",
    
    // Power & Strength
    "mighty", "fierce", "savage", "wild", "tame", "calm", "chaos", "ordered",
    "solid", "liquid", "vapor", "dense", "thin", "heavy", "light", "mass",
    "force", "power", "energy", "inert", "dormant", "awake", "live", "dead",
    
    // Colors & Visuals
    "red", "blue", "green", "yellow", "purple", "orange", "violet", "indigo",
    "silver", "golden", "bronze", "copper", "jade", "ruby", "sapphire", "emerald",
    "amber", "onyx", "pearl", "ivory", "ebony", "coral", "magenta", "cyan",
    
    // Abstract Tech
    "logical", "random", "ordered", "chaotic", "linear", "circular", "spiral", "helix",
    "fractal", "infinite", "finite", "bounded", "endless", "terminal", "initial", "final"
  ];

  const nouns = [
    // Original
    "cheetah", "falcon", "raven", "matrix", "nexus", "orbit", "cipher", "glimmer",
    "pulse", "engine", "sphere", "vortex", "system", "module", "node", "core",
    "vertex", "frame", "strand", "signal", "photon", "buffer", "kernel", "layer",
    "anchor", "bridge", "portal", "sensor", "entity", "object", "vector", "point",
    
    // Animals
    "wolf", "hawk", "eagle", "panther", "tiger", "lion", "bear", "fox",
    "lynx", "cobra", "viper", "python", "dragon", "phoenix", "griffin", "hydra",
    "kraken", "shark", "whale", "dolphin", "orca", "manta", "barracuda", "marlin",
    "leopard", "jaguar", "cougar", "condor", "owl", "bat", "spider", "scorpion",
    
    // Tech Components
    "processor", "chip", "circuit", "diode", "transistor", "capacitor", "resistor", "relay",
    "switch", "router", "server", "client", "host", "terminal", "console", "interface",
    "protocol", "packet", "stream", "channel", "pipeline", "queue", "stack", "heap",
    "cache", "memory", "storage", "register", "pointer", "index", "array", "list",
    
    // Spatial & Geometric
    "cube", "pyramid", "prism", "cylinder", "cone", "torus", "helix", "spiral",
    "grid", "mesh", "lattice", "web", "net", "fabric", "weave", "pattern",
    "axis", "plane", "surface", "edge", "angle", "curve", "line", "arc",
    "circle", "square", "triangle", "polygon", "hexagon", "octagon", "diamond", "star",
    
    // Celestial & Space
    "star", "comet", "meteor", "asteroid", "planet", "moon", "sun", "galaxy",
    "nebula", "quasar", "pulsar", "supernova", "blackhole", "wormhole", "cosmos", "void",
    "constellation", "aurora", "eclipse", "zenith", "horizon", "equator", "meridian", "pole",
    
    // Energy & Physics
    "atom", "quark", "proton", "neutron", "electron", "positron", "neutrino", "boson",
    "particle", "wave", "field", "force", "charge", "spin", "momentum", "flux",
    "resonance", "frequency", "amplitude", "wavelength", "spectrum", "radiation", "emission", "absorption",
    
    // Systems & Structures
    "framework", "platform", "foundation", "infrastructure", "architecture", "scaffold", "skeleton", "chassis",
    "assembly", "construct", "mechanism", "apparatus", "device", "instrument", "tool", "utility",
    "hub", "spoke", "rim", "axle", "gear", "lever", "spring", "hinge",
    
    // Data & Information
    "data", "info", "byte", "bit", "word", "block", "chunk", "segment",
    "record", "entry", "field", "key", "value", "token", "string", "char",
    "hash", "code", "script", "program", "process", "thread", "task", "job",
    
    // Network & Communication
    "link", "connection", "socket", "port", "gateway", "firewall", "endpoint", "peer",
    "broadcast", "multicast", "unicast", "handshake", "sync", "async", "request", "response",
    "ping", "beacon", "radar", "sonar", "scanner", "detector", "probe", "tracer",
    
    // Abstract Concepts
    "concept", "notion", "idea", "thought", "logic", "reason", "principle", "theory",
    "model", "schema", "blueprint", "template", "pattern", "format", "structure", "design",
    "algorithm", "function", "method", "procedure", "routine", "operation", "action", "event",
    
    // Containers & Boundaries
    "container", "wrapper", "envelope", "package", "bundle", "cluster", "group", "set",
    "collection", "pool", "reservoir", "vault", "chamber", "cell", "compartment", "section",
    "zone", "region", "domain", "realm", "territory", "sector", "quadrant", "district",
    
    // Time & Sequence
    "epoch", "era", "cycle", "phase", "stage", "step", "iteration", "generation",
    "sequence", "series", "chain", "cascade", "ripple", "wave", "pulse", "beat",
    "tick", "clock", "timer", "counter", "meter", "gauge", "indicator", "marker",
    
    // Elements & Materials
    "element", "compound", "alloy", "composite", "mixture", "solution", "crystal", "mineral",
    "metal", "polymer", "ceramic", "glass", "fiber", "filament", "wire", "cable"
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  const date = new Date(timestamp);
  const HH = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  const mo = (date.getMonth() + 1).toString().padStart(2, '0');
  const shortTs = `${HH}${mm}-${dd}${mo}`;
  
  return `${adj}-${noun}-${shortTs}`;
};