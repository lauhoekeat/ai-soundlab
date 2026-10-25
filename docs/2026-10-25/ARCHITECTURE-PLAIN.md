# Where the app runs

1. **GitHub Pages** serves the app screens, simulations and local microphone functions.
2. **A small proxy server** receives only bounded student text, checks class access and usage caps, then calls OpenAI.
3. **OpenAI API** generates the pedagogical feedback. It does not host the app or the proxy. A ChatGPT subscription/chat is separate from this app's API use.

Cloudflare Workers is the proposed host for step 2. Its Durable Object holds only usage counters, needed for strict caps across simultaneous requests. No pupil database or audio uploads. The proxy is currently running locally on the owner's computer; it has passed real AI connectivity checks. A hosted proxy has not been deployed because Cloudflare is not signed in.

GitHub Pages cannot keep an API key securely in a browser bundle or run this server process. The OpenAI key must remain in the proxy's server secret store. The owner has configured a local ignored server env, not a public frontend env. GitHub receives no provider key.

This means the published diagnostic can run local audio/text storage while hosted AI setup is pending, but it is not yet a competition-ready live AI link. After backend deployment, the frontend needs only the public proxy URL. Neither the owner's computer nor a ChatGPT chat needs to stay open for the hosted version to run.

On 25 October the owner asked about a 'ChatGPT site' backend, then clarified they were unsure about architecture. No Sites backend was created. Cloudflare remains the tested proposed deployment route; an alternate host would need to preserve authenticated requests and durable global caps, not just run the model.
