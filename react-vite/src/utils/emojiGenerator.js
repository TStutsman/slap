import fs from 'fs';

const emojiCodes = [];

for(let i = 128512; i < 129512; i++) {
    emojiCodes.push('0x' + i.toString(16));
}

const output = 'const emojiCodes = [\n' + emojiCodes.join(',\n') + '];';

fs.writeFileSync('./emojiCodes.js', output);