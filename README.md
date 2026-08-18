# dsh-better-api

An enhanced **Models settings** plugin for the DSH Web GUI: per-model **reasoning strength** (reasoningEfforts) editing for your custom models.

The official models settings page deliberately ships no reasoning-effort control (it treats effort as a per-model capability). This plugin adds it to the official model-catalog editor:

- Each model row gains a **Reasoning strength** checkbox group: `off / minimal / low / medium / high / xhigh / max`
- Checked levels are written into the model's `reasoningEfforts` (levels are sent under their own name; `off` is special-cased to "send no parameter")
- Unchecking everything removes the declaration, so the model falls back to "no reasoning" and no misleading control is shown
- Hand-declared custom models (OpenAI-compatible gateways, etc.) now get an **Effort** menu in the conversation model picker (provider default + the declared levels); picking one persists it as the session default

Forked from the official [@deepseek-ai/dsh-client-ui-settings-models](https://github.com/deepseek-ai/deepseek-harness) (MIT) with only this editing capability added; everything else behaves like the official plugin.

## Features

- Settings → Models → any provider → model catalog → expand a model row → check reasoning levels
- Also available while creating a new custom provider
- Full en/zh UI copy
- Writes land in the settings document (e.g. `~/.dsh/settings.yaml`) on save — no restart required

## Install

### Option 1: one-click from the dsh-market plugin market (recommended)

1. Once this plugin is listed in the [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) registry (see "Submitting to the market" below),
   open the **plugin market** (dshmarket) in the Web GUI, search **dsh-better-api**, and click **Install**.
2. The market runs `dsh plugin --profile web add github:131CDA1/dsh-better-api`;
   the bundled `cordis.patch.yml` is merged automatically: it **disables the official models-settings row `ui-settings-models`** and inserts the `dsh-better-api` row.
3. Refresh the page.

### Option 2: command line

```bash
cd ~/.dsh/profiles/web
npm i github:131CDA1/dsh-better-api
# merge the repo-root cordis.patch.yml into this profile's cordis.patch.yml
```

or directly:

```bash
dsh plugin --profile web add github:131CDA1/dsh-better-api
```

### Why must the official models settings page be disabled?

This plugin and the official one share the same `settings.section#models` slot; enabling both throws a duplicate-registration error.
This plugin is an enhanced replacement for the official models settings page — the bundled patch disables the official row
(`ui-settings-models` / `@deepseek-ai/dsh-client-ui-settings-models`) automatically; if you install manually, disable that row in the plugin inventory first.

## Does it conflict with other plugins?

**No conflict with API proxy / relay / usage plugins.** Rationale:

- This is a **pure client-side UI plugin**: the host side is an empty stub; it registers no model tools, intercepts no requests,
  provides no LLM routing, and does not own any settings namespace (reasoning strengths are still written via the official
  `settings.mutate` into the officially-schema'd `reasoningEfforts` field).
- Its only cross-plugin state is two slot registrations (`settings.section#models`, `settings.onboarding`). DSH's slot
  registry **throws on duplicate ids** in a list slot, so the only possible hard conflict is another plugin registering
  `settings.section#models` as well — the official one is disabled by our patch; any future fork of the same section
  must not be enabled side-by-side.
- API proxy / key-pool / relay (one-api, new-api style) / usage plugins either take over providers and requests on the
  host side or register UI areas under **their own distinct slot ids** — they never touch `settings.section#models`.
  Providers they configure still show up in the models page (it reads the same `llm.providers` directory), and their
  models can equally declare reasoning strengths here — complementary, not conflicting.
- Model-picker enhancers (reasoning sliders such as dsh-reasoning-slider, dsh-models-dev-reasoning) read the **same
  adapter reasoning metadata** (exactly the data this plugin edits) and register no settings-section slots, so they
  coexist; two plugins writing `reasoningEfforts` for one model simply last-write-wins in the settings document.

In one sentence: this plugin owns only the "Models settings" slot; anything that does not claim that same slot coexists.

## Usage

1. Open **Settings → Models**, expand your provider card (e.g. custom `gpt`).
2. In **Models**, expand a model row (advanced area) and check the reasoning levels you want.
3. Click **Apply**.
4. Back in a conversation, select that model — the **Effort** menu now shows the declared levels.

## Config reference (settings.yaml)

`reasoningEfforts` declares a model's selectable thinking levels: each key is a level selectors offer, its value the spelling dispatch sends on the wire (`low: low` passes the canonical name through; `max: ultra` renames it for a gateway with its own vocabulary). Keys come from the level set `off / minimal / low / medium / high / xhigh / max`; a level not declared is not offered.

```yaml
llm-pi-ai:
  providers:
    gpt:
      apiKeyEnv: GPT_API_KEY
      api: openai-completions
      baseURL: https://api.example.com
      models:
        - id: gpt-5.6-sol
          name: GPT-5.6 Sol
          reasoningEfforts:
            low: low
            medium: medium
            high: high
```

- `off` is the one three-state key: declared with no value (`off:`) offers Off and sends no parameter when selected; declared with a value (`off: none`) sends that value.
- Once declared, the declaration is the whole offer — restate every level you want to keep.
- For gateways with their own vocabulary, change the value (e.g. `max: ultra`) — no UI change needed.

## Submitting to the market (prerequisite for one-click install)

dsh-market's one-click install only accepts sources listed in the curated [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
registry (`awesome-dsh-plugin.com/plugins.json`), so first submit an inclusion PR:

1. Push this repo to GitHub: `git@github.com:131CDA1/dsh-better-api.git` (**main** branch).
2. Add the **`dsh-plugin`** topic in the repo's Settings → Topics.
3. Fork [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin),
   add `data/plugins/131CDA1__dsh-better-api.yml` (content in this repo's `market/awesome-dsh-plugin-entry.yml`),
   run `npm ci && node scripts/generate-readme.mjs` to regenerate the READMEs, commit, open the PR.
4. Listing gates (CI-checked): repo **older than 1 day**, **10+ commits**, package.json declares the
   `dsh.bundle` manifest (already done here), and the description matches the code.
5. After merge, the market UI picks it up; the one-click install command is
   `dsh plugin --profile web add github:131CDA1/dsh-better-api`.

Pushing a `v*` tag triggers GitHub Actions to build the release artifacts (zip + `dsh-better-api.tgz` + SHA256SUMS)
and publish a GitHub Release; the registry's `tarball:` field points at the fixed-name `dsh-better-api.tgz`.

## License

MIT. Fork of [@deepseek-ai/dsh-client-ui-settings-models](https://github.com/deepseek-ai/deepseek-harness); upstream copyright retained.
