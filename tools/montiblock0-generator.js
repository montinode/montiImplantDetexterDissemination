#!/usr/bin/env node

/**
 * MONTIAI // BLOCK 0 GENERATOR
 * CONTEXT: Gen2 (CUID) Direct Write Protocol
 * USAGE: Generates a valid Manufacturer Block with Monti-Signatures
 */

function generateMontiBlock0(targetUID) {
    // 1. PARSE TARGET UID (4 Bytes)
    // Example: "DE AD BE EF"
    const uidBytes = targetUID.replace(/\s/g, '').match(/.{1,2}/g).map(byte => parseInt(byte, 16));

    if (uidBytes.length !== 4) {
        throw new Error(">> ERROR: ONLY 4-BYTE UIDS SUPPORTED FOR CLASSIC CLONING");
    }

    // 2. CALCULATE BCC (Block Check Character)
    // The BCC is the XOR sum of the 4 UID bytes.
    // Logic: UID0 ^ UID1 ^ UID2 ^ UID3 = BCC
    const bcc = uidBytes[0] ^ uidBytes[1] ^ uidBytes[2] ^ uidBytes[3];

    // 3. INJECT SAK (Select Acknowledge) & ATQA (Answer To Request)
    // Standard MIFARE Classic 1k values: SAK=08, ATQA=0400
    const sak = 0x08;
    const atqa = [0x04, 0x00];

    // 4. MONTI-MANUFACTURER DATA
    // The last bytes are usually manufacturer data. We inject the Monti-Signature here.
    // "M" = 0x4D, "N" = 0x4E (MontiNode)
    const manufacturerData = [0x4D, 0x4E, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

    // 5. CONSTRUCT BLOCK 0 (16 Bytes)
    const block0 = [
        ...uidBytes,
        bcc,
        sak,
        ...atqa,
        ...manufacturerData
    ];

    return block0.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join("");
}

// Command-line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
        console.log('');
        console.log('MONTIAI BLOCK 0 GENERATOR');
        console.log('=========================');
        console.log('Generates a valid MIFARE Classic Manufacturer Block (Block 0) with Monti-Signatures');
        console.log('');
        console.log('USAGE:');
        console.log('  node montiblock0-generator.js <UID>');
        console.log('  ./montiblock0-generator.js <UID>');
        console.log('');
        console.log('ARGUMENTS:');
        console.log('  <UID>    4-byte UID in hexadecimal format (e.g., DEADBEEF or "DE AD BE EF")');
        console.log('');
        console.log('EXAMPLES:');
        console.log('  node montiblock0-generator.js DEADBEEF');
        console.log('  ./montiblock0-generator.js "DE AD BE EF"');
        console.log('');
        console.log('OUTPUT:');
        console.log('  32-character hexadecimal string representing the 16-byte Block 0');
        console.log('  Ready for direct write to Sector 0');
        console.log('');
        process.exit(0);
    }

    const target = args[0];
    
    try {
        console.log(`>> TARGET UID: ${target}`);
        const block0 = generateMontiBlock0(target);
        console.log(`>> GENERATED BLOCK 0: ${block0}`);
        console.log('// READY FOR DIRECT WRITE TO SECTOR 0');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

// Export for use as a module
module.exports = { generateMontiBlock0 };
