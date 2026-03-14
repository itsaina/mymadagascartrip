#!/usr/bin/env node
/**
 * Twitter Automation Health Check & Self-Healing Script
 * Run: node health-check.js [--auto-fix]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_FIX = process.argv.includes('--auto-fix');
const REPORT_FILE = path.join(__dirname, '..', 'HEALTH_CHECK_REPORT.md');

// Colors for terminal output
const C = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

const results = {
  passed: [],
  failed: [],
  fixed: []
};

function log(status, message) {
  const symbol = status === 'pass' ? '✅' : status === 'fail' ? '❌' : status === 'warn' ? '⚠️' : '🔧';
  const color = status === 'pass' ? C.green : status === 'fail' ? C.red : status === 'warn' ? C.yellow : C.blue;
  console.log(`${color}${symbol} ${message}${C.reset}`);
  
  if (status === 'pass') results.passed.push(message);
  if (status === 'fail') results.failed.push(message);
  if (status === 'fix') results.fixed.push(message);
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return null;
  }
}

function getMadagascarTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Indian/Antananarivo' }));
}

// ==================== CHECKS ====================

async function checkCronJob() {
  console.log('\n' + C.bold + '📅 Checking Cron Job...' + C.reset);
  
  const cronList = runCommand('crontab -l');
  const hasTwitterCron = cronList && cronList.includes('tweet-calendar.js');
  
  if (hasTwitterCron) {
    log('pass', 'Cron job "Twitter Auto-Poster" exists');
    return true;
  }
  
  log('fail', 'Cron job "Twitter Auto-Poster" is MISSING');
  
  if (AUTO_FIX) {
    console.log('   Attempting to create cron job...');
    try {
      const currentCrontab = cronList || '# New crontab\n';
      const newCron = `${currentCrontab}\n# Twitter Auto-Poster (Calendrier)\n0 * * * * cd ${__dirname} && /usr/bin/node tweet-calendar.js >> /tmp/tweet-cron.log 2>&1\n`;
      
      fs.writeFileSync('/tmp/new_crontab', newCron);
      execSync('crontab /tmp/new_crontab');
      log('fix', 'Created Twitter cron job');
      return true;
    } catch (e) {
      log('fail', `Failed to create cron job: ${e.message}`);
      return false;
    }
  }
  return false;
}

async function checkCalendarFiles() {
  console.log('\n' + C.bold + '📋 Checking Calendar Files...' + C.reset);
  
  const today = getMadagascarTime().toISOString().split('T')[0];
  const dates = [0, 1, 2, 3].map(offset => {
    const d = new Date(getMadagascarTime());
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  });
  
  let allExist = true;
  for (const date of dates) {
    const filePath = path.join(__dirname, 'calendar', `${date}.json`);
    if (fs.existsSync(filePath)) {
      log('pass', `Calendar exists: ${date}.json`);
    } else {
      log('fail', `Calendar MISSING: ${date}.json`);
      allExist = false;
      
      if (AUTO_FIX && date === today) {
        console.log(`   ⚠️ Cannot auto-create calendar for today. Run: node schedule-tweets.js`);
      }
    }
  }
  
  return allExist;
}

async function checkScriptValidity() {
  console.log('\n' + C.bold + '📜 Checking Script Validity...' + C.reset);
  
  const scriptPath = path.join(__dirname, 'tweet-calendar.js');
  
  if (!fs.existsSync(scriptPath)) {
    log('fail', 'tweet-calendar.js not found');
    return false;
  }
  
  try {
    execSync(`node --check ${scriptPath}`, { stdio: 'pipe' });
    log('pass', 'tweet-calendar.js syntax is valid');
  } catch (e) {
    log('fail', 'tweet-calendar.js has syntax errors');
    return false;
  }
  
  // Check modules
  try {
    execSync('node -e "import(\'twitter-api-v2\').then(() => process.exit(0))"', { 
      cwd: __dirname,
      stdio: 'pipe'
    });
    log('pass', 'All dependencies load correctly');
  } catch (e) {
    log('fail', 'Missing dependencies (node_modules)');
    
    if (AUTO_FIX) {
      console.log('   Running npm install...');
      try {
        execSync('npm install', { cwd: __dirname, stdio: 'pipe' });
        log('fix', 'Reinstalled node_modules');
      } catch (e2) {
        log('fail', `Failed to install dependencies: ${e2.message}`);
        return false;
      }
    }
  }
  
  return true;
}

async function checkAPICredentials() {
  console.log('\n' + C.bold + '🔑 Checking API Credentials...' + C.reset);
  
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envPath)) {
    log('fail', '.env file not found');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const required = ['API_KEY', 'API_SECRET', 'ACCESS_TOKEN', 'ACCESS_TOKEN_SECRET'];
  const missing = required.filter(key => !envContent.includes(`${key}=`));
  
  if (missing.length === 0) {
    log('pass', 'All required API credentials present');
    return true;
  }
  
  log('fail', `Missing credentials: ${missing.join(', ')}`);
  return false;
}

async function checkSentTweetsLog() {
  console.log('\n' + C.bold + '📝 Checking Sent Tweets Log...' + C.reset);
  
  const logPath = path.join(__dirname, 'sent-tweets.json');
  
  if (!fs.existsSync(logPath)) {
    log('fail', 'sent-tweets.json not found');
    
    if (AUTO_FIX) {
      try {
        fs.writeFileSync(logPath, '[]');
        log('fix', 'Created sent-tweets.json');
        return true;
      } catch (e) {
        log('fail', `Failed to create log: ${e.message}`);
        return false;
      }
    }
    return false;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    log('pass', `sent-tweets.json exists (${content.length} entries)`);
    
    // Check writability
    fs.accessSync(logPath, fs.constants.W_OK);
    log('pass', 'sent-tweets.json is writable');
    return true;
  } catch (e) {
    log('fail', `sent-tweets.json corrupted: ${e.message}`);
    
    if (AUTO_FIX) {
      try {
        fs.writeFileSync(logPath, '[]');
        log('fix', 'Reset sent-tweets.json');
        return true;
      } catch (e2) {
        log('fail', `Failed to reset log: ${e2.message}`);
        return false;
      }
    }
    return false;
  }
}

async function checkPermissions() {
  console.log('\n' + C.bold + '🔒 Checking File Permissions...' + C.reset);
  
  const scripts = ['tweet-calendar.js', 'catchup-tweets.js', 'schedule-tweets.js'];
  let allGood = true;
  
  for (const script of scripts) {
    const scriptPath = path.join(__dirname, script);
    if (!fs.existsSync(scriptPath)) continue;
    
    const stats = fs.statSync(scriptPath);
    const isExecutable = (stats.mode & 0o111) !== 0;
    
    if (isExecutable) {
      log('pass', `${script} is executable`);
    } else {
      log('warn', `${script} not executable`);
      
      if (AUTO_FIX) {
        try {
          fs.chmodSync(scriptPath, 0o755);
          log('fix', `Fixed permissions on ${script}`);
        } catch (e) {
          log('fail', `Failed to fix permissions: ${e.message}`);
          allGood = false;
        }
      } else {
        allGood = false;
      }
    }
  }
  
  return allGood;
}

async function checkMissedTweets() {
  console.log('\n' + C.bold + '⏰ Checking for Missed Tweets...' + C.reset);
  
  const madagascarTime = getMadagascarTime();
  const today = madagascarTime.toISOString().split('T')[0];
  const currentHour = madagascarTime.getHours();
  
  const calendarPath = path.join(__dirname, 'calendar', `${today}.json`);
  
  if (!fs.existsSync(calendarPath)) {
    log('warn', `No calendar for today (${today})`);
    return false;
  }
  
  const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
  const missedTweets = calendar.tweets.filter(t => {
    const tweetHour = parseInt(t.time.split(':')[0]);
    return tweetHour <= currentHour && !t.sent;
  });
  
  if (missedTweets.length === 0) {
    log('pass', 'No missed tweets - all caught up!');
    return true;
  }
  
  log('warn', `${missedTweets.length} tweet(s) missed today`);
  missedTweets.forEach(t => console.log(`   - ${t.time}: ${t.theme}`));
  
  if (AUTO_FIX) {
    console.log('   Running catchup-tweets.js...');
    try {
      execSync('node catchup-tweets.js', { 
        cwd: __dirname, 
        stdio: 'inherit',
        timeout: 120000
      });
      log('fix', `Sent ${missedTweets.length} missed tweet(s)`);
      return true;
    } catch (e) {
      log('fail', `Catchup failed: ${e.message}`);
      return false;
    }
  }
  
  return false;
}

// ==================== MAIN ====================

async function main() {
  console.log(C.bold + C.blue + `
╔══════════════════════════════════════════════════════════════╗
║     Twitter Automation Health Check & Self-Healing Agent     ║
╚══════════════════════════════════════════════════════════════╝
${C.reset}`);
  
  console.log(`Mode: ${AUTO_FIX ? 'AUTO-FIX ENABLED' : 'CHECK ONLY (use --auto-fix to repair)'}`);
  console.log(`Time (Madagascar): ${getMadagascarTime().toLocaleString()}`);
  console.log(`Script Directory: ${__dirname}`);
  
  // Run all checks
  await checkCronJob();
  await checkCalendarFiles();
  await checkScriptValidity();
  await checkAPICredentials();
  await checkSentTweetsLog();
  await checkPermissions();
  await checkMissedTweets();
  
  // Summary
  console.log('\n' + C.bold + '══════════════════════════════════════════════════════════════' + C.reset);
  console.log(C.bold + '📊 SUMMARY' + C.reset);
  console.log(`   ${C.green}✅ Passed: ${results.passed.length}${C.reset}`);
  console.log(`   ${C.blue}🔧 Fixed: ${results.fixed.length}${C.reset}`);
  console.log(`   ${results.failed.length > 0 ? C.red : C.green}❌ Failed: ${results.failed.length}${C.reset}`);
  
  if (results.failed.length > 0) {
    console.log('\n' + C.red + 'Failed checks:' + C.reset);
    results.failed.forEach(f => console.log(`   - ${f}`));
  }
  
  if (results.fixed.length > 0) {
    console.log('\n' + C.blue + 'Applied fixes:' + C.reset);
    results.fixed.forEach(f => console.log(`   - ${f}`));
  }
  
  const exitCode = results.failed.length > 0 ? 1 : 0;
  
  console.log('\n' + (exitCode === 0 ? C.green + '✅ System is healthy!' : C.red + '❌ Some issues require attention') + C.reset);
  console.log(C.bold + '══════════════════════════════════════════════════════════════\n' + C.reset);
  
  process.exit(exitCode);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
