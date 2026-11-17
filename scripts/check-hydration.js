#!/usr/bin/env node

/**
 * Script to check for common hydration issues in HRMS module
 * Run with: node scripts/check-hydration.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HRMS_PATH = path.join(__dirname, '../app/(root)/hrms');

// Patterns that commonly cause hydration issues
const PROBLEMATIC_PATTERNS = [
    {
        pattern: /useState\s*\(\s*[^)]*new Date\(\)/g,
        message: 'useState initialized with new Date() - causes hydration mismatch',
        severity: 'error'
    },
    {
        pattern: /useState\s*\(\s*[^)]*Date\.now\(\)/g,
        message: 'useState initialized with Date.now() - causes hydration mismatch',
        severity: 'error'
    },
    {
        pattern: /useState\s*\(\s*[^)]*Math\.random\(\)/g,
        message: 'useState initialized with Math.random() - causes hydration mismatch',
        severity: 'error'
    },
    {
        pattern: /const\s+\w+\s*=\s*new Date\(\)\.get/g,
        message: 'Direct Date calculation in component body - causes hydration mismatch',
        severity: 'error'
    },
    {
        pattern: /useState\s*\(\s*[^)]*\?\.\w+\s*\|\|/g,
        message: 'useState initialized with optional chaining - may cause hydration mismatch',
        severity: 'warning'
    },
    {
        pattern: /typeof window\s*!==\s*['"]undefined['"]/g,
        message: 'Direct window check - consider using useState + useEffect pattern',
        severity: 'warning'
    }
];

function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findFiles(filePath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];

    PROBLEMATIC_PATTERNS.forEach(({ pattern, message, severity }) => {
        const matches = content.match(pattern);
        if (matches) {
            const lines = content.split('\n');
            matches.forEach(match => {
                const lineNumber = lines.findIndex(line => line.includes(match)) + 1;
                issues.push({
                    file: path.relative(process.cwd(), filePath),
                    line: lineNumber,
                    message,
                    severity,
                    match: match.substring(0, 50)
                });
            });
        }
    });

    return issues;
}

function main() {
    console.log('🔍 Checking HRMS module for hydration issues...\n');

    if (!fs.existsSync(HRMS_PATH)) {
        console.error('❌ HRMS path not found:', HRMS_PATH);
        process.exit(1);
    }

    const files = findFiles(HRMS_PATH);
    const allIssues = [];

    files.forEach(file => {
        const issues = checkFile(file);
        allIssues.push(...issues);
    });

    // Group by severity
    const errors = allIssues.filter(i => i.severity === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning');

    // Print results
    if (errors.length > 0) {
        console.log('❌ ERRORS (must fix):\n');
        errors.forEach(issue => {
            console.log(`  ${issue.file}:${issue.line}`);
            console.log(`    ${issue.message}`);
            console.log(`    Found: ${issue.match}\n`);
        });
    }

    if (warnings.length > 0) {
        console.log('⚠️  WARNINGS (should review):\n');
        warnings.forEach(issue => {
            console.log(`  ${issue.file}:${issue.line}`);
            console.log(`    ${issue.message}`);
            console.log(`    Found: ${issue.match}\n`);
        });
    }

    if (allIssues.length === 0) {
        console.log('✅ No hydration issues detected!');
        process.exit(0);
    } else {
        console.log(`\n📊 Summary: ${errors.length} errors, ${warnings.length} warnings`);
        process.exit(errors.length > 0 ? 1 : 0);
    }
}

main();

