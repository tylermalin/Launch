/**
 * patch-libsodium-wrappers.js
 *
 * Patches nested copies of libsodium-wrappers-sumo@0.7.10 so they are compatible
 * with libsodium-sumo@0.7.16+.
 *
 * Root cause: libsodium-wrappers-sumo@0.7.10 checks `_sodium_init() !== 0` but
 * libsodium-sumo@0.7.16 changed its Emscripten build so _sodium_init() returns 1
 * (already initialized) instead of 0 on subsequent module loads. The 0.7.16 wrapper
 * correctly uses `_sodium_init() < 0` — this script backports that check to all
 * nested 0.7.10 copies.
 *
 * Run via postinstall in the root package.json.
 */

const fs = require('fs')
const path = require('path')

const TARGETS = [
  // Nested under @meshsdk packages and @cardano-sdk
  'node_modules/@meshsdk/core/node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js',
  'node_modules/@meshsdk/provider/node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js',
  'node_modules/@cardano-sdk/input-selection/node_modules/libsodium-wrappers-sumo/dist/modules-sumo/libsodium-wrappers.js',
]

// The 0.7.10 check throws on any non-zero result; 0.7.16+ correctly uses < 0.
const OLD = '0!==t._sodium_init()'
const NEW = 't._sodium_init()<0'

let patched = 0
let skipped = 0

for (const relative of TARGETS) {
  const absolute = path.resolve(__dirname, '..', relative)
  if (!fs.existsSync(absolute)) {
    skipped++
    continue
  }
  const content = fs.readFileSync(absolute, 'utf8')
  if (!content.includes(OLD)) {
    // Already patched or different version
    skipped++
    continue
  }
  fs.writeFileSync(absolute, content.replace(OLD, NEW), 'utf8')
  console.log(`[patch-libsodium] Patched: ${relative}`)
  patched++
}

console.log(`[patch-libsodium] Done. Patched ${patched} file(s), skipped ${skipped}.`)
