import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const foundryAppPath = process.env.FOUNDRY_APP_PATH
  ?? 'F:\\FVTT\\FVTT v13.351\\App\\resources\\app';
const { ClassicLevel } = require(
  path.join(foundryAppPath, 'node_modules', 'classic-level'),
);

const documentKeyPrefixes = {
  Actor: '!actors!',
  Item: '!items!',
};

const manifest = JSON.parse(
  await readFile(path.join(repositoryRoot, 'module.json'), 'utf8'),
);
const summary = {};

for (const pack of manifest.packs) {
  const database = new ClassicLevel(
    path.join(repositoryRoot, pack.path),
    {
      keyEncoding: 'utf8',
      valueEncoding: 'json',
    },
  );
  const folders = [];
  let documents = 0;

  await database.open({ readOnly: true });

  for await (const [key, value] of database.iterator()) {
    if (key.startsWith(documentKeyPrefixes[pack.type])) {
      documents += 1;
    }

    if (key.startsWith('!folders!')) {
      folders.push(value.name);
    }
  }

  await database.close();

  summary[pack.name] = {
    documentType: pack.type,
    documents,
    folders: folders.sort((left, right) => left.localeCompare(right, 'ko')),
  };
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
