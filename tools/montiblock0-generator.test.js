#!/usr/bin/env node

/**
 * Test suite for montiblock0-generator.js
 */

const { generateMontiBlock0 } = require('./montiblock0-generator.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  ${error.message}`);
        failed++;
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
    }
}

// Test 1: Basic functionality with DEADBEEF
test('generates correct Block 0 for DEADBEEF', () => {
    const result = generateMontiBlock0('DEADBEEF');
    // UID: DEADBEEF
    // BCC: DE ^ AD ^ BE ^ EF = 22
    // SAK: 08
    // ATQA: 04 00
    // Manufacturer: 4D 4E FF FF FF FF FF FF
    assertEqual(result, 'DEADBEEF220804004D4EFFFFFFFFFFFF', 'Block 0 should match expected format');
});

// Test 2: UID with spaces
test('handles UID with spaces', () => {
    const result = generateMontiBlock0('DE AD BE EF');
    assertEqual(result, 'DEADBEEF220804004D4EFFFFFFFFFFFF', 'Should handle spaces in UID');
});

// Test 3: Lowercase UID
test('handles lowercase UID', () => {
    const result = generateMontiBlock0('deadbeef');
    assertEqual(result, 'DEADBEEF220804004D4EFFFFFFFFFFFF', 'Should handle lowercase UID');
});

// Test 4: Different UID (11223344)
test('generates correct Block 0 for 11223344', () => {
    const result = generateMontiBlock0('11223344');
    // BCC: 11 ^ 22 ^ 33 ^ 44 = 44
    assertEqual(result, '11223344440804004D4EFFFFFFFFFFFF', 'Block 0 should match for different UID');
});

// Test 5: All zeros UID
test('generates correct Block 0 for 00000000', () => {
    const result = generateMontiBlock0('00000000');
    // BCC: 00 ^ 00 ^ 00 ^ 00 = 00
    assertEqual(result, '00000000000804004D4EFFFFFFFFFFFF', 'Block 0 should handle all zeros');
});

// Test 6: All FFs UID
test('generates correct Block 0 for FFFFFFFF', () => {
    const result = generateMontiBlock0('FFFFFFFF');
    // BCC: FF ^ FF ^ FF ^ FF = 00
    assertEqual(result, 'FFFFFFFF000804004D4EFFFFFFFFFFFF', 'Block 0 should handle all FFs');
});

// Test 7: Error handling - too short UID
test('throws error for too short UID', () => {
    try {
        generateMontiBlock0('DEAD');
        throw new Error('Should have thrown an error for short UID');
    } catch (error) {
        if (!error.message.includes('ONLY 4-BYTE UIDS SUPPORTED')) {
            throw new Error('Should throw correct error message');
        }
    }
});

// Test 8: Error handling - too long UID
test('throws error for too long UID', () => {
    try {
        generateMontiBlock0('DEADBEEFAA');
        throw new Error('Should have thrown an error for long UID');
    } catch (error) {
        if (!error.message.includes('ONLY 4-BYTE UIDS SUPPORTED')) {
            throw new Error('Should throw correct error message');
        }
    }
});

// Test 9: Block structure validation
test('generates correct 16-byte (32 hex chars) block', () => {
    const result = generateMontiBlock0('12345678');
    assertEqual(result.length, 32, 'Block 0 should be 32 hex characters (16 bytes)');
});

// Test 10: Monti signature validation
test('includes Monti signature (4D4E)', () => {
    const result = generateMontiBlock0('AABBCCDD');
    if (!result.includes('4D4E')) {
        throw new Error('Block 0 should contain Monti signature (4D4E)');
    }
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${passed}`);
console.log(`Tests failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
    process.exit(1);
}
