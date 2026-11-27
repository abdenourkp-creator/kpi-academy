# KPI Academy — Test Build

This is a static HTML/CSS/Vanilla JavaScript application. It must be served over HTTP; opening `index.html` directly with `file://` will break curriculum and lesson fetches.

## Download the test build

Open the successful **KPI Academy QA** run for Draft PR #4. Download `kpi-academy-test-build`, unzip it, and extract the enclosed tar.gz into an empty directory. Open a terminal in the directory containing `index.html`. The tested SHA is in `TESTED-COMMIT.txt`. Browser captures and measurements are in `review/`. See `FOUNDER-HOME-REVIEW.md` for the Arabic review checklist.

## Run locally

Requirements: Python 3 or Node.js 22.

### Python
```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

### Node.js (no extra packages)
```bash
node -e "require('http').createServer((req,res)=>{const fs=require('fs'),path=require('path');const file=path.join(process.cwd(),decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.createReadStream(file).on('error',()=>{res.statusCode=404;res.end('Not found')}).pipe(res)}).listen(4173)"
```

Open `http://localhost:4173` in a modern browser.

## Suggested acceptance path

1. Open Dashboard and confirm the learning summary shows a loading state or the next lesson; it must never claim all 32 lessons are complete on a fresh profile.
2. Open Modules → Business Mathematics → BM-001.
3. Confirm opening the lesson awards 0 XP.
4. Attempt completion without all four evidence items; it must be blocked.
5. Mark Interactive Lab, Professional Challenge, Field Checklist, and learner attestation; complete the lesson and confirm +90 XP.
6. Refresh and confirm progress remains on the same browser/device.
7. Open Progress and inspect all eight chapter assessments plus the final practical exam.
8. Complete a chapter assessment; confirm the 80% pass threshold and attempt history.
9. Retake it with a lower score; confirm the best score and prior pass are retained.
10. Export a backup, reset progress, then restore the backup.
11. From Dashboard, open the BM-005 practical lab. Confirm both practice and evidence-based completion award zero new XP. Verify 29,400 MAD and 70.0% for the prefilled example. Set sales to 0 to verify that the margin becomes unavailable.
12. Play the short videos in BM-001 and BM-005. Repeat on a mobile viewport to check navigation and horizontal overflow.

## Test data reset

Use Progress → Reset Progress. Export a backup first if you need to preserve the test record. Reset affects this browser only.

## Current boundaries

- Progress is local to one browser/device; no account or cloud sync.
- Evidence is learner self-attested; no instructor/server verification.
- Assessment answer keys and scores are client-side; no secure proctoring.
- Certificate eligibility is calculated; no certificate file is generated.
- Analytics Lab and Management Simulator use synthetic data. The detailed Accounting and Restaurant KPIs curricula are still in development.
- This build is a test candidate, not a production release.
