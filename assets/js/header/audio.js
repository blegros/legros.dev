let audioCtx = null;
let typingAudioBuffer = null;

// Extracted from Mechvibes (Holy Pandas switch - loud, tactile, very distinct classic mechanical clack)
const typingBase64 =
  "//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAAIKABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP////////////////////////////////8AAAA6TEFNRTMuMTAwAc0AAAAAAAAAABSAJAP7QgAAgAAACCg7BV7tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAAAEvUnEtTHgBtcMyj/M5AACAAADYcCACANCZFd+rZLBuBMD4jnQAgGcJGWOemWNXzv5DkOh0f5B0ePgAjAxljhKyZjUbn5FYrFZEzZOE7Oud5Ehp9RyHOo4+KZu/fvHmrv1er2ePSlKf/0f33/73vEpT5vf0fv49/e970pT//FH79/e9//////38e4eHn/4AIiCOh4eAAAAAAYeHh4eAAAAAAYeHh4eAMssxCAGQEYEIFAoSDwfoPKAPCu9zj4zBbkOBRIzgppAYKgISGCMOU8BgE8Wz9Yy7yMJhm0jT3DZUiM+yhhzeGlDGp528n+gWXO6e55xxkKiONuOOJR07NJI2z6XC9LRkgId7UkkUzr/lcltbLdlzJXuz2knncnKO9nYld+52pS233dJplyn/dJKKClt0/amfZZzKxhcwo3AnbtarLbVi/rv71Uu38+yK3Zp6fkXt95uKU/aTPt/mf8///////////n////////w+3OCoOirW61aZyyldNa2pFG2gQCk05dEh75d1o7MmbFylL2Gr5R9bWUrxL+//uSxA6AEtFjV72FgBKZreh1jSQ6MBhS+AQR9NgIgDjMxOG2VAPgRgTklQSQRTMnJjtO0O4lZlO0lD0bH749E4bGzmqOglHnOc2tNYpRo1dy2kWlsJOPOc6+DpqOkmta2npOvbVce01NTVtNY6a//h1/LWuv+J/4c51/bWmp1rt0GxsbKHntvS69YKgt1Ik1sSSIKjbupykVxBgMcUgCCZ9sCRQQCLtJ1FrVexaRlukunBao6MUgqSACFYICLptciO4KkUUwAjpKwkdgig9wq0qodFJMJBkD5igMC5VCSJIFpV1V1YiFwqXFMow1ldWyJFALGvtMWUcyhh9wiFSH/7WeOaIwiBDhdslBKQeIzNdL7n/zZ0VathYsRDxApaLWYJSbVYZ8iXdf2vlVn+dwiF3Uo+olNesbRQ2zeOnMmLSnGWID21MoEsEERiOKoG4x9LFGVlq6WuR6PQU58I1WqvLDNR1Wv5wbLLksrm5q6jUmUmLctNBEgSVnjEOiU2Xx/SIZVXK4moZnmeZmnvwpUUSa2sRE2rwlcpWKmz1YTzFZ0f/7ksQ2gBVJhz2MsFfyyrQlPYYO+K9i1ZejmZrsy80dhja0JjQ5KqEdP16sU0737Nt3xmq6N+61l1w8XwqHi882v1muWmpgxxj1ayaP5lcM/4aFDhmYyAAW5HvxbJKEvSReCgS/KDSyEKUZzANA51QuAv2pqmLDjWGHKXutDkrfmGX2oqKGljQxnSVobug8W4Eg8DiTUeDuIvnp4ZFoxdiJiZZrw4wQrT51xGnWFLVzd74sNs7Vrra42csJVWVpysEnvXQLt6BNZnV1JyvXyP6Hulb3ueWXdWrmXV/1fieedWPu+43WpbmlLkrEy5vJWKtycbszEqqUcAKGuJYcytayf//4OA8AALZkzHGU26tpeFFUu6iioKw5pzouLKWswLEpEyItkvcuS2jOmHLGi0Zbk56QrgJFJfFkkfmGwLJVMV0wQoE20RDSbKrJECQqAMKQqZoiJpahmhZLCppUlzyatVmW3LaWlaFmBCzGKrMtj1hU1eLEzSpC6VSlZDsVhxjikzalq2qqAkGAlWNGMgxUTGAhTNmvsa5RmboVWZm+qFD/+5LEToAU3aEMzKR5CiQlUyjxsiDCjzqqXfz2DKbjkysgTkkjYNoJKkkmXw01QzrDq2aTxYUGSFLAhkatbLPstDBQQNHQ2UE6Dqy1hfEqMSsVR6DoUioTR4JZgfnkTy1pKhIaRPDBCw25G6uXHJ0XSknOF6xyN1pmBthu8zNbVaZZahYbcjds0zA25G7asMF3HlrTLTUMDdDQMhIWNP/FRX1C34sLEjNMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

// Convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const playSingleKeystroke = async () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
    if (audioCtx.state === "suspended") return;
  }

  if (!typingAudioBuffer) {
    try {
      const arrayBuffer = base64ToArrayBuffer(typingBase64);
      // Decode the audio data asynchronously
      typingAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error("Failed to decode typing sound", e);
      return;
    }
  }

  const source = audioCtx.createBufferSource();
  source.buffer = typingAudioBuffer;

  // Add slight random pitch variation so repeating keystrokes sound organic
  source.playbackRate.value = 0.95 + Math.random() * 0.1;

  source.connect(audioCtx.destination);
  source.start(0);
};

let typingLoopActive = false;

export const startTypingSound = async () => {
  if (typingLoopActive) return;
  typingLoopActive = true;

  const loop = async () => {
    if (!typingLoopActive) return;
    await playSingleKeystroke();

    // Simulate typical human typing speed: ~10 keystrokes a sec with random variance
    const delay = 60 + Math.random() * 80;
    setTimeout(loop, delay);
  };

  loop();
};

export const stopTypingSound = () => {
  typingLoopActive = false;
};
