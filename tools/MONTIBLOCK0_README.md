# MONTIAI Block 0 Generator

A JavaScript utility for generating valid MIFARE Classic Manufacturer Block (Block 0) with Monti-Signatures for Gen2 (CUID) Direct Write Protocol.

## Overview

This tool generates a 16-byte Block 0 for MIFARE Classic 1K cards, which includes:
- 4-byte UID (User provided)
- 1-byte BCC (Block Check Character - automatically calculated)
- 1-byte SAK (Select Acknowledge - 0x08)
- 2-byte ATQA (Answer To Request - 0x0400)
- 8-byte Manufacturer Data (Monti-Signature: 0x4D4E followed by 6 filler bytes)

## Usage

### Command Line

```bash
# Using node
node montiblock0-generator.js <UID>

# As executable (after chmod +x)
./montiblock0-generator.js <UID>

# Display help
node montiblock0-generator.js --help
```

### Examples

```bash
# Generate Block 0 for UID DEADBEEF
node montiblock0-generator.js DEADBEEF
# Output: >> GENERATED BLOCK 0: DEADBEEF220804004D4EFFFFFFFFFFFF

# With spaces in UID
node montiblock0-generator.js "DE AD BE EF"
# Output: >> GENERATED BLOCK 0: DEADBEEF220804004D4EFFFFFFFFFFFF

# Different UID
node montiblock0-generator.js 11223344
# Output: >> GENERATED BLOCK 0: 11223344440804004D4EFFFFFFFFFFFF
```

### As a Module

```javascript
const { generateMontiBlock0 } = require('./montiblock0-generator.js');

try {
    const block0 = generateMontiBlock0('DEADBEEF');
    console.log(block0); // DEADBEEF220804004D4EFFFFFFFFFFFF
} catch (error) {
    console.error(error.message);
}
```

## Technical Details

### Block 0 Structure (16 bytes / 32 hex characters)

| Bytes | Description | Example Value |
|-------|-------------|---------------|
| 0-3   | UID         | DE AD BE EF   |
| 4     | BCC         | 22            |
| 5     | SAK         | 08            |
| 6-7   | ATQA        | 04 00         |
| 8-15  | Manufacturer Data | 4D 4E FF FF FF FF FF FF |

### BCC Calculation

The BCC (Block Check Character) is calculated as the XOR of the 4 UID bytes:

```
BCC = UID[0] ^ UID[1] ^ UID[2] ^ UID[3]
```

For example, with UID `DEADBEEF`:
```
BCC = 0xDE ^ 0xAD ^ 0xBE ^ 0xEF = 0x22
```

### Monti-Signature

The manufacturer data includes the Monti-Signature:
- Bytes 8-9: `4D 4E` (ASCII: "MN" for MontiNode)
- Bytes 10-15: `FF FF FF FF FF FF` (Filler)

## Testing

Run the test suite:

```bash
node montiblock0-generator.test.js
```

The test suite validates:
- Correct Block 0 generation for various UIDs
- BCC calculation accuracy
- Input format handling (spaces, case)
- Error handling for invalid UIDs
- Block structure and signature validation

## Requirements

- Node.js (v10 or higher recommended)

## Use Cases

This tool is designed for:
- MIFARE Classic card cloning and testing
- Gen2 CUID card programming
- Security research and penetration testing
- RFID development and prototyping

## Output Format

The output is a 32-character hexadecimal string representing the 16-byte Block 0, ready for direct write to Sector 0 of a MIFARE Classic card.

## Error Handling

The tool validates input and throws errors for:
- UIDs that are not exactly 4 bytes (8 hex characters)
- Invalid hexadecimal characters

## License

Part of the Proxmark3 RRG/Iceman repository. See LICENSE.txt for details.

## Related Documentation

- [MIFARE Classic Notes](../doc/mfc_notes.md)
- [Magic Cards Notes](../doc/magic_cards_notes.md)
- [Cloner Notes](../doc/cloner_notes.md)
