import fs from 'fs';
import { compile } from 'json-schema-to-typescript';
import schema from './schema.json' assert { type: 'json' };

// compile from file
compile(schema).then((ts) => fs.writeFileSync('schema.d.ts', ts));
